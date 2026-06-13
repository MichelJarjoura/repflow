import { CommentButton, LikeButton, SendButton } from "./IconButton";

export default function PostFooter({ onCommentClick, likes }: { onCommentClick?: () => void; likes: number }) {
  return (
    <div className="p-4 bg-surface/40 flex items-center gap-4">
      <LikeButton likes={likes} />
      <CommentButton comments={0} onClick={onCommentClick} />
      <SendButton />
    </div>
  );
}
