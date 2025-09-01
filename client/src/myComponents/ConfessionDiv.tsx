"use client";
import axiosInstance from "@/servies/axios";
import { timeAgo } from "@/servies/timesAgo";
import { Confession } from "@/types";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ConfessionDiv = ({ data }: { data: Confession }) => {
  const words = data.body.split(" ");
  const preview = words.length > 70 ? words.slice(0, 70).join(" ") + "........" : data.body;

  const router = useRouter();

  const [count, setCount] = useState<{ likeCount: number; dislikeCount: number }>({
    likeCount: data.likeCount,
    dislikeCount: data.dislikeCount,
  });

  const handlelike = async () => {
    try {
      const res = await axiosInstance.post(`/confess/like/${data._id}`, {}, { withCredentials: true });

      if (res.data.success) {
        setCount((prev) => ({
          ...prev,
          dislikeCount: res.data.confession.dislikeCount,
          likeCount: res.data.confession.likeCount,
        }));
      }

      console.log(res.data);
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleDislike = async () => {
    try {
      const res = await axiosInstance.post(`/confess/dislike/${data._id}`, {}, { withCredentials: true });

      if (res.data.success) {
        setCount((prev) => ({
          ...prev,
          dislikeCount: res.data.confession.dislikeCount,
          likeCount: res.data.confession.likeCount,
        }));
      }

      console.log(res.data);
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

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-base leading-relaxed cursor-pointer" onClick={() => router.push(`/confession/${data._id}`)}>
          {preview}
        </p>
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2 flex justify-around text-sm">
        <button onClick={handlelike} className="btn btn-sm md:btn-md btn-ghost">
          ❤️ like
        </button>
        <button onClick={handleDislike} className="btn btn-sm md:btn-md btn-ghost">
          💩 dislike
        </button>
        <button onClick={() => router.push(`/confession/${data._id}`)} className="btn btn-sm md:btn-md btn-ghost">
          💬 Comment
        </button>
        <button onClick={() => alert("working on report")} className="btn btn-sm md:btn-md btn-ghost">
          ⚠ Report
        </button>
      </div>

      {/* Categories */}
      <div className="px-4 py-2 flex flex-wrap gap-2 border-t">
        {["uno", "dos", "tres", "char", "pach"].map((cat: string, idx: number) => (
          <span key={idx} className="px-3 py-1 text-xs rounded-full bg-base-300">
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ConfessionDiv;
