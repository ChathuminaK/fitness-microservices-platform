// progress.controller.js - Business logic for Progress operations
const ProgressModel = require('../models/progress.model');

/**
 * @desc  Add a new progress entry
 * @route POST /api/progress
 */
const addProgress = (req, res) => {
  try {
    const { userId, weightKg, heightCm, bodyFatPercent, muscleMassKg, notes, recordedDate } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required.' });
    }
    if (!weightKg && !heightCm) {
      return res.status(400).json({ success: false, message: 'At least weightKg or heightCm is required.' });
    }

    const entry = ProgressModel.create({ userId, weightKg, heightCm, bodyFatPercent, muscleMassKg, notes, recordedDate });

    return res.status(201).json({
      success: true,
      message: 'Progress entry added successfully.',
      data: entry,
    });
  } catch (error) {
    console.error('[ProgressController] addProgress error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Get all progress entries (optionally by userId)
 * @route GET /api/progress
 */
const getAllProgress = (req, res) => {
  try {
    const { userId } = req.query;
    const entries = ProgressModel.findAll(userId);
    return res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    console.error('[ProgressController] getAllProgress error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Get a single progress entry by ID
 * @route GET /api/progress/:id
 */
const getProgressById = (req, res) => {
  try {
    const entry = ProgressModel.findById(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: 'Progress entry not found.' });
    return res.status(200).json({ success: true, data: entry });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Update a progress entry
 * @route PUT /api/progress/:id
 */
const updateProgress = (req, res) => {
  try {
    const existing = ProgressModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Progress entry not found.' });

    const updated = ProgressModel.update(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Progress entry updated.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Delete a progress entry
 * @route DELETE /api/progress/:id
 */
const deleteProgress = (req, res) => {
  try {
    const deleted = ProgressModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Progress entry not found.' });
    return res.status(200).json({ success: true, message: 'Progress entry deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { addProgress, getAllProgress, getProgressById, updateProgress, deleteProgress };
