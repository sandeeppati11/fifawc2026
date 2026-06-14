const mongoose = require('mongoose');

// Schema for individual matches in the knockout bracket
const MatchSchema = new mongoose.Schema({
  matchId: { type: String, required: true }, // e.g. "R32_M1", "R16_M1", "QF_M1", "SF_M1", "TP_M1", "FN_M1"
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  winner: { type: String, required: true }
});

// Schema for the ranked group stage
const GroupRankingSchema = new mongoose.Schema({
  group: { type: String, required: true }, // "A" through "L"
  rankings: [{ type: String, required: true }] // Exactly 3 teams in ranked order (1st, 2nd, 3rd)
});

// Main Prediction Schema
const PredictionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  groupStage: [GroupRankingSchema], // 12 group rankings
  wildcardPicks: [{ type: String, required: true }], // Exactly 8 team names
  knockoutBracket: {
    roundOf32: [MatchSchema], // 16 matches
    roundOf16: [MatchSchema], // 8 matches
    quarterfinals: [MatchSchema], // 4 matches
    semifinals: [MatchSchema], // 2 matches
    thirdPlacePlayoff: MatchSchema, // 1 match
    final: MatchSchema, // 1 match
    champion: { type: String, required: true },
    thirdPlaceWinner: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
