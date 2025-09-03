"use client";
import axiosInstance from "@/servies/axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import z, { ZodError } from "zod";

import { useUserStore } from "@/store/user";
import { timeAgo } from "@/servies/timesAgo";
import { AxiosResponse } from "axios";
import { errorToast } from "@/servies/toast";

type Comment = {
  _id: string;
  createdAt: string;
  message: string;
  userID: { username: string };
  likeCount: number;
  dislikeCount: number;
};

type Confession = {
  _id: string;
  title: string;
  body: string;
  likeCount: number;
  dislikeCount: number;
  comments: Comment[];
  createdAt: string;
  categories: string[];
};

const mongoID = z.object({ ID: z.string().min(1).max(25) });

const ReadConfessionpage = () => {
  const params = useParams();

  const [data, setData] = useState<Confession>();

  const handleNewComment = (newComment: Comment | null) => {
    if (!newComment) return;
    setData((prev) => {
      if (!prev) return undefined;

      return { ...prev, comments: [...prev.comments, newComment] };
    });
  };

  useEffect(() => {
    const getConfession = async () => {
      try {
        const { ID } = mongoID.parse(params);

        const res: AxiosResponse = await axiosInstance.get(`/confess/${ID}`, {
          withCredentials: true,
        });

        setData(res.data.confession);
      } catch (error: any) {
        if (error instanceof ZodError) {
          errorToast("invalid confession id");
          return;
        }

        errorToast(error.message || "Unable to perform this action");
        console.error(error);
      }
    };
    getConfession();
  }, [params]);
  return (
    data && (
      <section className="w-screen px-5 md:px-0 mt-5 overflow-x-hidden flex flex-col items-center">
        <ConfessionCard data={data} />
        <CommentInput confessionID={data._id} getNewComment={handleNewComment} />
        <div className="space-y-3 w-full flex flex-col mt-5 items-center justify-center">
          <h4 className="text-left w-full md:w-[60%] ">Comments on This Confession:</h4>
          {data.comments &&
            data.comments
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((comment, index) => <Comment key={index} comment={comment} />)}
        </div>
      </section>
    )
  );
};

export default ReadConfessionpage;

const ConfessionCard = ({ data }: { data: Confession }) => {
  const { isAuth } = useUserStore();

  const router = useRouter();

  const [count, setCount] = useState<{ likeCount: number; dislikeCount: number }>({
    likeCount: data.likeCount,
    dislikeCount: data.dislikeCount,
  });
  const handleLike = async () => {
    try {
      const res: AxiosResponse = await axiosInstance.post(`/confess/like/${data._id}`, {}, { withCredentials: true });

      if (res.data.success) {
        setCount((prev) => ({
          ...prev,
          dislikeCount: res.data.confession.dislikeCount,
          likeCount: res.data.confession.likeCount,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleDislike = async () => {
    try {
      const res: AxiosResponse = await axiosInstance.post(
        `/confess/dislike/${data._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setCount((prev) => ({
          ...prev,
          dislikeCount: res.data.confession.dislikeCount,
          likeCount: res.data.confession.likeCount,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div className="card w-full md:w-[60%] bg-base-200 shadow-xl border">
      {/* Header */}
      <div className="card-body p-4 flex flex-row justify-between items-center text-sm">
        <span>{timeAgo(data.createdAt)}</span>
        <span>
          ❤️{count.likeCount} | 💩{count.dislikeCount}
        </span>
      </div>

      {/* Title */}
      <div className="px-4">
        <h2 className="text-base md:text-xl font-semibold border-b ">{data.title}</h2>
      </div>
      {/* Content */}
      <div className="px-4 pb-2 mt-4">
        <p className="text-xs md:text-base leading-relaxed">{data.body}</p>
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2 flex justify-around text-sm">
        <button disabled={!isAuth} onClick={handleLike} className="btn btn-sm md:btn-md btn-ghost">
          ❤️ like
        </button>
        <button disabled={!isAuth} onClick={handleDislike} className="btn btn-sm md:btn-md btn-ghost">
          💩 dislike
        </button>
        <button
          disabled={!isAuth}
          onClick={() => router.push(`/report/${data._id}`)}
          className="btn btn-sm md:btn-md btn-ghost"
        >
          ⚠ Report
        </button>
      </div>

      {/* Categories */}
    </div>
  );
};

const CommentInput = ({ confessionID, getNewComment }: { confessionID: string; getNewComment: any }) => {
  const { isAuth } = useUserStore();
  const [commentText, setCommentText] = useState<string>("");

  const handleSendComment = async () => {
    try {
      const res: AxiosResponse = await axiosInstance.post(
        `/comments/write/${confessionID}`,
        { message: commentText },
        { withCredentials: true }
      );

      getNewComment(res.data.comment);
    } catch (error: any) {
      console.error(error.message || error);
      getNewComment(null);
    } finally {
      setCommentText("");
    }
  };

  return (
    <div className="w-full md:w-[60%] mt-3 flex items-center gap-2 p-4 bg-base-200 rounded-none shadow-md">
      <input
        type="text"
        placeholder="Write a comment..."
        className="input input-bordered input-sm flex-1 focus:outline-none"
        value={commentText}
        onKeyDown={({ key }: { key: string }) => {
          if (key == "Enter") {
            handleSendComment();
          }
        }}
        onChange={(e) => setCommentText(e.target.value)}
        disabled={!isAuth}
      />
      <button
        className="btn btn-primary btn-sm rounded-lg flex items-center justify-center p-2"
        disabled={!isAuth}
        onClick={handleSendComment}
      >
        <IoIosSend size={18} />
      </button>
    </div>
  );
};

const Comment = ({ comment }: { comment: Comment }) => {
  const { isAuth } = useUserStore();

  const [count, setCount] = useState<{ likeCount: number; dislikeCount: number }>({
    likeCount: comment.likeCount,
    dislikeCount: comment.dislikeCount,
  });

  const handleLike = async () => {
    try {
      const res: AxiosResponse = await axiosInstance.post(
        `/comments/like/${comment._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setCount((prev) => ({
          ...prev,
          dislikeCount: res.data.comment.dislikeCount,
          likeCount: res.data.comment.likeCount,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleDislike = async () => {
    try {
      const res: AxiosResponse = await axiosInstance.post(
        `/comments/dislike/${comment._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setCount((prev) => ({
          ...prev,
          dislikeCount: res.data.comment.dislikeCount,
          likeCount: res.data.comment.likeCount,
        }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div
      key={comment._id}
      className="card w-full md:w-[60%] bg-base-200 shadow-md rounded-lg p-3 flex flex-col space-y-1"
    >
      {/* Header: Username + timestamp */}
      <div className="flex justify-between items-center text-sm opacity-70">
        <span className="font-semibold">{comment.userID.username}</span>
        <span>{timeAgo(comment.createdAt)}</span>
      </div>

      {/* Message */}
      <p className="text-base leading-relaxed">{comment.message}</p>

      {/* Footer: Likes/Dislikes */}
      <div className="flex gap-4 text-sm opacity-80">
        <button
          disabled={!isAuth}
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-red-500 transition"
        >
          ❤️ {count.likeCount}
        </button>
        <button
          disabled={!isAuth}
          onClick={handleDislike}
          className="flex items-center gap-1 hover:text-red-500 transition"
        >
          💩 {count.dislikeCount}
        </button>
      </div>
    </div>
  );
};
