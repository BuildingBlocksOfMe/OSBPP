"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { updatePlan } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function PlanEditor({ initialContent, planId, isOwner }: { initialContent: string, planId: string, isOwner: boolean }) {
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePlan(planId, content);
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isEditing) {
        return (
            <div className="relative group">
                {isOwner && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute right-0 top-0 bg-[var(--canvas-subtle)] border border-[var(--border)] rounded px-2 py-1 text-xs font-semibold hover:bg-[var(--border)] transition-colors opacity-0 group-hover:opacity-100"
                    >
                        Edit content
                    </button>
                )}
                <div className="prose dark:prose-invert max-w-none p-4">
                    <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-[var(--canvas-subtle)] border-b border-[var(--border)] px-2 py-1">
                <span className="text-sm font-semibold px-2 py-1 border-b-2 border-[var(--accent)]">Write</span>
                {/* Preview functionality could be added here as a tab switch */}
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[500px] p-4 bg-[var(--canvas-default)] text-[var(--foreground)] font-mono text-sm outline-none resize-y border-b border-[var(--border)]"
            />

            <div className="flex justify-end gap-2 p-2 bg-[var(--canvas-subtle)] rounded-b-md">
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setContent(initialContent);
                    }}
                    className="px-3 py-1 text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded"
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="bg-[#238636] text-white px-3 py-1 text-sm font-semibold rounded hover:bg-[#2ea043] disabled:opacity-50"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Commit changes"}
                </button>
            </div>
        </div>
    );
}
