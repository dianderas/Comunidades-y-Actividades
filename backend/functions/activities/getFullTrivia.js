const { https } = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

exports.getFullTrivia = https.onCall(async ({ data, auth }) => {
  const { activityId, communityId } = data;
  const userId = auth?.uid;

  try {
    if (!userId) {
      throw new https.HttpsError(
        'unauthenticated',
        'El usuario no está autenticado.'
      );
    }

    if (!activityId) {
      throw new https.HttpsError('invalid-argument', 'Falta activityId.');
    }

    const ownerDoc = await db
      .collection('community_members')
      .doc(`${communityId}_${userId}`)
      .get();

    if (!ownerDoc.exists || ownerDoc.data().role !== 'owner') {
      throw new https.HttpsError(
        'permission-denied',
        'No tienes permisos para crear temporadas.'
      );
    }

    const activityDoc = await db
      .collection('communities')
      .doc(communityId)
      .collection('activities')
      .doc(activityId)
      .get();

    if (!activityDoc.exists) {
      throw new https.HttpsError(
        'not-found',
        `La actividad con ID ${activityId} no existe.`
      );
    }

    const activityData = activityDoc.data();

    if (!activityData.details) {
      throw new https.HttpsError(
        'not-found',
        'No se encontraron detalles asociados a esta actividad.'
      );
    }

    const detailsDoc = await db
      .collection('activity_details')
      .doc(activityData.details)
      .get();

    if (!detailsDoc.exists) {
      throw new https.HttpsError(
        'not-found',
        `No se encontraron detalles para la actividad con ID ${activityId}.`
      );
    }

    const detailsData = detailsDoc.data();

    return {
      activity: {
        id: activityId,
        ...activityData,
      },
      details: {
        questions: detailsData.questions,
      },
    };
  } catch (error) {
    console.error('Error al obtener activity:', { ...error });
    throw error;
  }
});
