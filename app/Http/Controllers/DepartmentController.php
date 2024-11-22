<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Department;

class DepartmentController extends Controller
{
    public function fetchData()
    {
        // Using the DB facade to query the database
        $data = DB::table('departments')
                ->get();

        // Return data as JSON for easy consumption in React
        return response()->json($data);
    }
    
    public function index()
    {
        // Retrieve all departments
        $departments = Department::all();
        return response()->json($departments);
    }

    public function store(Request $request)
    {
        // Validate and create a department
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:departments',
            'areaID' => 'required|string|max:100|unique:departments',
            'schedule' => 'nullable|date'
        ]);

        $department = Department::create($validatedData);

        return response()->json([
            'message' => 'Department created successfully!',
            'data' => $department,
        ], 201);
    }

    public function show($id)
    {
        // Retrieve a specific department
        $department = Department::findOrFail($id);
        return response()->json($department);
    }

    public function update(Request $request, $id)
    {
        // Validate and update the department
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:100|unique:departments,code,' . $id,
            'areaID' => 'int|nullable,' . $id,
            'schedule' => 'nullable|date,' . $id,
        ]);

        $department = Department::findOrFail($id);
        $department->update($validatedData);

        return response()->json([
            'message' => 'Department updated successfully!',
            'data' => $department,
        ], 200);
    }

    public function destroy($id)
    {
        // Delete a department
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json([
            'message' => 'Department deleted successfully!',
        ], 200);
    }
}
