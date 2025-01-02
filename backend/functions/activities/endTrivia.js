const { https } = require('firebase-functions');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const db = admin.firestore();
const rtdb = admin.database();

exports.endTrivia = https.onCall(async ({ data, auth }) => {
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
        'Solo el owner puede finalizar la trivia.'
      );
    }

    // Procesar los puntajes finales y guardar en Firestore
    const players = roomData.players;
    const results = Object.entries(players).map(([playerId, playerData]) => ({
      userId: playerId,
      nickname: playerData.nickname,
      score: playerData.score,
    }));

    await db.collection('community_rankings').add({
      activityId: roomId,
      communityId: roomData.communityId,
      results,
      createdAt: FieldValue.serverTimestamp(),
    });

    stopMonitoringRoom(roomId);

    await roomRef.remove();

    return { message: 'Trivia finalizada y resultados procesados.' };
  } catch (error) {
    console.error('Error al finalizar la trivia:', error);
    throw error;
  }
});

const stopMonitoringRoom = (roomId) => {
  const playersRef = rtdb.ref(`rooms/${roomId}/players`);
  playersRef.off(); // Detiene todos los listeners asociados a `playersRef`
};
