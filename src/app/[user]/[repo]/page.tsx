import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { FileText, Folder, MoreHorizontal, History } from "lucide-react";
import PlanEditor from "@/components/PlanEditor"; // We'll create this next
import { formatDistanceToNow } from "date-fns";
import RepoHeader from "@/components/RepoHeader";

export default async function RepoPage({
    params,
}: {
    params: Promise<{ user: string; repo: string }>;
}) {
    const { user: username, repo: planName } = await params;
    const session = await auth();

    // 1. Find User by Name
    // Note: We are assuming 'name' is unique-ish for now. Real world needs 'username' field.
    const owner = await prisma.user.findFirst({
        where: { name: username },
    });

    if (!owner) {
        return notFound();
    }

    // 2. Find Plan
    const plan = await prisma.plan.findFirst({
        where: {
            name: planName,
            ownerId: owner.id
        },
        include: {
            _count: {
                select: { stars: true }
            }
        }
    });

    if (!plan) {
        return notFound();
    }

    const isOwner = session?.user?.id === plan.ownerId;

    return (
        <div className="flex flex-col gap-4">
            {/* Repo Actions Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="bg-[var(--canvas-subtle)] border border-[var(--border)] rounded-md px-3 py-1 text-sm font-semibold flex items-center gap-2 hover:bg-[var(--border)] transition-colors">
                        <span className="text-[var(--muted)]">main</span>
                        <span className="text-[0.6rem]">▼</span>
                    </button>
                    <div className="flex items-center gap-1 text-sm text-[var(--muted)] ml-2">
                        <span className="font-bold text-[var(--foreground)]">1</span> branch
                        <span className="mx-1">·</span>
                        <span className="font-bold text-[var(--foreground)]">0</span> tags
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="hidden md:flex bg-[var(--canvas-subtle)] border border-[var(--border)] rounded-md px-3 py-1 text-sm font-semibold hover:bg-[var(--border)] transition-colors">
                        Go to file
                    </button>
                    <button className="bg-[var(--accent)] text-white border border-[var(--accent)] rounded-md px-3 py-1 text-sm font-semibold hover:bg-[var(--accent)]/90 transition-colors">
                        Code ▼
                    </button>
                </div>
            </div>

            {/* File List (Mocked for now, except README/Content) */}
            <div className="border border-[var(--border)] rounded-md overflow-hidden bg-[var(--canvas-default)]">
                {/* Header */}
                <div className="bg-[var(--canvas-subtle)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] text-xs font-bold">
                            {username[0].toUpperCase()}
                        </div>
                        <span className="font-semibold hover:underline cursor-pointer">{username}</span>
                        <span className="text-[var(--muted)]">Updated {formatDistanceToNow(plan.updatedAt, { addSuffix: true })}</span>
                    </div>

                    <div className="flex items-center gap-4 text-[var(--muted)]">
                        <span className="hidden md:inline text-xs">Latest commit {plan.id.substring(0, 7)}</span>
                        <div className="flex items-center gap-1 hover:text-[var(--accent)] cursor-pointer">
                            <History size={14} />
                            <span className="font-semibold">{plan.createdAt === plan.updatedAt ? "1 commit" : "2+ commits"}</span>
                        </div>
                    </div>
                </div>

                {/* Files */}
                <div className="divide-y divide-[var(--border)]">
                    {/* We treat the plan content as "README.md" */}
                    <FileRow name="README.md" type="file" message="Update business plan content" time={formatDistanceToNow(plan.updatedAt)} />
                    <FileRow name=".gitignore" type="file" message="Initial commit" time={formatDistanceToNow(plan.createdAt)} />
                </div>
            </div>

            {/* Plan Content Viewer/Editor */}
            <div className="border border-[var(--border)] rounded-md mt-6 bg-[var(--canvas-default)]">
                <div className="px-4 py-2 bg-[var(--canvas-subtle)] border-b border-[var(--border)] flex items-center gap-2 sticky top-0">
                    <div className="p-1 hover:bg-[var(--border)] rounded cursor-pointer">
                        <MoreHorizontal size={16} />
                    </div>
                    <span className="font-semibold text-sm">README.md</span>
                </div>

                <PlanEditor
                    initialContent={plan.content || ""}
                    planId={plan.id}
                    isOwner={isOwner}
                />
            </div>
        </div>
    );
}

function FileRow({ name, type, message, time }: { name: string; type: "file" | "folder"; message: string; time: string }) {
    return (
        <div className="flex items-center px-4 py-2 hover:bg-[var(--canvas-subtle)] text-sm group">
            <div className="w-8 flex-shrink-0 text-[var(--muted)]">
                {type === "folder" ? <Folder size={16} className="fill-[var(--accent)]/40 text-[var(--accent)]" /> : <FileText size={16} />}
            </div>
            <div className="flex-1 min-w-0 mr-4">
                <span className="font-semibold hover:text-[var(--accent)] hover:underline cursor-pointer truncate block">{name}</span>
            </div>
            <div className="hidden md:block flex-1 text-[var(--muted)] truncate mr-4">
                <span className="group-hover:text-[var(--accent)] cursor-pointer hover:underline">{message}</span>
            </div>
            <div className="text-[var(--muted)] whitespace-nowrap text-right w-24">
                {time}
            </div>
        </div>
    )
}
