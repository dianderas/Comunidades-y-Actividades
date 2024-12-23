const { https } = require('firebase-functions/v2');
const admin = require('firebase-admin');

const db = admin.firestore();

exports.getCommunityByInviteToken = https.onCall(async ({ data }) => {
  const token = data.token;

  if (!token) {
    throw new Error('El token es obligatorio.');
  }

  const querySnapshot = await db
    .collectionGroup('details')
    .where('inviteToken', '==', token)
    .limit(1)
    .get();

  if (querySnapshot.empty) {
    throw new Error('Token no válido o comunidad no encontrada.');
  }

  const detailsDoc = querySnapshot.docs[0];
  const communityRef = detailsDoc.ref.parent.parent;

  if (!communityRef) {
    throw new Error('No se encontró la comunidad asociada.');
  }

  const communityDoc = await communityRef.get();

  if (!communityDoc.exists) {
    throw new Error('La comunidad asociada no existe.');
  }

  const communityData = communityDoc.data();

  return {
    id: communityDoc.id,
    name: communityData?.name,
    avatar: communityData?.avatar,
  };
});
