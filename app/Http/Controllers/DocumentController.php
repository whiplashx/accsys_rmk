<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Indicator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:50240', // 50MB max
            'task_id' => 'required|exists:tasks,id',
            'user_id' => 'required|exists:users,id',
            //'indicator_id' => 'required|exists:indicators,id',
        ]);
    
        $file = $request->file('file');
    
        // Store the uploaded file in the private storage
        $path = Storage::disk('private')->put('task_documents', $file);
    
        // Create a new document record
        $document = Document::create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            //'task_id' => $request->task_id, // Save the task ID
            //'user_id' => $request->user_id, // Save the user ID
            //'indicator_id' => $request->indicator_id, // Save the indicator ID
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    
        // Retrieve the indicator using the provided indicator_id
        $indicator = Indicator::find($request->indicator_id);
    
        // Store the document ID in the `document_id` column of the `indicators` table
        $indicator->documents = $document->id; // Assuming you have a `document_id` column
        $indicator->save();
    
        // Return the document as a response
        return response()->json($document, 201);
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
    

    public function download($id)
    {
        $document = Document::findOrFail($id);
        return Storage::disk('private')->download($document->path, $document->name);
    }

    public function index()
{
    return response()->json(Document::all());
}
}

