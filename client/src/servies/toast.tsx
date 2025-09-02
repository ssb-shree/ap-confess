import toast from "react-hot-toast";

export const errorToast = (msg: string) => {
  toast.custom((t) => (
    <div
      className={`alert alert-error shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transition-all duration-300 flex items-center justify-between gap-2`}
    >
      <span className="capitalize text-sm sm:text-base">❌ {msg}</span>
    </div>
  ));
};
