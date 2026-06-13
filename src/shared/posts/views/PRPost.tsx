import { useState } from "react";
import { PostHeader } from "../components/PostHeader";
import PostFooter from "../components/PostFooter";
import { PRPostContent } from "../components/PostContent";
import { Comments } from "../components/Comments";

type Props = {
  avatar: string;
  name: string;
  meta: string;
  lift: string;
  value: string;
  likes: number;
};

export function PRPost({ avatar, name, meta, lift, value, likes }: Props) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="bg-card border border-brand/30 rounded-xl overflow-hidden shadow-[0_0_40px_-15px_rgba(223,255,0,0.15)]">
      <PostHeader avatar={avatar} name={name} meta={meta} badge="New PR" />
      <PRPostContent lift={lift} value={value} />
      <PostFooter onCommentClick={() => setShowComments(!showComments)} likes={0} />
      {showComments && <Comments />}
    </article>
  );
}
