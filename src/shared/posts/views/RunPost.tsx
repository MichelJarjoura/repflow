import { useState } from "react";
import { PostHeader } from "../components/PostHeader";
import routeImg from "@/assets/run-route.jpg";
import PostFooter from "../components/PostFooter";
import { RunPostContent } from "../components/PostContent";
import { Comments } from "../components/Comments";

type Props = {
  avatar: string;
  name: string;
  meta: string;
  distance: string;
  pace: string;
};

export function RunPost({ avatar, name, meta, distance, pace }: Props) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden">
      <PostHeader avatar={avatar} name={name} meta={meta} bordered={false} />
      <RunPostContent routeImg={routeImg} distance={distance} pace={pace} />
      <PostFooter onCommentClick={() => setShowComments(!showComments)} likes={0} />
      {showComments && <Comments />}
    </article>
  );
}
