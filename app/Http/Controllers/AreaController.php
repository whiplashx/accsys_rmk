<?php
namespace App\Http\Controllers;

use App\Models\Area;

class AreaController extends Controller
{
    public function fetchData()
    {
        $data = Area::with('parameters.indicators')->get()->map(function ($area) {
            return [
                'id' => $area->id,
                'name' => $area->name,
                'parameters' => $area->parameters->map(function ($parameter) {
                    return [
                        'id' => $parameter->id,
                        'name' => $parameter->name,
                        'indicators' => $parameter->indicators->map(function ($indicator) {
                            return [
                                'criteriaid' => $indicator->criteriaid,
                                'criteriaName' => $indicator->criteriaName,
                                'docid' => $indicator->docid,
                                'reviewid' => $indicator->reviewid,
                                'status' => $indicator->status,
                                'taskforceid' => $indicator->taskforceid,
                                'subid' => $indicator->subid,
                                'paramId' => $indicator->paramId,
                                'programid' => $indicator->programid,
                            ];
                        }),
                    ];
                }),
            ];
        });

        return response()->json($data);
    }
}
    
