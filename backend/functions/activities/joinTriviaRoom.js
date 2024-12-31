const { https } = require('firebase-functions');
const admin = require('firebase-admin');

const rtdb = admin.database();

exports.joinTriviaRoom = https.onCall(async ({ data, auth }) => {
  const { roomId, nickname } = data;
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

    const playerRef = roomRef.child(`players/${userId}`);
    const playerSnapshot = await playerRef.get();

    if (playerSnapshot.exists()) {
      throw new https.HttpsError('already-exists', 'Ya estás unido al room.');
    }

    await playerRef.set({
      nickname,
      score: 0,
      lastSeen: Date.now(),
    });

    playerRef.onDisconnect().update({
      disconnectedAt: Date.now(),
    });

    return { message: 'Unido exitosamente al room.' };
  } catch (error) {
    throw error;
  }
});
