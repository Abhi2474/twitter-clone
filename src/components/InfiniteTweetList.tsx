import Link from "next/link";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProfileImage from "./ProfileImage";

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
};

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
};

export const InfiniteTweetList = ({
  tweets,
  fetchNewTweets,
  hasMore,
  isError,
  isLoading,
}: InfiniteTweetListProps) => {
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error...</h1>;

  if (tweets == null || tweets?.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
    );
  }

  return (
    <InfiniteScroll
      dataLength={tweets.length}
      next={fetchNewTweets}
      hasMore={hasMore}
      loader={"loading..."}
    >
      {tweets.map((tweet) => {
        return <TweetCard key={tweet.id} {...tweet} />;
      })}
    </InfiniteScroll>
  );
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'short'})

function TweetCard({
  id,
  content,
  createdAt,
  likeCount,
  likedByMe,
  user,
}: Tweet) {
  return (
    <li className="flex gap-4 border-b p-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
        <Link href={`profiles/${user.id}`} className="font-bold outline-none hover:underline focus-visible:underline" >{user.name}</Link>
        <span className="text-gray-500">- </span>
        <span className="text-gray-500">{dateTimeFormatter.format(createdAt)} </span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </li>
  );
}
