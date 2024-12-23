const admin = require('firebase-admin');

admin.initializeApp();

const { createCommunity } = require('./communities/createCommunity');
const { getCommunityDetails } = require('./communities/getCommunityDetails');
const {
  getCommunityByInviteToken,
} = require('./communities/getCommunityToInvite');
const { addMemberToCommunity } = require('./communities/addMemberToCommunity');

exports.createCommunity = createCommunity;
exports.getCommunityDetails = getCommunityDetails;
exports.getCommunityByInviteToken = getCommunityByInviteToken;
exports.addMemberToCommunity = addMemberToCommunity;
