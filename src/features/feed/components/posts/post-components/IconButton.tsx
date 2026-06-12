import { Heart, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { AuthModal } from "@/features/auth/components/AuthModal";

export function LikeButton({ likes }: { likes: number }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  function handleLike() {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }

    setLiked(!liked);
  }

  return (
    <>
      <button
        onClick={handleLike}
        className={`
            flex items-center gap-2
            px-3 py-2 rounded-xl
            transition-all duration-200
            hover:bg-elevated
            hover:scale-105
    
            ${liked ? "text-brand" : "text-muted-foreground"}
          `}
      >
        <Heart size={20} fill={liked ? "currentColor" : "none"} />

        <span className="text-sm font-medium">{likeCount}</span>
      </button>
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}

export function CommentButton({ comments, onClick }: { comments: number; onClick?: () => void }) {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`
            flex items-center gap-2
            px-3 py-2 rounded-xl
            transition-all duration-200
            hover:bg-elevated
            hover:scale-105
              
            text-muted-foreground
          `}
      >
        <MessageCircle size={20} fill="none" />
        <span className="text-sm font-medium">{comments}</span>
      </button>
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}

export function SendButton() {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => !isAuthenticated && setIsAuthModalOpen(true)}
        className={`
            flex items-center gap-2
            px-3 py-2 rounded-xl
            transition-all duration-200
            hover:bg-elevated
            hover:scale-105
              
            text-muted-foreground
          `}
      >
        <Send size={20} fill="none" />
      </button>
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}
