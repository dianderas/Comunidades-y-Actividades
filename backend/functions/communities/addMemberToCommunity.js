const { https } = require('firebase-functions/v2');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const db = admin.firestore();

exports.addMemberToCommunity = https.onCall(async ({ data, auth }) => {
  const { communityId, userId, role = 'member' } = data;
  try {
    if (!auth?.uid) {
      throw new https.HttpsError(
        'unauthenticated',
        'El usuario no está autenticado.'
      );
    }

    if (!communityId || !userId) {
      throw new https.HttpsError(
        'invalid-argument',
        'Faltan datos requeridos.'
      );
    }

    const existingMemberRef = db
      .collection('community_members')
      .doc(`${communityId}_${userId}`);
    const existingMemberSnapshot = await existingMemberRef.get();

    if (existingMemberSnapshot.exists) {
      throw new https.HttpsError(
        'already-exists',
        'El usuario ya es miembro de esta comunidad.'
      );
    }

    const batch = db.batch();

    // Agregar a community_members
    batch.set(existingMemberRef, {
      communityId,
      userId,
      role,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Agregar a la subcolección members dentro de la comunidad
    const memberSubRef = db
      .collection('communities')
      .doc(communityId)
      .collection('members')
      .doc(userId);
    batch.set(memberSubRef, {
      userId,
      role,
      nickanme,
      createdAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return {
      success: true,
      message: 'El usuario fue añadido a la comunidad correctamente.',
    };
  } catch (error) {
    console.error('Error al añadir miembro a la comunidad:', { ...error });
    throw error;
  }
});
