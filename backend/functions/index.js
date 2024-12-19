const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

// Inicialización de Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Sincronizar cuando se CREA una comunidad
exports.syncCommunityOnCreate = onDocumentCreated(
  'communities/{communityId}',
  async (event) => {
    const communityId = event.params.communityId;
    const communityData = event.data?.data();

    if (!communityData) {
      console.error('No se encontraron datos para la comunidad creada.');
      return;
    }

    const ownerId = communityData.owner;

    try {
      // Crear registro en `community_members` para el creador
      await db.collection('community_members').add({
        communityId,
        userId: ownerId,
        joinedAt: FieldValue.serverTimestamp(),
        role: 'owner', // Rol del creador
      });

      console.log(`Propietario añadido a community_members: ${ownerId}`);

      // Crear registro en `community_details` con valores predeterminados
      await db
        .collection('community_details')
        .doc(communityId)
        .set({
          description: '', // Descripción vacía
          settings: {
            privacy: 'public', // Configuración predeterminada
          },
          createAt: FieldValue.serverTimestamp(),
        });

      console.log(
        `Detalles predeterminados añadidos para comunidad: ${communityId}`
      );
    } catch (error) {
      console.error('Error durante la sincronización de comunidad:', error);
      throw error;
    }
  }
);
