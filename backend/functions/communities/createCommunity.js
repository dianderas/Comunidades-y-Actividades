const { https } = require('firebase-functions/v2');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const db = admin.firestore();

exports.createCommunity = https.onCall(async ({ data, auth }) => {
  const { name, avatar } = data;
  const ownerId = auth?.uid;

  if (!ownerId) {
    throw new https.HttpsError(
      'unauthenticated',
      'El usuario no está autenticado.'
    );
  }

  if (!name || typeof name !== 'string') {
    throw new https.HttpsError(
      'invalid-argument',
      'El nombre de la comunidad es requerido.'
    );
  }

  const batch = db.batch();

  try {
    const communityRef = db.collection('communities').doc();
    batch.set(communityRef, {
      name: name.trim(),
      owner: ownerId,
      avatar: avatar || '',
      createdAt: FieldValue.serverTimestamp(),
    });

    const communityId = communityRef.id;
    const token = Date.now().toString(36);

    const detailsRef = communityRef.collection('details').doc('info');
    batch.set(detailsRef, {
      description: '',
      settings: {
        privacy: 'public',
      },
      inviteToken: token,
      createdAt: FieldValue.serverTimestamp(),
    });

    const membersRef = communityRef.collection('members').doc(ownerId);
    batch.set(membersRef, {
      createdAt: FieldValue.serverTimestamp(),
      role: 'owner',
    });

    const communityMemberRef = db
      .collection('community_members')
      .doc(`${communityId}_${ownerId}`);
    batch.set(communityMemberRef, {
      communityId: communityId,
      userId: ownerId,
      createdAt: FieldValue.serverTimestamp(),
      role: 'owner',
    });

    // Ejecutar todas las operaciones
    await batch.commit();

    return {
      communityId: communityId,
    };
  } catch (error) {
    console.error('Error al crear la comunidad:', { ...error });
    throw error;
  }
});
