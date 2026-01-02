<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function list()
    {
        try {
            $page = request()->get('Page', 1);
            $filterUserId = request()->get('user_id'); 

            $user = Auth::user();

            $query = Task::query();

            if ($user->role !== 'admin') {
                $query->where('user_id', $user->id);
            }

            if ($filterUserId && $user->role === 'admin') {
                $query->where('user_id', $filterUserId);
            }

            $data = $query->paginate(10, ['*'], 'Page', $page);

            // Check if data exists
            if ($data->isEmpty()) {
                return response()->json([
                    'message' => $user->role === 'admin'
                        ? 'No data found.'
                        : 'No data found, create one.'
                ], 200);
            }

            return response()->json([
                'data' => $data,
                'message' => 'Data fetched successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function create(Request $request)
    {
        try {
            $body = $request->validate([
                'title' => 'required|min:3',
                'description' => 'nullable|max:500',
            ]);

            $body['user_id'] = $request->user()->id;

            $data = Task::create($body);

            return response()->json([
                'message' => 'Task created successfully',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = Auth::user();
            $data = Task::find($id);

            if (!$data) {
                return response()->json([
                    'message' => 'User data not found or deleted',
                ]);
            }

            if ($user->id === $data->user_id) {
                return response()->json([
                    'message' => 'User data fetched successfully',
                    'data' => $data,
                ]);
            } else {
                return response()->json([
                    'message' => 'Unauthorized message and Id'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $user = Auth::user();
            $data = Task::find($id);

            if (!$data) {
                return response()->json([
                    'message' => 'Data not found or deleted',
                ]);
            }

            if ($user->id === $data->user_id  || $user->role === 'admin') {
                $body = $request->validate([
                    'title' => 'nullable|min:3',
                    'description' => 'nullable|max:50',
                    'completed' => 'nullable|boolean',
                ]);

                if (isset($body['title'])) {
                    $data->title = $body['title'];
                };

                if (isset($body['description'])) {
                    $data->description = $body['description'];
                };

                if (isset($body['completed'])) {
                    $data->completed = $body['completed'];
                };

                $data->save();

                return response()->json([
                    'message' => 'Updated successfully',
                    'data' => $data,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $id)
    {
        try {
            $user = Auth::user();
            $data = Task::find($id);

            if (!$data) {
                return response()->json([
                    'message' => 'No data found or deleted already.'
                ], 404);
            };

            if ($user->id !== $data->user_id) {
                return response()->json([
                    'message' => 'Unauthorized delete operation',
                ], 403);
            }

            $data->delete();

            return response()->json([
                'message' => 'Delete Successfully',
                'data' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ]);
        }
    }
}
