import { useState } from "react";
import { PostHeader } from "../post-components/PostHeader";
import PostFooter from "../post-components/PostFooter";
import { WorkoutPostContent } from "../post-components/PostContent";
import { Comments } from "../post-components/Comments";

type Exercise = {
  name: string;
  detail: string;
};

type Props = {
  avatar: string;
  name: string;
  meta: string;
  volume: string;
  duration: string;
  exercises: Exercise[];
};

export function WorkoutPost({ avatar, name, meta, volume, duration, exercises }: Props) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden">
      <PostHeader avatar={avatar} name={name} meta={meta} />
      <WorkoutPostContent volume={volume} duration={duration} exercises={exercises} />
      <PostFooter onCommentClick={() => setShowComments(!showComments)} />
      {showComments && <Comments />}
    </article>
  );
}
