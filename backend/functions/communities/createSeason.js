const { https } = require('firebase-functions');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const db = admin.firestore();

exports.createSeason = https.onCall(async ({ data, auth }) => {
  const { name, communityId } = data;
  const userId = auth?.uid;

  try {
    if (!userId) {
      throw new https.HttpsError(
        'unauthenticated',
        'El usuario no está autenticado.'
      );
    }

    if (!name || !communityId) {
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
        'No tienes permisos para crear temporadas.'
      );
    }

    const seasonRef = db
      .collection('communities')
      .doc(communityId)
      .collection('seasons')
      .doc();

    await seasonRef.set({
      seasonId: seasonRef.id,
      name: name.trim(),
      status: 'active',
      createdAt: FieldValue.serverTimestamp(),
    });

    return { seasonId: seasonRef.id, status: 'active', name };
  } catch (error) {
    console.error('Error al crear season:', { ...error });
    throw error;
  }
});
