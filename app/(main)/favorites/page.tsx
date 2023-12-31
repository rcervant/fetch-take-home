import getCurrentUser from "@/actions/getCurrentUser";
import EmptyState from "@/components/EmptyState";
import getFavoriteDogs from "@/actions/getFavoriteDogs";
import FavoriteDogs from "@/app/(main)/favorites/_components/FavoriteDogs";
import { SIGN_IN_PATH } from "@/lib/constants";
import { redirect } from "next/navigation";

const FavoriteDogsPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect(`${process.env.NEXT_PUBLIC_ORIGIN}${SIGN_IN_PATH}`);
  }

  const favoriteDogs = await getFavoriteDogs();
  if (!favoriteDogs) throw new Error("No favorite dogs found");

  if (favoriteDogs.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        subtitle="Looks like you have no favorite dogs."
      />
    );
  }

  return <FavoriteDogs favoriteDogs={favoriteDogs} currentUser={currentUser} />;
};

export default FavoriteDogsPage;
