<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProgramController extends Controller
{
    public function fetchProgram(){
        $data = DB::table('programs')
        ->get();

        return response()->json($data);
    }
    
    public function index()
    {
        $programs = Program::all();
        return response()->json($programs);
    }

    public function programAdd(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'college' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $program = Program::create($request->all());
        return response()->json($program, 201);
    }

    public function store(Request $request)
    {
        // Alternative endpoint for adding programs
        return $this->programAdd($request);
    }

    public function show(Program $program)
    {
        return response()->json($program);
    }

    public function update(Request $request, Program $program)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'college' => 'string|max:50|unique:programs,college,' . $program->id,
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $program->update($request->all());
        return response()->json($program);
    }

    public function destroy(Program $program)
    {
        $program->delete();
        return response()->json(null, 204);
    }

    public function updateSchedule(Request $request, Program $program)
    {
        $validator = Validator::make($request->all(), [
            'schedule_start' => 'required|date',
            'schedule_end' => 'required|date|after:schedule_start',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $program->schedule_start = $request->schedule_start;
        $program->schedule_end = $request->schedule_end;
        // Keep backward compatibility with old schedule
        $program->schedule = $request->schedule_start;
        $program->save();

        return response()->json($program);
    }

    public function selectProgram()
    {
        $programs = Program::all();
        return view('select-program', compact('programs'));
    }

    public function setProgram(Request $request)
    {
        $request->validate([
            'program_id' => 'required|exists:programs,id',
        ]);

        auth()->user()->update(['program_id' => $request->program_id]);

        return redirect()->intended('/dashboard');
    }
    
    /**
     * Get a simple list of all programs for dropdowns
     */
    public function listAll()
    {
        $programs = Program::all(['id', 'name', 'college']);
        return response()->json($programs);
    }
}