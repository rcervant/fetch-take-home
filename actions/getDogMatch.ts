"use server";

import getCurrentUser from "./getCurrentUser";
import getFavoriteDogs from "./getFavoriteDogs";
import getDogsById from "./getDogsById";

const getDogMatch = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("No current user");

    const favoriteDogs = await getFavoriteDogs();
    if (!favoriteDogs) throw new Error(`Could not fetch favoriteDogs`);

    if (favoriteDogs.length === 0) return null;

    const favoriteDogIds = favoriteDogs.map((favorite) => favorite.id);
    if (!favoriteDogIds) throw new Error(`Could not fetch favoriteDogIds`);

    const FETCH_API_URL = process.env.NEXT_PUBLIC_FETCH_API_URL;
    if (!FETCH_API_URL) throw new Error("No fetch api url");

    const res = await fetch(`${FETCH_API_URL}/dogs/match`, {
      method: "POST",
      body: JSON.stringify(favoriteDogIds),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: currentUser.session,
      },
    });

    if (!res) throw new Error("No response");

    if (!res.ok) {
      throw new Error(`Error in getDogMatch: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as { match: string };
    if (!data) throw new Error("No data");

    const matchedDogId = data.match;

    if (!matchedDogId) throw new Error("No matched dog id");

    const [matchedDog] = await getDogsById({
      dogIdsToRetrieve: [matchedDogId],
      user: currentUser,
    });

    if (!matchedDog) throw new Error("No matched dog");

    return matchedDog;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export default getDogMatch;
