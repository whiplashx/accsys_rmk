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
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Routing\FiltersControllerMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

use App\Http\Controllers\ParameterController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskAssignmentController;



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
})->middleware(['auth', 'verified']);

Route::post('/activitiesUpdate', [ActivityController::class, 'store'])->middleware('auth', 'role:localtaskforce', 'verified');
Route::get('/activities_log', [ActivityController::class, 'index']);

Route::middleware(['auth', 'verified', 'role:admin'])
    ->group(function () {
        //Route::get('/areas', [AreaController::class, 'index']);
        Route::get('/indicatorsForAdmin', [IndicatorController::class, 'index']);
        Route::get('/tasksAdmin', [TaskController::class, 'index']);
        Route::get('/areas/{area}/parameters', [ParameterController::class, 'index']);
        Route::get('/parameters/{parameter}/indicators', [IndicatorController::class, 'all']);
        Route::get('/users/localtaskforce', [AdminController::class, 'getLocalTaskForceUsers']);
        Route::post('/assign-task', [TaskController::class, 'assignTask']);
        Route::get('/departments', function () {
            return Inertia::render('Admin/Departments');
        })->name('departments');
        Route::get('/assignTask', function () {
            return Inertia::render('Admin/TaskAssignmentPage');
        })->name('assignTask');

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

    });
    Route::get('/areas', [AreaController::class, 'index']);
Route::middleware(['auth', 'verified', 'role:localtaskforce'])
    ->group(function () {
        Route::apiResource('self-surveys', SelfSurveyController::class);
        Route::get('/accreditationLTF', function () {
            return Inertia::render('LocalTaskForce/Accreditation');
        })->name('accreditationLTF');
        Route::get('/tasks', function () {
            return Inertia::render('LocalTaskForce/Tasks');
        })->name('tasks');
        Route::get('/selfsurveyLTF', function () {
            return Inertia::render('LocalTaskForce/Selfsurvey');
        })->name('selfsurveyLTF');
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
   

      // Route::delete('/task-documents/{taskDocument}', [LocalTaskForceController::class, 'removeTaskDocument']);
      //Route::post('/tasks/{task}/update-document', [LocalTaskForceController::class, 'updateTaskDocument']);
      // Route::post('/self-surveys', [SelfSurveyController::class, 'store']);
       Route::get('/user', function (Request $request) {
           return $request->user();
       });
    });
    Route::middleware(['auth', 'verified', 'role:localaccreditor'])
    ->group(function () {
        Route::get('/accreditationAcc', function () {
            return Inertia::render('LocalAccreditor/Accreditation');
        })->name('accreditationAcc');
        Route::get('/selfsurveyAcc', function () {
            return Inertia::render('LocalAccreditor/Selfsurvey');
        })->name('selfsuveyAcc');

    });

    Route::middleware(['auth', 'verified', 'role:accreditor'])
    ->group(function () {
        Route::get('/documentation', function () {
            return Inertia::render('Accreditor/Documentation');
        })->name('documentation');

    });
    use App\Http\Controllers\DashboardController;

    Route::get('/dashboard-data', [DashboardController::class, 'getDashboardData']);

//get user id

Route::middleware('auth')->get('/userID', [UserController::class, 'getUserId']);

//DEPARTMENT API
Route::apiResource('department', DepartmentController::class);
Route::get('fetchData', [DepartmentController::class, 'fetchData'])->name('fetchDepartment');
Route::prefix('department')->group(function () {
    Route::get('/{department}', [DepartmentController::class, 'show']);
    Route::put('/{department}', [DepartmentController::class, 'update']);
    Route::delete('/{department}', [DepartmentController::class, 'destroy']);
    Route::post('/{department}/schedule', [DepartmentController::class, 'updateSchedule']);
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
})->middleware(['auth', 'verified']);


Route::get('/accreditation-areas', [AccreditationController::class, 'index']);



Route::get('/areasTB', [AccreditationController::class, 'index']);
Route::post('/areasTB', [AccreditationController::class, 'addArea']);
Route::post('/parametersTB', [AccreditationController::class, 'addParameter']);
Route::post('/indicatorsTB', [AccreditationController::class, 'addIndicator']);
Route::delete('/areasTB/{id}', [AccreditationController::class, 'deleteArea']);
Route::delete('/parametersTB/{id}', [AccreditationController::class, 'deleteParameter']);
Route::delete('/indicatorsTB/{id}', [AccreditationController::class, 'deleteIndicator']);


//Route::get('/team-members', [::class, 'index']);
Route::get('assigned-tasks', [TaskController::class, 'fetchAssignedTasks']);
Route::patch('tasks/{task}', [TaskController::class, 'updateTaskStatus']);





Route::middleware('auth')->group(function () {

});

Route::get('/select-department', [DepartmentController::class, 'selectDepartment'])->name('select-department');
Route::post('/set-department', [DepartmentController::class, 'setDepartment'])->name('set-department');

// API routes
Route::get('/departmentsTB', [DepartmentController::class, 'index']);

//selfsurvey
    // New routes for self-surveys and areas


Route::apiResource('/self-surveys', SelfSurveyController::class);
Route::get('/ratingsView', [IndicatorController::class, 'getRatings']);



