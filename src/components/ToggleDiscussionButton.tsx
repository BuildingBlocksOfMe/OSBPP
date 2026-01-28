"use client";

import { useState } from "react";
import { toggleDiscussion } from "@/app/actions";
import { CheckCircle2, Circle } from "lucide-react";

export default function ToggleDiscussionButton({
    discussionId,
    isOpen,
}: {
    discussionId: string;
    isOpen: boolean;
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            await toggleDiscussion(discussionId);
        } catch (error) {
            console.error(error);
            alert("Failed to toggle discussion");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--canvas-subtle)] disabled:opacity-50"
        >
            {isOpen ? (
                <>
                    <CheckCircle2 size={16} />
                    <span>Close discussion</span>
                </>
            ) : (
                <>
                    <Circle size={16} />
                    <span>Reopen discussion</span>
                </>
            )}
        </button>
    );
}
