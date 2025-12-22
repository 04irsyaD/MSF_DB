<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:super_admin');
    }

    public function index()
    {
        $users = User::orderBy('id','desc')->paginate(20);
        return view('users.index', compact('users'));
    }

    public function create()
    {
        $departments = Department::where('is_active', true)->orderBy('name')->pluck('name');
        return view('users.create', compact('departments'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|string',
            'employee_id' => 'nullable|string|max:50',
            'department' => 'nullable|string|max:100',
            'position' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:30',
            'hire_date' => 'nullable|date',
            'is_active' => 'sometimes|boolean'
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['is_active'] = $request->has('is_active');

        User::create($data);

        return redirect()->route('users.index')->with('success','User berhasil dibuat');
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        $departments = Department::where('is_active', true)->orderBy('name')->pluck('name');
        return view('users.edit', compact('user','departments'));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:6|confirmed',
            'role' => 'required|string',
            'employee_id' => 'nullable|string|max:50',
            'department' => 'nullable|string|max:100',
            'position' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:30',
            'hire_date' => 'nullable|date',
            'is_active' => 'sometimes|boolean'
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        $data['is_active'] = $request->has('is_active');

        $user->update($data);

        return redirect()->route('users.index')->with('success','User berhasil diperbarui');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        // avoid deleting self
        if (auth()->id() === $user->id) {
            return back()->with('error','Anda tidak bisa menghapus user saat ini.');
        }

        $user->delete();
        return redirect()->route('users.index')->with('success','User dihapus');
    }

    /**
     * Bulk actions: enable, disable, delete
     */
    public function bulk(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|string',
            'action' => 'required|string|in:enable,disable,delete'
        ]);

        // ids are sent as comma-separated list from the form
        $ids = array_filter(array_map('intval', explode(',', $data['ids'])));
        // remove current user from delete list to avoid self-delete
        if ($data['action'] === 'delete') {
            $ids = array_values(array_diff($ids, [auth()->id()]));
        }

        if (empty($ids)) {
            return redirect()->route('users.index')->with('error', 'Tidak ada user yang diproses.');
        }

        if ($data['action'] === 'enable') {
            User::whereIn('id', $ids)->update(['is_active' => true]);
            $msg = count($ids) . ' user diaktifkan.';
        } elseif ($data['action'] === 'disable') {
            User::whereIn('id', $ids)->update(['is_active' => false]);
            $msg = count($ids) . ' user dinonaktifkan.';
        } else {
            // delete
            User::whereIn('id', $ids)->delete();
            $msg = count($ids) . ' user dihapus.';
        }

        return redirect()->route('users.index')->with('success', $msg);
    }
}
