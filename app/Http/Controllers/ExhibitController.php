<?php

namespace App\Http\Controllers;

use App\Models\Exhibit;
use App\Models\Area;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ExhibitController extends Controller
{
    /**
     * Get all exhibits for a program
     */
    public function index(Request $request)
    {
        try {
            $programId = $request->query('program_id');        $query = Exhibit::with(['area', 'user', 'program']);

        if ($programId) {
            $query->where('program_id', $programId);
        }

        $exhibits = $query->orderBy('created_at', 'desc')->get();

        $formattedExhibits = $exhibits->map(function ($exhibit) {
            return [
                'id' => $exhibit->id,
                'title' => $exhibit->title,
                'description' => $exhibit->description,
                'fileType' => $exhibit->file_type,
                'fileUrl' => route('exhibits.view', $exhibit->id),
                'areaId' => $exhibit->area_id,
                'areaName' => $exhibit->area ? $exhibit->area->name : 'Unknown Area',
                'programId' => $exhibit->program_id,
                'programName' => $exhibit->program ? $exhibit->program->name : 'Unknown Program',
                'uploadedBy' => $exhibit->user ? $exhibit->user->name : 'Unknown User',
                'uploadDate' => $exhibit->created_at->format('M d, Y')
                ];
            });

            return response()->json($formattedExhibits);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve exhibits: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Upload a new exhibit
     */
    public function upload(Request $request)
    {
        try {
            // Add debugging
            \Log::info('Upload request received', [
                'title' => $request->title,
                'area_id' => $request->area_id,
                'program_id' => $request->program_id,
                'fileType' => $request->fileType,
                'file_present' => $request->hasFile('file'),
                'user_id' => Auth::id()
            ]);

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'area_id' => 'required|exists:areas,id',
                'file' => 'required|file|max:100000', // 100MB max
                'fileType' => 'required|string|in:video,image,document,other',
                'program_id' => 'required|exists:programs,id',
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed', ['errors' => $validator->errors()]);
                return response()->json(['error' => $validator->errors()], 422);
            }

            // Get the uploaded file
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = 'exhibits/' . $fileName;

            \Log::info('About to store file', [
                'original_name' => $file->getClientOriginalName(),
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_size' => $file->getSize()
            ]);

            // Store file in private storage disk
            Storage::disk('private')->put($filePath, file_get_contents($file));

            \Log::info('File stored successfully, creating database record');

            // Create exhibit record
            $exhibit = Exhibit::create([
                'title' => $request->title,
                'description' => $request->description,
                'file_path' => $filePath,
                'file_name' => $fileName,
                'file_type' => $request->fileType,
                'mime_type' => $file->getMimeType(),
                'area_id' => $request->area_id,
                'program_id' => $request->program_id,
                'uploaded_by' => Auth::id(),
            ]);

            \Log::info('Database record created successfully', ['exhibit_id' => $exhibit->id]);

            // Format response
            $response = [
                'id' => $exhibit->id,
                'title' => $exhibit->title,
                'description' => $exhibit->description,
                'fileType' => $exhibit->file_type,
                'fileUrl' => route('exhibits.view', $exhibit->id),
                'areaId' => $exhibit->area_id,
                'areaName' => Area::find($exhibit->area_id)->name ?? 'Unknown Area',
                'uploadedBy' => Auth::user()->name,
                'uploadDate' => $exhibit->created_at->format('M d, Y')
            ];

            return response()->json($response, 201);
        } catch (\Exception $e) {
            \Log::error('Error uploading exhibit', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to upload exhibit: ' . $e->getMessage()], 500);
        }
    }

    /**
     * View/stream an exhibit file
     */
    public function view($id)
    {
        try {
            $exhibit = Exhibit::findOrFail($id);

            if (!Storage::disk('private')->exists($exhibit->file_path)) {
                return response()->json(['error' => 'File not found'], 404);
            }

            $file = Storage::disk('private')->get($exhibit->file_path);
            
            return response($file, 200)
                ->header('Content-Type', $exhibit->mime_type)
                ->header('Content-Disposition', 'inline; filename="' . $exhibit->file_name . '"');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve file: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Download an exhibit file
     */
    public function download($id)
    {
        try {
            $exhibit = Exhibit::findOrFail($id);

            if (!Storage::disk('private')->exists($exhibit->file_path)) {
                return response()->json(['error' => 'File not found'], 404);
            }

            return Storage::disk('private')->download(
                $exhibit->file_path, 
                $exhibit->file_name, 
                ['Content-Type' => $exhibit->mime_type]
            );
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to download file: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete an exhibit
     */
    public function destroy($id)
    {
        try {
            $exhibit = Exhibit::findOrFail($id);

            // Delete the file from storage
            if (Storage::disk('private')->exists($exhibit->file_path)) {
                Storage::disk('private')->delete($exhibit->file_path);
            }

            // Delete the database record
            $exhibit->delete();

            return response()->json(['message' => 'Exhibit deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete exhibit: ' . $e->getMessage()], 500);
        }
    }
}
