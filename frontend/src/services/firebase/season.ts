import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "./config";

interface CreateSeasonRequest {
  communityId: string;
  name: string;
  startDate: string;
  endDate: string;
}

export const createSeason = async (params: CreateSeasonRequest) => {
  const { communityId, name, startDate, endDate } = params;

  const seasonData = {
    name,
    communityId,
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString(),
    createdAt: serverTimestamp(),
    status: 'active'
  };

  return await addDoc(collection(db, 'seasons'), seasonData)
}

export const getSeasonsByCommunity = async (
  communityId: string
) => {
  const q = query(
    collection(db, "seasons"),
    where("communityId", "==", communityId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      communityId: data.communityId,
      name: data.name,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      status: data.status,
      createdAt: data.createdAt.toDate(),
    };
  });
};

