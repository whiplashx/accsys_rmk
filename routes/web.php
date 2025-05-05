<?php
use App\Http\Controllers\AccreditationController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\IndicatorController;
use App\Http\Controllers\SelfSurveyController;
use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Routing\FiltersControllerMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

use App\Http\Controllers\ParameterController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskAssignmentController;


Route::get('/aboutus', function () {
    return Inertia::render('AboutUs');
})->name('aboutus');
Route::get('/welcome', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/updateUser/{id}', [AdminController::class, 'updateUser'])->name('admin.updateUser');
})->middleware(['auth']);

Route::post('/activitiesUpdate', [ActivityController::class, 'store'])->middleware('auth', 'role:localtaskforce', 'verified');
Route::get('/activities_log', [ActivityController::class, 'index']);

Route::middleware(['auth', 'role:admin'])
    ->group(function () {
        //Route::get('/areas', [AreaController::class, 'index']);
        Route::get('/indicatorsForAdmin', [IndicatorController::class, 'index']);
        Route::get('/tasksAdmin', [TaskController::class, 'index']);
        Route::get('/areas/{area}/parameters', [ParameterController::class, 'index']);
        Route::get('/parameters/{parameter}/indicators', [IndicatorController::class, 'all']);
        Route::get('/users/localtaskforce', [AdminController::class, 'getLocalTaskForceUsers']);
        Route::post('/assign-task', [TaskController::class, 'assignTask']);
        Route::post('/tasks/assign', [TaskController::class, 'assignTask']); // Alternative endpoint
        Route::post('/tasks/bulk-assign', [TaskController::class, 'bulkAssignTasks']); // New bulk assignment endpoint
        Route::get('/programs', function () {
            return Inertia::render('Admin/Programs');
        })->name('programs');
        Route::get('/assignTask', function () {
            return Inertia::render('Admin/TaskAssignmentPage');
        })->name('assignTask');
        Route::get('/exhibitAdmin', function () {
            return Inertia::render('Admin/Exhibit');
        })->name('exhibitAdmin');

        Route::get('/documents', function () {
            return Inertia::render('Admin/Documents');
        })->name('documents');

        Route::get('/accounts', function () {
            return Inertia::render('Admin/Accounts');
        })->name('accounts');

        Route::get('/accreditation', function () {
            return Inertia::render('Admin/Accreditation');
        })->name('accreditation');

        Route::get('/scheduling', function () {
            return Inertia::render('Admin/Scheduling');
        })->name('scheduling');

        Route::get('/settings', function () {
            return Inertia::render('Admin/Settings');
        })->name('settings');
        
        // Add the missing selfsurvey route for admin
        Route::get('/selfsurveyAdmin', function () {
            return Inertia::render('Admin/Selfsurvey');
        })->name('admin.selfsurvey');
    });

Route::get('/areas', [AreaController::class, 'index']);
Route::middleware(['auth', 'role:localtaskforce'])
    ->group(function () {
        Route::apiResource('self-surveys', SelfSurveyController::class);
        Route::get('/accreditationLTF', function () {
            return Inertia::render('LocalTaskForce/Accreditation');
        })->name('accreditationLTF');
        Route::get('/tasks', function () {
            return Inertia::render('LocalTaskForce/Tasks');
        })->name('tasks');

        // Route::post('/self-surveys', [SelfSurveyController::class, 'store']);
        Route::get('/self-surveys/{taskId}', [SelfSurveyController::class, 'show']);
        //Route::get('/areas', [AreaController::class, 'index']);
        Route::get('/file/view/{documentId}', [DocumentController::class, 'view']);
        //tasks
        Route::get('/assigned-tasks', [TaskController::class, 'getAssignedTasks']);
        Route::patch('/tasks/{taskId}', [TaskController::class, 'updateTaskStatus']);
        Route::post('/activities', [TaskController::class, 'logActivity']);
        Route::post('/upload-document', [DocumentController::class, 'upload']);
        Route::get('/task-documents/{taskId}', [DocumentController::class, 'getTaskDocument']);
        Route::get('/download-document/{id}', [DocumentController::class, 'download']);
        Route::get('/indicatorsForTask', [IndicatorController::class, 'index']);
        Route::get('/documentsForTask', [DocumentController::class, 'index']);
        Route::put('/tasks/{taskId}/rating', [TaskController::class, 'updateSelfSurveyRating']);

        // Task rating routes
        Route::get('/tasks/{taskId}/rating', [TaskController::class, 'getTaskRating']);
        Route::post('/tasks/{taskId}/rating', [TaskController::class, 'updateSelfSurveyRating']);
        Route::get('/tasks/ratings', [TaskController::class, 'getRatings']);

//Route::post('/tasks/{taskId}/rating', [TaskController::class, 'updateSelfSurveyRatings']);

        // Route::delete('/task-documents/{taskDocument}', [LocalTaskForceController::class, 'removeTaskDocument']);
        //Route::post('/tasks/{task}/update-document', [LocalTaskForceController::class, 'updateTaskDocument']);
        // Route::post('/self-surveys', [SelfSurveyController::class, 'store']);

        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        // Add the missing selfsurvey route for localtaskforce
        Route::get('/selfsurveyLTF', function () {
            return Inertia::render('LocalTaskForce/Selfsurvey');
        })->name('localtaskforce.selfsurvey');
    });

Route::middleware(['auth', 'role:localaccreditor'])
    ->group(function () {

        Route::get('/accreditationAcc', function () {
            return Inertia::render('LocalAccreditor/Accreditation');
        })->name('accreditationAcc');
        Route::get('/exhibitAcc', function () {
            return Inertia::render('LocalAccreditor/Exhibit');
        })->name('exhibitAcc');
        Route::get('/selfsurveyAcc', function () {
            return Inertia::render('LocalAccreditor/Selfsurvey');
        })->name('selfsurveyAcc');
        Route::get('/areas-for-survey', [AreaController::class, 'index']);

    });
Route::get('/file/views/{documentId}', [DocumentController::class, 'view']);

Route::middleware(['auth', 'role:accreditor'])
    ->group(function () {
        Route::get('/documentation', function () {
            return Inertia::render('Accreditor/Documentation');
        })->name('documentation');


    });
use App\Http\Controllers\DashboardController;

// Update dashboard data route to be properly authenticated and accessible for all roles
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard-data', [DashboardController::class, 'getDashboardData']);
});

//get user id

Route::middleware('auth')->get('/userID', [UserController::class, 'getUserId']);

//program API
Route::apiResource('program', ProgramController::class);
Route::get('fetchProgram', [ProgramController::class, 'fetchProgram'])->name('fetchProgram');
Route::prefix('program')->group(function () {
    Route::post('/add', [ProgramController::class, 'programAdd']); // Dedicated add endpoint
    Route::get('/{program}', [ProgramController::class, 'show']);
    Route::put('/{program}', [ProgramController::class, 'update']);
    Route::delete('/{program}', [ProgramController::class, 'destroy']);
    Route::post('/{program}/schedule', [ProgramController::class, 'updateSchedule']);
});

//API FOR USERS
Route::get('getUser', [AdminController::class, 'getUser'])->name('getUser');

//MAIL CONTROLLERS
Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('message', 'Verification link sent!');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');
require __DIR__ . '/auth.php';


//API FOR ADMIN CRUD

Route::middleware('auth')->group(function () {
    Route::post('/updateUser/{id}', [AdminController::class, 'updateUser'])->name('admin.updateUser');
})->middleware(['auth']);


Route::get('/accreditation-areas', [AccreditationController::class, 'index']);



Route::get('/areasTB', [AccreditationController::class, 'index']);
Route::post('/areasTB', [AccreditationController::class, 'addArea']);
Route::post('/parametersTB', [AccreditationController::class, 'addParameter']);
Route::post('/indicatorsTB', [AccreditationController::class, 'addIndicator']);
Route::delete('/areasTB/{id}', [AccreditationController::class, 'deleteArea']);
Route::delete('/parametersTB/{id}', [AccreditationController::class, 'deleteParameter']);
Route::delete('/indicatorsTB/{id}', [AccreditationController::class, 'deleteIndicator']);

// Add these GET routes for parameters and indicators
Route::get('/parametersTB', [AccreditationController::class, 'getParameters']);
Route::get('/indicatorsTB', [AccreditationController::class, 'getIndicators']);

//Route::get('/team-members', [::class, 'index']);
Route::get('assigned-tasks', [TaskController::class, 'fetchAssignedTasks']);
Route::patch('tasks/{task}', [TaskController::class, 'updateTaskStatus']);





Route::middleware('auth')->group(function () {

});

Route::get('/select-program', [ProgramController::class, 'selectprogram'])->name('select-program');
Route::post('/set-program', [ProgramController::class, 'setprogram'])->name('set-program');

// API routes
Route::get('/programsTB', [ProgramController::class, 'index']);

//selfsurvey
// New routes for self-surveys and areas


Route::apiResource('/self-surveys', SelfSurveyController::class);

// Add this with your other routes
Route::get('/document-viewer', function () {
    return inertia('LocalTaskForce/DocumentViewer');
})->middleware(['auth', 'verified']);

// Add these routes after your existing user-related routes
// User Management API Routes - for the Accounts.jsx
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/api/user-management/users', [UserController::class, 'getUsers']);
    Route::put('/api/user-management/users/{id}', [UserController::class, 'updateUser']);
    Route::post('/api/user-management/users', [UserController::class, 'createUser']);
    Route::post('/api/user-management/users/{id}/delete', [UserController::class, 'deleteUser']);
    
    // Update user statuses based on program schedules
    Route::get('/api/user-management/update-statuses', [UserController::class, 'updateUserStatuses']);
});

// This route is used by both admin and non-admin pages
Route::middleware(['auth'])->group(function () {
    Route::get('/api/programs/list', [ProgramController::class, 'listAll']);
});

Route::middleware(['auth'])->group(function() {
    Route::get('/document-viewer', function () {
        return Inertia::render('DocumentViewer');
    })->name('document-viewer');
    
    // Secure document streaming route
    Route::get('/secure-document', [DocumentController::class, 'streamSecureDocument'])
        ->name('secure-document');
    
    // API route to get document details
    Route::get('/api/documents/{id}', [DocumentController::class, 'getDocument'])
        ->name('documents.get');
});

// Add this debug route - remove in production
Route::get('/debug-document/{id}', function ($id) {
    $document = \App\Models\Document::find($id);
    if (!$document) {
        return response()->json(['error' => 'Document not found in database'], 404);
    }
    
    $exists = \Illuminate\Support\Facades\Storage::exists($document->path);
    return response()->json([
        'document' => $document,
        'file_exists' => $exists,
        'storage_path' => \Illuminate\Support\Facades\Storage::path($document->path),
        'mime_type' => $exists ? \Illuminate\Support\Facades\Storage::mimeType($document->path) : null,
        'size' => $exists ? \Illuminate\Support\Facades\Storage::size($document->path) : null
    ]);
})->middleware('auth');

// Add these debugging routes - REMOVE BEFORE PRODUCTION
Route::middleware(['auth'])->group(function() {
    // Debug document by ID
    Route::get('/debug-document/{id}', function ($id) {
        try {
            $document = \App\Models\Document::find($id);
            if (!$document) {
                return response()->json(['error' => 'Document not found in database'], 404);
            }
            
            $exists = \Illuminate\Support\Facades\Storage::exists($document->path);
            
            return response()->json([
                'document' => $document,
                'file_exists' => $exists,
                'full_storage_path' => \Illuminate\Support\Facades\Storage::path($document->path),
                'mime_type' => $exists ? \Illuminate\Support\Facades\Storage::mimeType($document->path) : null,
                'size' => $exists ? \Illuminate\Support\Facades\Storage::size($document->path) : null,
                'file_stats' => $exists ? [
                    'permissions' => substr(sprintf('%o', fileperms(\Illuminate\Support\Facades\Storage::path($document->path))), -4),
                    'owner' => fileowner(\Illuminate\Support\Facades\Storage::path($document->path)),
                ] : null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error fetching document details',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    });
    
    // List all documents in database
    Route::get('/debug-documents', function () {
        return response()->json(\App\Models\Document::all());
    });
    
    // Test direct file access
    Route::get('/debug-file-view/{id}', function ($id) {
        try {
            $document = \App\Models\Document::findOrFail($id);
            $path = $document->path;
            
            if (!\Illuminate\Support\Facades\Storage::exists($path)) {
                return response('File not found in storage', 404);
            }
            
            $file = \Illuminate\Support\Facades\Storage::get($path);
            $type = \Illuminate\Support\Facades\Storage::mimeType($path);
            
            return response($file, 200)->header('Content-Type', $type);
        } catch (\Exception $e) {
            return response('Error: ' . $e->getMessage(), 500);
        }
    });
});

// Add these routes for the alternative document viewer
Route::get('/alt-document-viewer/{id}', function ($id) {
    return Inertia::render('AlternativeDocumentViewer', [
        'id' => $id
    ]);
})->middleware(['auth', 'verified']);

// Direct document access route with different headers to avoid ad blockers
Route::get('/direct-document-access/{id}', [DocumentController::class, 'directAccess'])
    ->middleware(['auth', 'verified']);

// Update the selfsurvey route to redirect to the proper named routes
Route::get('/selfsurvey', function () {
    switch (auth()->user()->role) {
        case 'admin':
            return redirect()->route('admin.selfsurvey');
        case 'localtaskforce':
            return redirect()->route('localtaskforce.selfsurvey');
        case 'localaccreditor':
            return redirect()->route('localaccreditor.selfsurvey');
        default:
            return redirect()->route('dashboard');
    }
})->name('selfsurvey')->middleware(['auth']);

// Add this dedicated API route for documents
Route::middleware(['auth'])->group(function () {
    // API route for document listing
    Route::get('/api/documents', [DocumentController::class, 'index'])->name('api.documents.index');
});

// Add a new route for fetching self-survey ratings
Route::middleware(['auth'])->group(function () {
    Route::get('/api/self-survey-ratings', [TaskController::class, 'getSelfSurveyRatings']);
    
    // Task management API endpoint
    Route::get('/api/tasks', [TaskController::class, 'index']);
});

// Add this route for authenticated users to get their profile information
Route::middleware(['auth'])->group(function () {
    Route::get('/api/user', function (Request $request) {
        return $request->user();
    });
});







