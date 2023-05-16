import { useRouter } from "next/router";
import { useState, memo } from "react";
import { BsFillHeartFill } from "react-icons/bs";
import { IFavorite, useUpsertFavoriteMutation } from "@/query/favoriteQuery";
import useStore from "@/store/useStore";

interface IBaseProps {
  userId: string | null;
  isFavorite: boolean;
  favoriteData?: IFavorite;
  memberId: string;
}

const FavoriteButton: React.FC<IBaseProps> = ({
  userId,
  isFavorite,
  favoriteData,
  memberId,
}) => {
  const router = useRouter();
  const [favorite, setFavorite] = useState<boolean>(isFavorite);
  const addFavorite = useStore((state) => state.addFavorite);
  const removeFavorite = useStore((state) => state.removeFavorite);
  const updateFavoriteMutation = useUpsertFavoriteMutation();

  const handleFavoriteClick = async (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault();

    favorite ? addFavorite(memberId!) : removeFavorite(memberId!);
    if (!userId) {
      return new Promise((resolve, reject) => {
        router.push("/signin");
        reject("Sign In");
      });
    }

    !isFavorite
      ? await updateFavoriteMutation.mutateAsync({
          id: userId!,
          favorite: favoriteData?.favorite
            ? [...favoriteData.favorite, memberId]
            : [memberId],
        })
      : await updateFavoriteMutation.mutateAsync({
          id: userId!,
          favorite: favoriteData?.favorite
            ? favoriteData.favorite.filter((f) => f !== memberId)
            : [],
        });

    setFavorite((prev) => !prev);
  };

  return (
    <BsFillHeartFill
      className={`${
        favorite ? "text-red-500 dark:text-red-500" : "text-gray-400 dark:text-gray-600"
      } z-10 cursor-pointer text-3xl transition-all duration-200 ease-in-out hover:scale-110 `}
      onClick={handleFavoriteClick}
    />
  );
};

export default memo(FavoriteButton);
