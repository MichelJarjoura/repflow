import { useState } from "react";
import { PostHeader } from "../components/PostHeader";
import PostFooter from "../components/PostFooter";
import { WorkoutPostContent } from "../components/PostContent";
import { Comments } from "../components/Comments";

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
      <PostFooter onCommentClick={() => setShowComments(!showComments)} likes={0} />
      {showComments && <Comments />}
    </article>
  );
}
