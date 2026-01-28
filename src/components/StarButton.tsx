"use client";

import { Star } from "lucide-react";
import { toggleStar } from "@/app/star-action";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StarButton({ planId, initialCount, initialIsStarred }: { planId: string, initialCount: number, initialIsStarred: boolean }) {
    const [count, setCount] = useState(initialCount);
    const [isStarred, setIsStarred] = useState(initialIsStarred);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        if (isLoading) return;

        // Optimistic update
        const newIsStarred = !isStarred;
        setIsStarred(newIsStarred);
        setCount(prev => newIsStarred ? prev + 1 : prev - 1);
        setIsLoading(true);

        try {
            await toggleStar(planId);
            router.refresh(); // Sync with server
        } catch (error) {
            // Revert on error
            setIsStarred(!newIsStarred);
            setCount(prev => !newIsStarred ? prev + 1 : prev - 1);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center rounded-md border border-[var(--border)] bg-[var(--canvas-default)] overflow-hidden">
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`flex items-center gap-1 px-3 py-1 border-r border-[var(--border)] transition-colors ${isStarred
                        ? "bg-[var(--canvas-subtle)]"
                        : "hover:bg-[var(--canvas-subtle)]"
                    }`}
            >
                <Star size={14} className={isStarred ? "fill-yellow-500 text-yellow-500" : ""} />
                <span className="hidden md:inline">{isStarred ? "Unstar" : "Star"}</span>
            </button>
            <button className="px-2 py-1 hover:bg-[var(--canvas-subtle)] font-semibold cursor-default">
                {count}
            </button>
        </div>
    );
}
