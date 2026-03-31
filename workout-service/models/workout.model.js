// workout.model.js - In-memory storage model for Workouts
const { v4: uuidv4 } = require('uuid');

// In-memory store
const workouts = [];

const WorkoutModel = {
  /** Get all workouts */
  findAll(userId) {
    if (userId) return workouts.filter((w) => w.userId === userId);
    return [...workouts];
  },

  /** Find workout by ID */
  findById(id) {
    return workouts.find((w) => w.id === id) || null;
  },

  /** Create a new workout */
  create({ userId, title, description, type, duration, exercises, scheduledDate }) {
    const workout = {
      id: uuidv4(),
      userId: userId || null,
      title,
      description: description || '',
      type: type || 'general', // e.g. strength, cardio, yoga, etc.
      duration: duration || 0, // minutes
      exercises: exercises || [],
      scheduledDate: scheduledDate || null,
      status: 'planned', // planned | completed | skipped
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    workouts.push(workout);
    return workout;
  },

  /** Update workout */
  update(id, updates) {
    const index = workouts.findIndex((w) => w.id === id);
    if (index === -1) return null;

    workouts[index] = {
      ...workouts[index],
      ...updates,
      id: workouts[index].id,
      createdAt: workouts[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    return workouts[index];
  },

  /** Delete workout */
  delete(id) {
    const index = workouts.findIndex((w) => w.id === id);
    if (index === -1) return false;
    workouts.splice(index, 1);
    return true;
  },
};

module.exports = WorkoutModel;
