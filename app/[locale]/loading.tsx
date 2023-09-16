import { Loader2Icon } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="h-screen w-screen bg-white z-50">
      <div className="flex flex-col justify-center items-center h-full">
        <Loader2Icon className="animate-spin text-5xl text-gray-500" />
      </div>
    </div>
  );
};

export default Loading;
