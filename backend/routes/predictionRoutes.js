const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');

/**
 * @route   POST /api/predictions
 * @desc    Save user bracket predictions
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, groupStage, wildcardPicks, knockoutBracket } = req.body;

    // Basic Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'User name is required.' });
    }
    if (!groupStage || groupStage.length !== 12) {
      return res.status(400).json({ error: 'Predictions for all 12 groups must be completed.' });
    }
    if (!wildcardPicks || wildcardPicks.length !== 8) {
      return res.status(400).json({ error: 'Exactly 8 wildcard teams must be selected.' });
    }
    if (
      !knockoutBracket ||
      !knockoutBracket.roundOf32 || knockoutBracket.roundOf32.length !== 16 ||
      !knockoutBracket.roundOf16 || knockoutBracket.roundOf16.length !== 8 ||
      !knockoutBracket.quarterfinals || knockoutBracket.quarterfinals.length !== 4 ||
      !knockoutBracket.semifinals || knockoutBracket.semifinals.length !== 2 ||
      !knockoutBracket.thirdPlacePlayoff ||
      !knockoutBracket.final ||
      !knockoutBracket.champion ||
      !knockoutBracket.thirdPlaceWinner
    ) {
      return res.status(400).json({ error: 'Knockout bracket predictions are incomplete.' });
    }

    const newPrediction = new Prediction({
      name: name.trim(),
      groupStage,
      wildcardPicks,
      knockoutBracket
    });

    const savedPrediction = await newPrediction.save();
    res.status(201).json(savedPrediction);
  } catch (err) {
    console.error('Error saving prediction:', err);
    res.status(500).json({ error: 'Server error. Failed to save your prediction bracket.' });
  }
});

/**
 * @route   GET /api/predictions
 * @desc    Get recent prediction logs for the feed
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .select('name knockoutBracket.champion createdAt')
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(predictions);
  } catch (err) {
    console.error('Error retrieving predictions:', err);
    res.status(500).json({ error: 'Server error. Failed to load prediction feed.' });
  }
});

/**
 * @route   GET /api/predictions/stats
 * @desc    Aggregate prediction data for community analysis
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const totalPredictions = await Prediction.countDocuments();
    if (totalPredictions === 0) {
      return res.json({ total: 0, championStats: [], finalistStats: [] });
    }

    // Group by Champion and count percentages
    const championStats = await Prediction.aggregate([
      {
        $group: {
          _id: '$knockoutBracket.champion',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          team: '$_id',
          count: 1,
          percentage: { $round: [{ $multiply: [{ $divide: ['$count', totalPredictions] }, 100] }, 1] }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // Group by Finalists (either homeTeam or awayTeam in final match)
    const finalistStats = await Prediction.aggregate([
      {
        $project: {
          finalists: ['$knockoutBracket.final.homeTeam', '$knockoutBracket.final.awayTeam']
        }
      },
      { $unwind: '$finalists' },
      {
        $group: {
          _id: '$finalists',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          team: '$_id',
          count: 1,
          percentage: { $round: [{ $multiply: [{ $divide: ['$count', totalPredictions] }, 100] }, 1] }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    res.json({
      total: totalPredictions,
      championStats,
      finalistStats
    });
  } catch (err) {
    console.error('Error aggregating stats:', err);
    res.status(500).json({ error: 'Server error. Failed to compute community statistics.' });
  }
});

module.exports = router;
