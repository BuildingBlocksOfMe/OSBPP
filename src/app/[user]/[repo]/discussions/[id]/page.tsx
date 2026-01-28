import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";
import CommentForm from "@/components/CommentForm";
import ToggleDiscussionButton from "@/components/ToggleDiscussionButton";

export default async function DiscussionPage({
    params,
}: {
    params: Promise<{ user: string; repo: string; id: string }>;
}) {
    const { user: username, repo: planName, id: discussionId } = await params;
    const session = await auth();

    const discussion = await prisma.discussion.findUnique({
        where: { id: discussionId },
        include: {
            author: true,
            plan: {
                include: {
                    owner: true,
                },
            },
            comments: {
                include: {
                    author: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!discussion) {
        return notFound();
    }

    // Check if user can toggle discussion
    const canToggle =
        session?.user?.id &&
        (discussion.plan.ownerId === session.user.id ||
            discussion.authorId === session.user.id);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Discussion Header */}
            <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                    <h1 className="text-3xl font-bold flex-1">{discussion.title}</h1>
                    {canToggle && (
                        <ToggleDiscussionButton
                            discussionId={discussion.id}
                            isOpen={discussion.isOpen}
                        />
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    {discussion.isOpen ? (
                        <span className="flex items-center gap-1 text-[var(--success)]">
                            <Circle size={16} />
                            Open
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-[var(--done)]">
                            <CheckCircle2 size={16} />
                            Closed
                        </span>
                    )}
                    <span>·</span>
                    <span>
                        {discussion.author.name || "Unknown"} started this discussion{" "}
                        {formatDistanceToNow(new Date(discussion.createdAt), {
                            addSuffix: true,
                        })}
                    </span>
                    <span>·</span>
                    <span>{discussion.comments.length} comments</span>
                </div>
            </div>

            {/* Discussion Body */}
            <div className="border border-[var(--border)] rounded-md mb-6">
                <div className="p-4 bg-[var(--canvas-subtle)] border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{discussion.author.name || "Unknown"}</span>
                        <span className="text-sm text-[var(--muted)]">
                            {formatDistanceToNow(new Date(discussion.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                </div>
                <div className="p-4">
                    <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {discussion.body}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            {/* Comments */}
            {discussion.comments.length > 0 && (
                <div className="space-y-4 mb-6">
                    {discussion.comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="border border-[var(--border)] rounded-md"
                        >
                            <div className="p-4 bg-[var(--canvas-subtle)] border-b border-[var(--border)]">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">
                                        {comment.author.name || "Unknown"}
                                    </span>
                                    <span className="text-sm text-[var(--muted)]">
                                        {formatDistanceToNow(new Date(comment.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {comment.body}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Comment Form */}
            {session?.user && (
                <CommentForm discussionId={discussion.id} userName={session.user.name || "You"} />
            )}
        </div>
    );
}
