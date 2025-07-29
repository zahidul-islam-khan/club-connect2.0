"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const recipientOptions = [
  { value: "ALL_USERS", label: "All Users" },
  { value: "CLUB_LEADERS", label: "All Club Leaders" },
  { value: "ALL", label: "All Users & Club Leaders" },
];

export default function AdminNotificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("ALL_USERS");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (session && session.user.role !== "ADMIN") {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, recipients }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send notification");
      }
      setSuccess("Notification sent successfully!");
      setTitle("");
      setMessage("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border">
      <h1 className="text-2xl font-bold mb-4 text-center text-primary">Send Notification</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={100}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Message</label>
          <textarea
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            minLength={3}
            maxLength={1000}
            rows={5}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Recipients</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={recipients}
            onChange={e => setRecipients(e.target.value)}
          >
            {recipientOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
        {success && <div className="text-green-600 text-center mt-2">{success}</div>}
        {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      </form>
    </div>
  );
}
