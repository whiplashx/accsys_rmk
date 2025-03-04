<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DepartmentController extends Controller
{
    public function fetchData(){
        $data = DB::table('departments')
        ->get();

        return response()->json($data);
    }
    public function index()
    {
        $departments = Department::all();
        return response()->json($departments);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:departments',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $department = Department::create($request->all());
        return response()->json($department, 201);
    }

    public function show(Department $department)
    {
        return response()->json($department);
    }

    public function update(Request $request, Department $department)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'code' => 'string|max:50|unique:departments,code,' . $department->id,
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $department->update($request->all());
        return response()->json($department);
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return response()->json(null, 204);
    }

    public function updateSchedule(Request $request, Department $department)
    {
        $validator = Validator::make($request->all(), [
            'schedule' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $department->schedule = $request->schedule;
        $department->save();

        return response()->json($department);
    }

    public function selectDepartment()
    {
        $departments = Department::all();
        return view('select-department', compact('departments'));
    }

    public function setDepartment(Request $request)
    {
        $request->validate([
            'department_id' => 'required|exists:departments,id',
        ]);

        auth()->user()->update(['department_id' => $request->department_id]);

        return redirect()->intended('/dashboard');
    }
    
    /**
     * Get a simple list of all departments for dropdowns
     */
    public function listAll()
    {
        $departments = Department::all(['id', 'name', 'code']);
        return response()->json($departments);
    }
}