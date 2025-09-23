"use client";

import { requestPasswordReset } from "@/actions/forgotpassword";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const result = await requestPasswordReset(form)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        {/* Lock Icon */}
        <div className="text-4xl text-green-600 mb-4">
          <i className="fas fa-lock"></i>
        </div>

        <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
        <p className="text-gray-600 mb-6">You can reset your password here</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            
            name = "email"
            
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
