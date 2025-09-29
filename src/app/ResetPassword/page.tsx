"use client";

import { resetPassword } from "@/actions/resetpassword";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react"; 
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const result = await resetPassword(form);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="token" value={token} />

          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
