"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
const page = () => {
  const router = useRouter();

  useEffect(() => router.push("/auth/register"));
  return (
    <div className="w-screen h-screen flex justify-center items-center text-3xl md:text-8xl">
      dont mess with the url kid
    </div>
  );
};

export default page;
