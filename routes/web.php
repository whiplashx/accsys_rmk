<?php
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



$adminPages = [
    'departments' => 'Department',
    'documents' => 'Documents',
    'accounts' => 'Accounts',
    'accreditation' => 'Accreditation',
    'scheduling' => 'Scheduling',
    'settings' => 'Settings',
];

foreach ($adminPages as $uri => $component) {
    Route::get("/$uri", function () use ($component) {
        return Inertia::render('Admin/'. $component);
    })->name($uri)->middleware('auth', 'verified');
}


//DEPARTMENT API
Route::apiResource('department', DepartmentController::class);
Route::get('fetchData', [DepartmentController::class, 'fetchData'])->name('fetchDepartment');

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
require __DIR__.'/auth.php';


//API FOR ADMIN CRUD


