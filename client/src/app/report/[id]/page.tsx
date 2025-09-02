"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/servies/axios";
import { useRouter } from "next/navigation";
import { errorToast } from "@/servies/toast";

export default function ReportPage() {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { id } = useParams();
  const router = useRouter();

  const handleReport = async () => {
    if (!reason.trim()) {
      setMessage("Reason is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axiosInstance.post(
        `/report/${id}`,
        {
          reason,
        },
        { withCredentials: true }
      );

      setMessage(res.data.message || "Reported successfully");
      setReason("");
      router.push("/");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong, try again.");
      errorToast(error.response?.data?.message || "Something went wrong, try again.");
    } finally {
      setMessage("You've Already Reported This Confession");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div className="card w-full max-w-lg bg-base-200 shadow-2xl">
        <div className="card-body space-y-4">
          {/* Header */}
          <h2 className="card-title text-xl font-semibold text-center">🚩 Report Confession</h2>
          <p className="text-sm text-center text-base-content/70">
            Please provide a reason for reporting this confession.
          </p>

          {/* Textarea */}
          <textarea
            className="textarea textarea-bordered w-full min-h-[120px] resize-none"
            placeholder="Enter your reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          {/* Button */}
          <button className="btn btn-error text-white w-full mt-2" onClick={handleReport} disabled={loading}>
            {loading ? "Reporting..." : "Report"}
          </button>

          {/* Message */}
          {message && <div className="text-md text-center py-2">{message}</div>}
        </div>
      </div>
    </div>
  );
}
