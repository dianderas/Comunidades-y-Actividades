require('dotenv').config();
const admin = require('firebase-admin');

admin.initializeApp();

const communities = require('./communities');
const activities = require('./activities');

exports.createCommunity = communities.createCommunity;
exports.getCommunityDetails = communities.getCommunityDetails;
exports.getCommunityByInviteToken = communities.getCommunityByInviteToken;
exports.addMemberToCommunity = communities.addMemberToCommunity;
exports.createSeason = communities.createSeason;
exports.toggleSeasonStatus = communities.toggleSeasonStatus;

exports.createOrUpdateActivity = activities.createOrUpdateActivity;
exports.createTriviaRoom = activities.createTriviaRoom;
exports.joinTriviaRoom = activities.joinTriviaRoom;
exports.startTrivia = activities.startTrivia;
exports.submitAnswer = activities.submitAnswer;
exports.nextQuestion = activities.nextQuestion;
exports.endTrivia = activities.endTrivia;
exports.getFullTrivia = activities.getFullTrivia;
