<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:super_admin');
    }

    public function index()
    {
        $departments = Department::orderBy('name')->paginate(20);
        return view('departments.index', compact('departments'));
    }

    public function create()
    {
        return view('departments.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:departments,name',
            'code' => 'nullable|string|max:50',
            'is_active' => 'sometimes|boolean'
        ]);
        $data['is_active'] = $request->has('is_active');

        Department::create($data);
        return redirect()->route('departments.index')->with('success', 'Department created');
    }

    public function edit($id)
    {
        $department = Department::findOrFail($id);
        return view('departments.edit', compact('department'));
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|unique:departments,name,'.$department->id,
            'code' => 'nullable|string|max:50',
            'is_active' => 'sometimes|boolean'
        ]);
        $data['is_active'] = $request->has('is_active');
        $department->update($data);
        return redirect()->route('departments.index')->with('success','Department updated');
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return redirect()->route('departments.index')->with('success','Department deleted');
    }
}
