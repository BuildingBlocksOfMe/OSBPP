"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createDiscussion } from "@/app/actions";

export default function NewDiscussionPage() {
    const params = useParams();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // Fetch plan ID first
            const response = await fetch(
                `/api/plans/${params.user}/${params.repo}`
            );
            if (!response.ok) throw new Error("Plan not found");
            const plan = await response.json();

            await createDiscussion(plan.id, title, body);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create discussion");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">New discussion</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold mb-2">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Discussion title"
                        required
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--canvas-default)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                </div>

                {/* Body */}
                <div>
                    <label htmlFor="body" className="block text-sm font-semibold mb-2">
                        Description
                    </label>
                    <textarea
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Add a description (Markdown supported)"
                        required
                        rows={10}
                        className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--canvas-default)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-mono text-sm"
                    />
                    <p className="text-xs text-[var(--muted)] mt-1">
                        Markdown is supported
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting || !title || !body}
                        className="px-4 py-2 bg-[var(--success)] text-white rounded-md hover:bg-[var(--success)]/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Creating..." : "Create discussion"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--canvas-subtle)]"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
