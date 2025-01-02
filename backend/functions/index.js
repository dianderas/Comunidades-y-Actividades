const admin = require('firebase-admin');

const isDevelopment = process.env.FUNCTIONS_EMULATOR === 'true';

admin.initializeApp({
  databaseURL: isDevelopment
    ? 'http://127.0.0.1:9000?ns=ekisde-fe4e1'
    : 'https://ekisde-fe4e1.firebaseio.com',
});

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
