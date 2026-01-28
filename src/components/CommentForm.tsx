"use client";

import { useState } from "react";
import { createComment } from "@/app/actions";

export default function CommentForm({
    discussionId,
    userName,
}: {
    discussionId: string;
    userName: string;
}) {
    const [body, setBody] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await createComment(discussionId, body);
            setBody("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border border-[var(--border)] rounded-md">
            <div className="p-4 bg-[var(--canvas-subtle)] border-b border-[var(--border)]">
                <span className="font-semibold">Comment as {userName}</span>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write a comment (Markdown supported)"
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--canvas-default)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-mono text-sm mb-3"
                />
                <p className="text-xs text-[var(--muted)] mb-3">Markdown is supported</p>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm mb-3">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || !body}
                    className="px-4 py-2 bg-[var(--success)] text-white rounded-md hover:bg-[var(--success)]/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Posting..." : "Comment"}
                </button>
            </form>
        </div>
    );
}
