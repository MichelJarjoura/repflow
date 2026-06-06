import { Heart, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export function LikeButton({ likes }: { likes: number }) {
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

export function CommentButton({ comments, onClick }: { comments: number; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
          flex items-center gap-2
          px-3 py-2 rounded-xl
          transition-all duration-200
          hover:bg-zinc-800
          hover:scale-105
            
          text-muted-foreground
        `}
    >
      <MessageCircle size={20} fill="none" />
      <span className="text-sm font-medium">{comments}</span>
    </button>
  );
}

export function SendButton() {
  return (
    <button
      className={`
          flex items-center gap-2
          px-3 py-2 rounded-xl
          transition-all duration-200
          hover:bg-zinc-800
          hover:scale-105
            
          text-muted-foreground
        `}
    >
      <Send size={20} fill="none" />
    </button>
  );
}
