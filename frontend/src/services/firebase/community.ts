import { addDoc, collection, doc, documentId, getDoc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { Community } from "../../stores/zubstand";
import { db } from "./config";

interface CreateCommunityRequest {
  communityName: string;
  userId: string;
  avatar: string;
}

interface CommunityDetails {
  description: string;
  settings: {
    privacy: string;
  };
}

interface CreateCommunityRequest {
  communityName: string;
  avatar: string;
  description: string;
  ownerId: string;
}

export const createCommunity = async ({
  communityName,
  avatar,
  ownerId,
}: CreateCommunityRequest) => {
  if (!ownerId) {
    throw new Error("User not authenticated");
  }

  return await addDoc(collection(db, "communities"), {
    name: communityName,
    avatar: avatar || '',
    owner: ownerId,
    createAt: serverTimestamp(),
  });
};

export const getUserCommunities = async (userId: string): Promise<Community[]> => {
  const q = query(
    collection(db, "community_members"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);
  const communityIds = snapshot.docs.map((doc) => doc.data().communityId);

  if (communityIds.length === 0) {
    return [];
  }

  const communityQuery = query(
    collection(db, "communities"),
    where(documentId(), "in", communityIds)
  );

  const communitySnapshot = await getDocs(communityQuery);
  return communitySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    avatar: doc.data().avatar,
  }));
};

export const getCommunityDetails = async (
  communityId: string
): Promise<CommunityDetails | null> => {
  if (!communityId) {
    throw new Error('Community ID is required');
  }

  const detailsDoc = await getDoc(doc(db, 'community_details', communityId));

  if (detailsDoc.exists()) {
    return detailsDoc.data() as CommunityDetails;
  }

  console.warn(`No se encontraron detalles para la comunidad con ID: ${communityId}`);
  return null;
};