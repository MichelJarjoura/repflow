import { Heart } from "lucide-react";
import { useState } from "react";

type IconButtonProps = {
  children: React.ReactNode;
};

export function IconButton({ children }: IconButtonProps) {
  return (
    <button
      className="
          flex items-center gap-2
          px-3 py-2 rounded-xl
          transition-all duration-200
          text-muted-foreground
          hover:bg-zinc-800
          hover:scale-105
        "
    >
      {children}
    </button>
  );
}

type LikeButtonProps = {
  likes: number;
};

export function LikeButton({ likes }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  // temporary code .......

  function handleLike() {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }

    setLiked(!liked);
  }

  return (
    <button
      onClick={handleLike}
      className={`
          flex items-center gap-2
          px-3 py-2 rounded-xl
          transition-all duration-200
          hover:bg-zinc-800
          hover:scale-105
  
          ${liked ? "text-brand" : "text-muted-foreground"}
        `}
    >
      <Heart size={20} fill={liked ? "currentColor" : "none"} />

      <span className="text-sm font-medium">{likeCount}</span>
    </button>
  );
}
