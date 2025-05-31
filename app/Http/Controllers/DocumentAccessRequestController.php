<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentAccessRequest;
use App\Models\Program;
use App\Models\User;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DocumentAccessRequestController extends Controller
{
    /**
     * Request access to a document
     */
    public function requestAccess(Request $request)
    {
        $request->validate([
            'document_id' => 'required|exists:documents,id',
            'reason' => 'required|string|max:500'
        ]);

        $user = Auth::user();
        $document = Document::findOrFail($request->document_id);
        
        // Get the program that owns this document through the task
        $task = Task::find($document->task_id);
        if (!$task) {
            return response()->json(['error' => 'Document task not found'], 404);
        }

        // Find the program dean
        $program = Program::find($task->program_id);
        if (!$program) {
            return response()->json(['error' => 'Program not found'], 404);
        }

        // Find dean for this program
        $dean = User::where('role', 'dean')
                   ->whereHas('programs', function($query) use ($program) {
                       $query->where('programs.id', $program->id);
                   })
                   ->first();

        if (!$dean) {
            return response()->json(['error' => 'No dean found for this program'], 404);
        }

        // Check if user already has a pending request for this document
        $existingRequest = DocumentAccessRequest::where('user_id', $user->id)
                                               ->where('document_id', $document->id)
                                               ->where('status', 'pending')
                                               ->first();

        if ($existingRequest) {
            return response()->json(['error' => 'You already have a pending request for this document'], 409);
        }

        // Check if user already has approved access
        $approvedAccess = DocumentAccessRequest::where('user_id', $user->id)
                                             ->where('document_id', $document->id)
                                             ->where('status', 'approved')
                                             ->where(function($query) {
                                                 $query->whereNull('expires_at')
                                                       ->orWhere('expires_at', '>', now());
                                             })
                                             ->first();

        if ($approvedAccess) {
            return response()->json(['error' => 'You already have access to this document'], 409);
        }

        // Create access request
        $accessRequest = DocumentAccessRequest::create([
            'user_id' => $user->id,
            'document_id' => $document->id,
            'program_id' => $program->id,
            'dean_id' => $dean->id,
            'status' => 'pending',
            'reason' => $request->reason
        ]);

        Log::info('Document access request created', [
            'request_id' => $accessRequest->id,
            'user_id' => $user->id,
            'document_id' => $document->id,
            'dean_id' => $dean->id
        ]);

        return response()->json([
            'message' => 'Access request submitted successfully',
            'request' => $accessRequest->load(['document', 'program', 'dean'])
        ]);
    }

    /**
     * Get user's access requests
     */
    public function getUserRequests()
    {
        $user = Auth::user();
        
        $requests = DocumentAccessRequest::where('user_id', $user->id)
                                       ->with(['document', 'program', 'dean'])
                                       ->orderBy('created_at', 'desc')
                                       ->get();

        return response()->json($requests);
    }

    /**
     * Get pending requests for dean approval
     */
    public function getPendingRequests()
    {
        $user = Auth::user();
        
        if ($user->role !== 'dean') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $requests = DocumentAccessRequest::where('dean_id', $user->id)
                                       ->where('status', 'pending')
                                       ->with(['user', 'document', 'program'])
                                       ->orderBy('created_at', 'desc')
                                       ->get();

        return response()->json($requests);
    }

    /**
     * Approve or reject an access request
     */
    public function updateRequestStatus(Request $request, $requestId)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|string|max:500',
            'expires_in_days' => 'nullable|integer|min:1|max:365'
        ]);

        $user = Auth::user();
        $accessRequest = DocumentAccessRequest::findOrFail($requestId);

        // Check if user is the dean for this request
        if ($user->id !== $accessRequest->dean_id || $user->role !== 'dean') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if request is still pending
        if ($accessRequest->status !== 'pending') {
            return response()->json(['error' => 'Request has already been processed'], 409);
        }

        $updateData = [
            'status' => $request->status
        ];

        if ($request->status === 'approved') {
            $updateData['approved_at'] = now();
            
            // Set expiration if specified
            if ($request->expires_in_days) {
                $updateData['expires_at'] = now()->addDays($request->expires_in_days);
            }
        } else {
            $updateData['rejection_reason'] = $request->rejection_reason;
        }

        $accessRequest->update($updateData);

        Log::info('Document access request updated', [
            'request_id' => $accessRequest->id,
            'status' => $request->status,
            'dean_id' => $user->id
        ]);

        return response()->json([
            'message' => "Request {$request->status} successfully",
            'request' => $accessRequest->fresh()->load(['user', 'document', 'program'])
        ]);
    }

    /**
     * Check if user has access to download a document
     */
    public function checkAccess($documentId)
    {
        $user = Auth::user();
        $document = Document::findOrFail($documentId);

        // Check if user owns the document (through their tasks)
        $task = Task::find($document->task_id);
        if ($task && $task->user_id === $user->id) {
            return response()->json(['has_access' => true, 'reason' => 'document_owner']);
        }

        // Check if user has approved access
        $approvedAccess = DocumentAccessRequest::where('user_id', $user->id)
                                             ->where('document_id', $documentId)
                                             ->where('status', 'approved')
                                             ->where(function($query) {
                                                 $query->whereNull('expires_at')
                                                       ->orWhere('expires_at', '>', now());
                                             })
                                             ->first();

        if ($approvedAccess) {
            return response()->json([
                'has_access' => true, 
                'reason' => 'approved_request',
                'expires_at' => $approvedAccess->expires_at
            ]);
        }

        // Check if user has a pending request
        $pendingRequest = DocumentAccessRequest::where('user_id', $user->id)
                                             ->where('document_id', $documentId)
                                             ->where('status', 'pending')
                                             ->first();

        return response()->json([
            'has_access' => false,
            'has_pending_request' => !!$pendingRequest,
            'pending_request' => $pendingRequest
        ]);
    }
}
