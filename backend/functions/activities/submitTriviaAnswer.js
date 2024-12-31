const { https } = require('firebase-functions');
const admin = require('firebase-admin');

const rtdb = admin.database();

exports.submitAnswer = https.onCall(async ({ data, auth }) => {
  const { roomId, questionId, answer } = data;
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

    if (roomData.answers?.[questionId]?.[userId]) {
      throw new https.HttpsError(
        'already-exists',
        'Ya respondiste esta pregunta.'
      );
    }

    const currentQuestion = roomData.currentQuestion;

    if (!currentQuestion || currentQuestion.id !== questionId) {
      throw new https.HttpsError(
        'invalid-argument',
        'La pregunta actual no coincide.'
      );
    }

    const elapsedTime = Math.floor(
      (Date.now() - roomData.currentQuestionStartTime) / 1000
    );
    if (elapsedTime > currentQuestion.timeLimit) {
      throw new https.HttpsError('deadline-exceeded', 'El tiempo ha expirado.');
    }

    await roomRef.child(`answers/${questionId}/${userId}`).set(answer);

    const optionRef = roomRef.child(`currentQuestionResults/${answer}`);
    await optionRef.transaction((current) => (current || 0) + 1);

    return { message: 'Respuesta enviada.' };
  } catch (error) {
    console.error('Error al crear respuesta de trivia:', error);
    throw error;
  }
});
