import { useState } from "react";
import { PostHeader } from "../post-components/PostHeader";
import PostFooter from "../post-components/PostFooter";
import { PRPostContent } from "../post-components/PostContent";
import { Comments } from "../post-components/Comments";

type Props = {
  avatar: string;
  name: string;
  meta: string;
  lift: string;
  value: string;
};

export function PRPost({ avatar, name, meta, lift, value }: Props) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="bg-card border border-brand/30 rounded-xl overflow-hidden shadow-[0_0_40px_-15px_rgba(223,255,0,0.15)]">
      <PostHeader avatar={avatar} name={name} meta={meta} badge="New PR" />
      <PRPostContent lift={lift} value={value} />
      <PostFooter onCommentClick={() => setShowComments(!showComments)} />
      {showComments && <Comments />}
    </article>
  );
}
