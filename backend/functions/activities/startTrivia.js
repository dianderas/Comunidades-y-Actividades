const { https } = require('firebase-functions');
const admin = require('firebase-admin');

const rtdb = admin.database();

exports.startTrivia = https.onCall(async ({ data, auth }) => {
  const { roomId } = data;
  const userId = auth?.uid;

  try {
    if (!userId) {
      throw new https.HttpsError('unauthenticated', 'Usuario no autenticado.');
    }

    const roomRef = rtdb.ref(`rooms/${roomId}`);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists()) {
      throw new https.HttpsError('not-found', 'El room no existe.');
    }

    const roomData = roomSnapshot.val();

    if (roomData.ownerId !== userId) {
      throw new https.HttpsError(
        'permission-denied',
        'Solo el owner puede iniciar la trivia.'
      );
    }

    const firstQuestion = roomData.questions[0];
    const startTime = Date.now();

    await roomRef.update({
      status: 'in_progress',
      currentQuestion: firstQuestion,
      currentQuestionStartTime: startTime,
      results: {},
    });

    return { message: 'Trivia iniciada.' };
  } catch (error) {
    console.error('Error al iniciar la trivia:', error);
    throw error;
  }
});
