const { https } = require('firebase-functions/v2');
const admin = require('firebase-admin');
const { FieldPath } = require('firebase-admin/firestore');

const db = admin.firestore();

exports.getCommunityDetails = https.onCall(async ({ data, auth }) => {
  const { communityId } = data;
  const ownerId = auth?.uid;

  if (!communityId) {
    throw new Error('El ID de la comunidad es obligatorio.');
  }

  if (!ownerId) {
    throw new https.HttpsError(
      'unauthenticated',
      'El usuario no está autenticado.'
    );
  }

  try {
    const communityDoc = await db
      .collection('communities')
      .doc(communityId)
      .collection('details')
      .doc('info')
      .get();

    if (!communityDoc.exists) {
      throw new Error(`La comunidad con ID ${communityId} no existe.`);
    }

    const communityData = {
      ...communityDoc.data(),
      communityId,
      createdAt: communityDoc.data().createdAt.toDate().toISOString(),
    };

    const membersSnaphost = await db
      .collection('community_members')
      .where('communityId', '==', communityId)
      .get();

    const memberIds = membersSnaphost.docs.map((doc) => doc.data().userId);

    const batchSize = 10;
    const memberChunks = [];
    for (let i = 0; i < memberIds.length; i += batchSize) {
      memberChunks.push(memberIds.slice(i, i + batchSize));
    }

    const userPromises = memberChunks.map((chunk) =>
      db.collection('users').where(FieldPath.documentId(), 'in', chunk).get()
    );

    const userSnapShots = await Promise.all(userPromises);
    const members = userSnapShots.flatMap((snapshot) =>
      snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate().toISOString(),
      }))
    );

    return {
      ...communityData,
      members,
    };
  } catch (error) {
    console.error('Error al obtener los detalles de la comunidad:', error);
    throw new Error('No se pudieron obtener los detalles de la comunidad.');
  }
});
