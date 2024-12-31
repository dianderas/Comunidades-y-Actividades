const { https } = require('firebase-functions/v2');
const admin = require('firebase-admin');

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

    // Obtener los 5 últimos miembros de la comunidad
    const membersSnapshot = await db
      .collection('communities')
      .doc(communityId)
      .collection('members')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    const memberIds = membersSnapshot.docs.map((doc) => doc.id);
    const userSnapshots = await Promise.all(
      memberIds.map((id) => db.collection('users').doc(id).get())
    );

    const members = userSnapshots.map((doc) => ({
      id: doc.id,
      nickname: doc.data()?.nickname || '',
      avatar: doc.data()?.avatar || '',
    }));

    // Obtener todas las temporadas activas
    const seasonsSnapshot = await db
      .collection('communities')
      .doc(communityId)
      .collection('seasons')
      .get();

    const seasons = seasonsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    // Obtener todas las actividades activas y sus nombres de temporada
    const activitiesSnapshot = await db
      .collection('communities')
      .doc(communityId)
      .collection('activities')
      //.where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    const activities = await Promise.all(
      activitiesSnapshot.docs.map(async (doc) => {
        const activity = doc.data();
        const seasonName =
          activity.seasonId &&
          seasons.find((s) => s.id === activity.seasonId)?.name;
        return {
          id: doc.id,
          name: activity.name,
          type: activity.type,
          seasonName: seasonName || 'Sin temporada',
        };
      })
    );
    return {
      ...communityData,
      members,
      seasons,
      activities,
    };
  } catch (error) {
    console.error('Error al obtener los detalles de la comunidad:', error);
    throw error;
  }
});
