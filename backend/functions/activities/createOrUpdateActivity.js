const { https } = require('firebase-functions');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const db = admin.firestore();

exports.createOrUpdateActivity = https.onCall(async ({ data, auth }) => {
  const { activityId, name, communityId, details, seasonId, type } = data;
  const userId = auth?.uid;
  const serverTime = FieldValue.serverTimestamp();

  try {
    if (!userId) {
      throw new https.HttpsError(
        'unauthenticated',
        'El usuario no está autenticado.'
      );
    }

    if (!name || !communityId || !type) {
      throw new https.HttpsError(
        'invalid-argument',
        'Faltan datos obligatorios.'
      );
    }

    const ownerDoc = await db
      .collection('community_members')
      .doc(`${communityId}_${userId}`)
      .get();

    if (!ownerDoc.exists || ownerDoc.data().role !== 'owner') {
      throw new https.HttpsError(
        'permission-denied',
        'No tienes permisos para crear o actualizar actividades.'
      );
    }

    if (seasonId) {
      const seasonsSnapshot = await db
        .collection('communities')
        .doc(communityId)
        .collection('seasons')
        .get(seasonId);

      if (!seasonsSnapshot.exists) {
        throw new https.HttpsError(
          'not-found',
          `La season con ID ${seasonId} no existe.`
        );
      }
    }

    const batch = db.batch();

    let activityRef;
    let detailsRef;

    if (activityId) {
      activityRef = db
        .collection('communities')
        .doc(communityId)
        .collection('activities')
        .doc(activityId);

      const activityDoc = await activityRef.get();

      if (!activityDoc.exists) {
        throw new https.HttpsError(
          'not-found',
          `La actividad con ID ${activityId} no existe.`
        );
      }

      batch.update(activityRef, {
        name,
        type,
        seasonId: seasonId || null,
        updatedAt: serverTime,
      });

      if (type === 'trivia' && Array.isArray(details)) {
        detailsRef = db.collection('activity_details').doc(activityId);

        const generatedQuestions = details.map((question) => ({
          ...question,
          updatedAt: new Date(),
        }));

        batch.update(detailsRef, {
          questions: generatedQuestions,
          updatedAt: serverTime,
        });
      }
    } else {
      activityRef = db
        .collection('communities')
        .doc(communityId)
        .collection('activities')
        .doc();

      batch.set(activityRef, {
        name,
        type,
        communityId,
        seasonId: seasonId || null,
        status: 'active',
        createdAt: serverTime,
      });

      if (type === 'trivia' && Array.isArray(details)) {
        detailsRef = db.collection('activity_details').doc(activityRef.id);

        const generatedQuestions = details.map((question) => ({
          ...question,
          createdAt: new Date(),
        }));

        batch.set(detailsRef, {
          questions: generatedQuestions,
          createdAt: serverTime,
        });

        batch.update(activityRef, {
          details: detailsRef.id,
        });
      }
    }

    await batch.commit();

    return {
      activityId: activityRef.id,
      name,
      type,
      seasonName: seasonsSnapshot.data().name,
      action: activityId ? 'updated' : 'created',
    };
  } catch (error) {
    console.error('Error al crear o actualizar actividad:', { ...error });
    throw error;
  }
});
