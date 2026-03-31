// workout.controller.js - Business logic for Workout operations
const WorkoutModel = require('../models/workout.model');

/**
 * @desc  Create a new workout plan
 * @route POST /api/workouts
 */
const createWorkout = (req, res) => {
  try {
    const { userId, title, description, type, duration, exercises, scheduledDate } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Workout title is required.' });
    }

    const workout = WorkoutModel.create({ userId, title, description, type, duration, exercises, scheduledDate });

    return res.status(201).json({
      success: true,
      message: 'Workout plan created successfully.',
      data: workout,
    });
  } catch (error) {
    console.error('[WorkoutController] createWorkout error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Get all workouts (optionally filter by userId)
 * @route GET /api/workouts
 */
const getAllWorkouts = (req, res) => {
  try {
    const { userId } = req.query;
    const workouts = WorkoutModel.findAll(userId);
    return res.status(200).json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    console.error('[WorkoutController] getAllWorkouts error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Get a single workout by ID
 * @route GET /api/workouts/:id
 */
const getWorkoutById = (req, res) => {
  try {
    const workout = WorkoutModel.findById(req.params.id);
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found.' });
    return res.status(200).json({ success: true, data: workout });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Update a workout plan
 * @route PUT /api/workouts/:id
 */
const updateWorkout = (req, res) => {
  try {
    const existing = WorkoutModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Workout not found.' });

    const updated = WorkoutModel.update(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Workout updated.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Delete a workout plan
 * @route DELETE /api/workouts/:id
 */
const deleteWorkout = (req, res) => {
  try {
    const deleted = WorkoutModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Workout not found.' });
    return res.status(200).json({ success: true, message: 'Workout deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { createWorkout, getAllWorkouts, getWorkoutById, updateWorkout, deleteWorkout };
