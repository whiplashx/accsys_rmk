<?php
use App\Http\Controllers\AccreditationController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;



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


Route::middleware(['auth', 'verified', 'role:admin'])
    ->group(function () {
        Route::get('/departments', function () {
            return Inertia::render('Admin/Departments');
        })->name('departments');

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

Route::middleware(['auth', 'verified', 'role:localtaskforce'])
    ->group(function () {
        Route::get('/accreditationLTF', function () {
            return Inertia::render('LocalTaskForce/Accreditation');
        })->name('accreditationLTF');
        Route::get('/tasks', function () {
            return Inertia::render('LocalTaskForce/Tasks');
        })->name('tasks');
        Route::get('/selfsurveyLTF', function () {
            return Inertia::render('LocalTaskForce/Selfsurvey');
        })->name('selfsurveyLTF');

    });
Route::middleware(['auth', 'verified', 'role:localaccreditor'])
    ->group(function () {
        Route::get('/accreditationAcc', function () {
            return Inertia::render('LocalAccreditor/Accreditation');
        })->name('accreditationAcc');
        Route::get('/selfsurvey', function () {
            return Inertia::render('LocalAccreditor/Selfsurvey');
        })->name('selfsuvey');

    });




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



Route::get('/areas', [AccreditationController::class, 'index']);
Route::post('/areas', [AccreditationController::class, 'addArea']);
Route::post('/parameters', [AccreditationController::class, 'addParameter']);
Route::post('/indicators', [AccreditationController::class, 'addIndicator']);
Route::delete('/areas/{id}', [AccreditationController::class, 'deleteArea']);
Route::delete('/parameters/{id}', [AccreditationController::class, 'deleteParameter']);
Route::delete('/indicators/{id}', [AccreditationController::class, 'deleteIndicator']);

