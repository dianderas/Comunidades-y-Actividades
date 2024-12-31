const { https } = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();
const rtdb = admin.database();

const TOLERANCE_TIME = 60 * 1000; // 60 sec

exports.createTriviaRoom = https.onCall(async ({ data, auth }) => {
  const { communityId, activityId } = data;
  const userId = auth?.uid;
  try {
    if (!userId) {
      throw new https.HttpsError('unauthenticated', 'Usuario no autenticado.');
    }

    const ownerDoc = await db
      .collection('community_members')
      .doc(`${communityId}_${userId}`)
      .get();

    if (!ownerDoc.exists || ownerDoc.data().role !== 'owner') {
      throw new https.HttpsError(
        'permission-denied',
        'No tienes permisos para crear el room.'
      );
    }

    const triviaDetailsDoc = await db
      .collection('activity_details')
      .doc(activityId)
      .get();

    if (!triviaDetailsDoc.exists) {
      throw new https.HttpsError(
        'not-found',
        'No se encontraron detalles para esta trivia.'
      );
    }

    const roomRef = rtdb.ref(`rooms/${activityId}`);
    await roomRef.set({
      activityId,
      communityId,
      ownerId: userId,
      status: 'waiting',
      players: {},
      questions: triviaDetailsDoc.data().questions,
      currentQuestion: null,
      createdAt: Date.now(),
    });

    monitorRoomPlayers(roomId);

    return { roomId: activityId };
  } catch (error) {
    throw error;
  }
});

const monitorRoomPlayers = (roomId) => {
  const playersRef = rtdb.ref(`rooms/${roomId}/players`);

  playersRef.on('value', (snapshot) => {
    const players = snapshot.val();

    if (players) {
      Object.entries(players).forEach(([userId, playerData]) => {
        const { disconnectedAt } = playerData;

        if (disconnectedAt && Date.now() - disconnectedAt > TOLERANCE_TIME) {
          // Eliminar al jugador si supera el tiempo de tolerancia
          playersRef.child(userId).remove();
        }
      });
    }
  });
};
