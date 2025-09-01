import React from "react";

const ConfessionDivFB = () => {
  return (
    <div className="card w-full md:w-[60%] bg-base-200 shadow-xl border animate-pulse">
      {/* Header */}
      <div className="card-body p-4 flex flex-row justify-between items-center text-sm">
        <div className="h-4 w-20 bg-base-300 rounded"></div>
        <div className="h-4 w-24 bg-base-300 rounded"></div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2 space-y-2">
        <div className="h-4 w-full bg-base-300 rounded"></div>
        <div className="h-4 w-[90%] bg-base-300 rounded"></div>
        <div className="h-4 w-[80%] bg-base-300 rounded"></div>
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-2 flex justify-around text-sm">
        <div className="h-6 w-14 bg-base-300 rounded"></div>
        <div className="h-6 w-16 bg-base-300 rounded"></div>
        <div className="h-6 w-20 bg-base-300 rounded"></div>
        <div className="h-6 w-20 bg-base-300 rounded"></div>
      </div>

      {/* Categories */}
      <div className="px-4 py-2 flex flex-wrap gap-2 border-t">
        {Array(5)
          .fill(null)
          .map((_, idx) => (
            <div key={idx} className="h-6 w-12 bg-base-300 rounded-full"></div>
          ))}
      </div>
    </div>
  );
};

export default ConfessionDivFB;
