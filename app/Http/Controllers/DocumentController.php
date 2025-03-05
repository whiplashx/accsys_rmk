<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Indicator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Crypt;

class DocumentController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:50240', // 50MB max size, no file type restriction
            'task_id' => 'required|exists:tasks,id',
            'user_id' => 'required|exists:users,id',
            'indicator_id' => 'required|exists:indicators,id',
        ]);
    
        $file = $request->file('file');
    
        // Store the uploaded file in the private storage
        $path = Storage::disk('private')->put('task_documents', $file);
    
        // Create a new document record
        $document = Document::create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'task_id' => $request->task_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    
        // Retrieve the indicator using the provided indicator_id
        $indicator = Indicator::find($request->indicator_id);
        
        // Store the document ID in the indicators table
        $indicator->documents = $document->id;
        $indicator->save();
    
        // Return the document as a response
        return response()->json($document, 201);
    }
    
    public function view($documentId)
    {
        // Fetch the document from the database
        $document = Document::find($documentId);

        if (!$document || !Storage::disk('private')->exists($document->path)) {
            abort(404, 'File not found.');
        }

        return new StreamedResponse(function () use ($document) {
            $stream = Storage::disk('private')->readStream($document->path);
            fpassthru($stream);
        }, 200, [
            'Content-Type' => Storage::disk('private')->mimeType($document->path),
            'Content-Disposition' => 'inline; filename="' . $document->name . '"',
        ]);
    }

    public function getTaskDocument($taskId)
    {
        // Attempt to retrieve the latest document for the given task ID
        $document = Document::where('id', $taskId)->latest()->first();
    
        // If no document is found, return null
        if (!$document) {
            return response()->json(null);
        }
    
        // Return the document as JSON if it exists
        return response()->json($document);
    }
    
    public function index()
    {
        return response()->json(Document::all());
    }

    /**
     * Get document details by ID
     * 
     * @param int $id The document ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDocument($id)
    {
        Log::info('Fetching document details', ['id' => $id]);
        
        try {
            // Validate ID is numeric
            if (!is_numeric($id)) {
                Log::error('Invalid document ID format', ['id' => $id]);
                return response()->json(['error' => 'Invalid document ID format'], 400);
            }
            
            // Find the document
            $document = Document::find($id);
            
            if (!$document) {
                Log::error('Document not found in database', ['id' => $id]);
                return response()->json(['error' => 'Document not found'], 404);
            }
            
            // Check if the document file exists in storage
            if (!Storage::exists($document->path)) {
                Log::error('Document file missing from storage', [
                    'id' => $document->id, 
                    'path' => $document->path
                ]);
                
                // Return the document data anyway, but with a warning
                return response()->json([
                    'id' => $document->id,
                    'name' => $document->name,
                    'path' => $document->path,
                    'task_id' => $document->task_id,
                    'created_at' => $document->created_at,
                    'updated_at' => $document->updated_at,
                    'warning' => 'File exists in database but not in storage'
                ]);
            }
            
            Log::info('Document found and verified', [
                'id' => $document->id,
                'name' => $document->name,
                'path' => $document->path,
                'task_id' => $document->task_id
            ]);
            
            return response()->json($document);
        } catch (\Exception $e) {
            Log::error('Error fetching document', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Stream a document securely from private storage using document ID
     * 
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function streamSecureDocument(Request $request)
    {
        $documentId = $request->id;
        
        // Log request information for debugging
        Log::info('Document stream request received', [
            'id' => $documentId,
            'user_id' => auth()->id(),
            'user_ip' => $request->ip(),
            'all_params' => $request->all(),
        ]);
        
        if (empty($documentId)) {
            Log::error('Document ID not specified');
            abort(404, 'Document ID not specified');
        }
        
        try {
            // Check if ID is numeric
            if (!is_numeric($documentId)) {
                Log::error('Invalid document ID format', ['id' => $documentId]);
                abort(400, 'Invalid document ID format');
            }
            
            // Find document by ID
            try {
                $document = Document::findOrFail($documentId);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                Log::error('Document not found in database', ['id' => $documentId]);
                abort(404, 'Document ID not found in database');
            }
            
            Log::info('Document found, preparing to stream', [
                'id' => $document->id,
                'name' => $document->name,
                'path' => $document->path
            ]);
            
            // Validate path format first
            if (empty($document->path)) {
                Log::error('Document has empty file path', ['id' => $documentId]);
                abort(500, 'Document has no associated file path');
            }
            
            // Check if file exists in storage
            if (!Storage::exists($document->path)) {
                Log::error('Document file missing from storage', [
                    'id' => $document->id, 
                    'path' => $document->path,
                    'storage_path' => Storage::path($document->path)
                ]);
                abort(404, 'Document file not found in storage');
            }
            
            try {
                // Get file content and mime type
                $file = Storage::get($document->path);
                $type = Storage::mimeType($document->path);
                $size = Storage::size($document->path);
                
                Log::info('Document prepared for streaming', [
                    'id' => $document->id,
                    'mime_type' => $type,
                    'size' => $size,
                    'name' => $document->name
                ]);
                
                // Create a response with the file content
                $response = Response::make($file, 200);
                $response->header("Content-Type", $type);
                
                // Disable caching for security
                $response->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
                $response->header('Pragma', 'no-cache');
                $response->header('Expires', 'Sat, 01 Jan 1990 00:00:00 GMT');
                
                // Discourage downloads
                $response->header('Content-Disposition', 'inline; filename="' . $document->name . '"');
                
                return $response;
            } catch (\Exception $e) {
                Log::error('Error reading document file', [
                    'id' => $document->id,
                    'path' => $document->path,
                    'error' => $e->getMessage()
                ]);
                abort(500, 'Error reading document file: ' . $e->getMessage());
            }
        } catch (\Exception $e) {
            Log::error('Error accessing document', [
                'id' => $documentId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            abort(500, 'Error accessing document: ' . $e->getMessage());
        }
    }
}

