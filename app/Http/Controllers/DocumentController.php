<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentAccessRequest;
use App\Models\Indicator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
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

        // Improved security headers for the StreamedResponse
        $headers = [
            'Content-Type' => Storage::disk('private')->mimeType($document->path),
            'Content-Disposition' => 'inline; filename="' . $document->name . '"',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => 'Sat, 01 Jan 1990 00:00:00 GMT',
            'X-Content-Type-Options' => 'nosniff',
            'Content-Security-Policy' => "default-src 'self'; script-src 'none'; object-src 'self'; frame-ancestors 'self'",
            'X-Frame-Options' => 'SAMEORIGIN',
            'X-Download-Options' => 'noopen',
            'X-NoDownload' => 'true'
        ];

        return new StreamedResponse(function () use ($document) {
            $stream = Storage::disk('private')->readStream($document->path);
            fpassthru($stream);
        }, 200, $headers);
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
    
    /**
     * Get all documents
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $documents = Document::orderBy('created_at', 'desc')->get();
            Log::info('Fetched all documents', ['count' => $documents->count()]);
            return response()->json($documents->toArray());
        } catch (\Exception $e) {
            Log::error('Error fetching all documents', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to retrieve documents'], 500);
        }
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
                
                // Enhanced security headers to prevent downloading
                $response->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
                $response->header('Pragma', 'no-cache');
                $response->header('Expires', 'Sat, 01 Jan 1990 00:00:00 GMT');
                
                // Discourage downloads with strict security headers
                $response->header('Content-Disposition', 'inline; filename="' . $document->name . '"');
                $response->header('X-Content-Type-Options', 'nosniff');
                $response->header('Content-Security-Policy', "default-src 'self'; script-src 'none'; object-src 'self'; frame-ancestors 'self'");
                $response->header('X-Frame-Options', 'SAMEORIGIN');
                
                // Add custom header to indicate no-download policy
                $response->header('X-Download-Options', 'noopen');
                $response->header('X-NoDownload', 'true');
                
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
            abort(500, 'Error accessing document: ' . $e->getMessage());        }
    }

    /**
     * Download a document
     * 
     * @param int $id The document ID
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function download($id)
    {
        Log::info('Downloading document', ['id' => $id]);
        
        try {
            // Validate ID is numeric            if (!is_numeric($id)) {
                Log::error('Invalid document ID format for download', ['id' => $id]);
                abort(400, 'Invalid document ID format');
            
            
            // Find the document
            $document = \App\Models\Document::find($id);
            
            if (!$document) {
                Log::error('Document not found for download', ['id' => $id]);
                abort(404, 'Document not found');
            }

            // Load the task relationship
            $document->load('task');

            // Check access permissions
            $user = Auth::user();
            if (!$this->canUserDownloadDocument($user, $document)) {
                Log::warning('Access denied for document download', [
                    'user_id' => $user->id,
                    'document_id' => $document->id,
                    'document_owner' => $document->user_id
                ]);
                abort(403, 'You do not have permission to download this document. Please request access from the program dean.');
            }
            
            Log::info('Document found for download', [
                'id' => $document->id,
                'name' => $document->name,
                'path' => $document->path
            ]);
            
            // Check if file exists in private storage
            if (!Storage::disk('private')->exists($document->path)) {
                Log::error('Document file not found in storage for download', [
                    'id' => $document->id,
                    'path' => $document->path
                ]);
                abort(404, 'Document file not found');
            }
            
            // Get file contents
            $fileContents = Storage::disk('private')->get($document->path);
            $fileName = $document->name;
            
            // Get MIME type
            $mimeType = Storage::disk('private')->mimeType($document->path);
            
            Log::info('Serving document for download', [
                'id' => $document->id,
                'name' => $fileName,
                'mime_type' => $mimeType,
                'size' => strlen($fileContents)
            ]);
            
            // Return file as download
            return Response::make($fileContents, 200, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
                'Content-Length' => strlen($fileContents),
                'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
                'Pragma' => 'public',
                'Expires' => '0'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error downloading document', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);            abort(500, 'Error downloading document: ' . $e->getMessage());
        }
    }    /**
     * Check if a user can download a specific document
     * 
     * @param \App\Models\User $user
     * @param \App\Models\Document $document
     * @return bool
     */
    private function canUserDownloadDocument($user, $document)
    {
        // Users can always download their own documents
        if ($document->user_id === $user->id) {
            return true;
        }

        // Get the program ID associated with the document through the task
        $documentProgramId = $document->task->program_id ?? null;
        
        if (!$documentProgramId) {
            return false;
        }

        // Users can download documents from their own program
        if ($user->program_id === $documentProgramId) {
            return true;
        }

        // Check if user has an approved access request for this document
        $accessRequest = DocumentAccessRequest::where('user_id', $user->id)
            ->where('document_id', $document->id)
            ->where('status', 'approved')
            ->first();

        return $accessRequest !== null;
    }
}

