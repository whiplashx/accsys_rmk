<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:50240', // 10MB max
            'task_id' => 'required|exists:tasks,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $file = $request->file('file');
        $path = Storage::disk('private')->put('task_documents', $file);

        $document = Document::create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'task_id' => $request->task_id,
            'user_id' => $request->user_id,
        ]);

        return response()->json($document, 201);
    }


    public function getTaskDocument($taskId)
    {
        // Attempt to retrieve the latest document for the given task ID
        $document = Document::where('task_id', $taskId)->latest()->first();
    
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
}

