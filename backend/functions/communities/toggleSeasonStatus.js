const { https } = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();
exports.toggleSeasonStatus = https.onCall(async ({ data, auth }) => {
  const { seasonId, communityId } = data;
  const userId = auth?.uid;

  try {
    if (!userId) {
      throw new https.HttpsError(
        'unauthenticated',
        'El usuario no está autenticado.'
      );
    }

    if (!seasonId || !communityId) {
      throw new https.HttpsError(
        'invalid-argument',
        'El ID de la temporada y el ID de la comunidad son obligatorios.'
      );
    }

    const ownerSnapshot = await db
      .collection('community_members')
      .doc(`${communityId}_${userId}`)
      .get();

    if (!ownerSnapshot.exists || ownerSnapshot.data().role !== 'owner') {
      throw new https.HttpsError(
        'permission-denied',
        'Solo el propietario de la comunidad puede alternar el estado de las temporadas.'
      );
    }

    const seasonRef = db
      .collection('communities')
      .doc(communityId)
      .collection('seasons')
      .doc(seasonId);

    const seasonSnapshot = await seasonRef.get();

    if (!seasonSnapshot.exists) {
      throw new https.HttpsError('not-found', 'La temporada no existe.');
    }

    const currentStatus = seasonSnapshot.data().status;

    if (currentStatus === 'active') {
      const activitiesSnapshot = await db
        .collection('communities')
        .doc(communityId)
        .collection('activities')
        .where('seasonId', '==', seasonId)
        .where('status', '==', 'active')
        .get();

      if (!activitiesSnapshot.empty) {
        throw new https.HttpsError(
          'failed-precondition',
          'La temporada tiene actividades activas y no puede desactivarse.'
        );
      }
    }

    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await seasonRef.update({ status: newStatus });

    return {
      seasonId,
      newStatus,
    };
  } catch (error) {
    console.error('Error al actualizar el status de la season:', { ...error });
    throw error;
  }
});
