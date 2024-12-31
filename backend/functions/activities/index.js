const { createOrUpdateActivity } = require('./createOrUpdateActivity');
const { createTriviaRoom } = require('./createTriviaRoom');
const { joinTriviaRoom } = require('./joinTriviaRoom');
const { startTrivia } = require('./startTrivia');
const { submitAnswer } = require('./submitTriviaAnswer');
const { nextQuestion } = require('./nextTriviaQuestion');
const { endTrivia } = require('./endTrivia');
const { getFullTrivia } = require('./getFullTrivia');

module.exports = {
  createOrUpdateActivity,
  createTriviaRoom,
  joinTriviaRoom,
  startTrivia,
  submitAnswer,
  nextQuestion,
  endTrivia,
  getFullTrivia,
};
