import React, { FormEvent, useCallback, useLayoutEffect, useRef, useState } from "react";
import Button from "./Button";
import ProfileImage from "./ProfileImage";
import { UseSessionOptions, useSession } from "next-auth/react";
import { api } from "~/utils/api";

// function to increase the text area when hit the enter or increases the word limit
const updateTextAreaSize = (textArea?: HTMLTextAreaElement) => {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};


// main react component which will be exported to use it in another component
export const NewTweetForm = () => {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  return <Form />;
};


// Form component already used above
function Form() {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);


  // useLayoutEffect has the synchronous behaviour to do the side effect, so presumably it can give the compilation error that's why it only used after the data fetched.

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  // useContext hook is belongs to trpc library
  const trpcUtils = api.useContext()

  const createTweet = api.tweet.create.useMutation({onSuccess:(newTweet)=>{
    console.log(newTweet);
    setInputValue('')

    if(session.status !== 'authenticated') return

    trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData)=>{
      if(oldData == null || oldData.pages[0] == null ) return 

      const newCacheTweet = {
        ...newTweet,
        likeCount: 0,
        likedByMe: false, 
        user: {
          id: session.data.user.id,
          name: session.data.user.name || null,
          image: session.data.user.image || null
        }
      }
       return {
        ...oldData,
        pages: [
          {
            ...oldData.pages[0],
            tweets: [newCacheTweet, ...oldData.pages[0].tweets]
          },
          ...oldData.pages.slice(1)
        ]
       }
    })

  }})

  function handleSubmit(e:FormEvent){
    e.preventDefault()

    // mutate keyword is belongs to the trpc lib and used to manage the change like POST, UPDATE or DELETE http methods request
    createTweet.mutate({content:inputValue})
  }

  return (
    <label>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b px-4 py-2">
        <div className="flex gap-4">
          <ProfileImage src={session?.data?.user.image} />
          <textarea
            ref={inputRef}
            style={{ height: 0 }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
            placeholder="What's happening?"
          />
        </div>
        <Button className="self-end">Tweet</Button>
      </form>
    </label>
  );
}
