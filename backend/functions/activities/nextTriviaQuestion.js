const { https } = require('firebase-functions');
const admin = require('firebase-admin');

const rtdb = admin.database();

exports.nextQuestion = https.onCall(async ({ data, auth }) => {
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
        'Solo el owner puede avanzar a la siguiente pregunta.'
      );
    }

    const currentQuestionIndex = roomData.questions.findIndex(
      (q) => q.id === roomData.currentQuestion?.id
    );

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex >= roomData.questions.length) {
      await roomRef.update({
        status: 'finished',
        currentQuestion: null,
      });

      return { message: 'Trivia finalizada. No hay más preguntas.' };
    }

    const nextQuestion = roomData.questions[nextQuestionIndex];
    const startTime = Date.now();

    await roomRef.update({
      currentQuestion: nextQuestion,
      currentQuestionStartTime: startTime,
    });

    return { message: 'Avanzaste a la siguiente pregunta.' };
  } catch (error) {
    console.error('Error al avanzar a la siguiente pregunta:', error);
    throw error;
  }
});
