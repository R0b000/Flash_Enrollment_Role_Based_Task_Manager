<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
                'role' => 'required|in:user,admin'
            ]);

            $data['password'] = bcrypt($data['password']);
            $user = User::create($data);

            return response()->json([
                'message' => 'Registration Successful',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ]);
        }
    }

    public function login(Request $request)
    {
        try {
            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            $user = Auth::user();
            $token = $request->user()->createToken('api')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $request->user(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something happended.',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function logout(Request $request)
    {
        if ($request->user()) {

            $request->user()->tokens()->delete();
            return response()->json([
                'message' => 'Logout successfull'
            ]);
        }

        return response()->json([
            'message' => 'No user logged in'
        ], 401);
    }

    public function allUsers()
    {
        try {
            $user = Auth::user();

            // Only admin will use this
            if ($user->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $users = User::all();

            return response()->json([
                'users' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
