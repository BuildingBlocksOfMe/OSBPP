"use client";

import { GitFork } from "lucide-react";
import { forkPlan } from "@/app/actions"; // We need to export this from actions.ts
import { useState } from "react";

export default function ForkButton({ planId, forkCount }: { planId: string, forkCount: number }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleFork = async () => {
        setIsLoading(true);
        try {
            await forkPlan(planId);
        } catch (error) {
            console.error(error);
            alert("Failed to fork plan");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center rounded-md border border-[var(--border)] bg-[var(--canvas-default)] overflow-hidden">
            <button
                onClick={handleFork}
                disabled={isLoading}
                className="flex items-center gap-1 px-3 py-1 hover:bg-[var(--canvas-subtle)] border-r border-[var(--border)] disabled:opacity-50"
            >
                <GitFork size={14} />
                <span className="hidden md:inline">{isLoading ? "Forking..." : "Fork"}</span>
            </button>
            <button className="px-2 py-1 hover:bg-[var(--canvas-subtle)] font-semibold cursor-default">
                {forkCount}
            </button>
        </div>
    );
}
