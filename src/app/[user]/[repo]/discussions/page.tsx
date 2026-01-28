import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquare, CheckCircle2, Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function DiscussionsPage({
    params,
}: {
    params: Promise<{ user: string; repo: string }>;
}) {
    const { user: username, repo: planName } = await params;

    const plan = await prisma.plan.findFirst({
        where: {
            name: planName,
            owner: {
                name: username,
            },
        },
        include: {
            discussions: {
                include: {
                    author: true,
                    _count: {
                        select: { comments: true },
                    },
                },
                orderBy: {
                    updatedAt: "desc",
                },
            },
        },
    });

    if (!plan) {
        return notFound();
    }

    const openDiscussions = plan.discussions.filter((d) => d.isOpen);
    const closedDiscussions = plan.discussions.filter((d) => !d.isOpen);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Discussions</h1>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <span>{openDiscussions.length} Open</span>
                        <span>·</span>
                        <span>{closedDiscussions.length} Closed</span>
                    </div>
                </div>
                <Link
                    href={`/${username}/${planName}/discussions/new`}
                    className="px-4 py-2 bg-[var(--success)] text-white rounded-md hover:bg-[var(--success)]/90 font-semibold"
                >
                    New discussion
                </Link>
            </div>

            {/* Discussion List */}
            <div className="border border-[var(--border)] rounded-md overflow-hidden">
                {plan.discussions.length === 0 ? (
                    <div className="p-8 text-center text-[var(--muted)]">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">No discussions yet</p>
                        <p className="text-sm">Start a discussion to share ideas and get feedback</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--border)]">
                        {plan.discussions.map((discussion) => (
                            <Link
                                key={discussion.id}
                                href={`/${username}/${planName}/discussions/${discussion.id}`}
                                className="block p-4 hover:bg-[var(--canvas-subtle)] transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Status Icon */}
                                    <div className="mt-1">
                                        {discussion.isOpen ? (
                                            <Circle size={16} className="text-[var(--success)]" />
                                        ) : (
                                            <CheckCircle2 size={16} className="text-[var(--done)]" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)] mb-1">
                                            {discussion.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                                            <span>
                                                {discussion.author.name || "Unknown"} opened{" "}
                                                {formatDistanceToNow(new Date(discussion.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </span>
                                            {discussion._count.comments > 0 && (
                                                <>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageSquare size={14} />
                                                        {discussion._count.comments}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
