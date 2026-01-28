import Link from "next/link";
import { Star, GitFork, Eye, BookOpen, CircleDot, PlayCircle, BarChart2, Shield, MessageSquare } from "lucide-react";
import StarButton from "./StarButton";
import ForkButton from "./ForkButton";

export default function RepoHeader({ user, repo, planId, starCount, isStarred, forkCount, forkedFrom, discussionCount }: { user: string; repo: string, planId: string, starCount: number, isStarred: boolean, forkCount: number, forkedFrom?: { user: string, repo: string } | null, discussionCount?: number }) {
    return (
        <div className="bg-[var(--canvas-subtle)] border-b border-[var(--border)] pt-4">
            <div className="container mx-auto px-4 md:px-6 max-w-[1280px]">

                {/* Top Row: Breadcrumbs & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-lg md:text-xl">
                            <BookOpen size={18} className="text-[var(--muted)]" />
                            <span className="text-[var(--accent)] hover:underline cursor-pointer">{user}</span>
                            <span className="text-[var(--muted)]">/</span>
                            <span className="font-bold text-[var(--accent)] hover:underline cursor-pointer">{repo}</span>
                            <span className="text-xs border border-[var(--border)] rounded-full px-2 py-0.5 text-[var(--muted)] ml-2">Public</span>
                        </div>
                        {forkedFrom && (
                            <div className="text-xs text-[var(--muted)] mt-1 flex items-center gap-1">
                                <span>forked from</span>
                                <Link href={`/${forkedFrom.user}/${forkedFrom.repo}`} className="font-semibold hover:text-[var(--accent)] hover:underline">
                                    {forkedFrom.user}/{forkedFrom.repo}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs md:text-sm">
                        <div className="flex items-center rounded-md border border-[var(--border)] bg-[var(--canvas-default)] overflow-hidden">
                            <button className="flex items-center gap-1 px-3 py-1 hover:bg-[var(--canvas-subtle)] border-r border-[var(--border)]">
                                <Eye size={14} />
                                <span className="hidden md:inline">Watch</span>
                            </button>
                            <button className="px-2 py-1 hover:bg-[var(--canvas-subtle)] bg-white text-[var(--foreground)] font-semibold">
                                2
                            </button>
                        </div>

                        <ForkButton planId={planId} forkCount={forkCount} />

                        <StarButton planId={planId} initialCount={starCount} initialIsStarred={isStarred} />
                    </div>
                </div>


                {/* Tabs */}
                <nav className="flex items-center gap-1 overflow-x-auto">
                    <Tab active icon={<code className="w-4 h-4 mr-2" />} label="Code" count={null} />
                    <Tab icon={<CircleDot size={16} className="mr-2" />} label="Issues" count={2} />
                    <Tab icon={<MessageSquare size={16} className="mr-2" />} label="Discussions" count={discussionCount || 0} href={`/${user}/${repo}/discussions`} />
                    <Tab icon={<GitFork size={16} className="mr-2" />} label="Pull requests" count={0} />
                    <Tab icon={<PlayCircle size={16} className="mr-2" />} label="Actions" count={null} />
                    <Tab icon={<BarChart2 size={16} className="mr-2" />} label="Projects" count={null} />
                    <Tab icon={<Shield size={16} className="mr-2" />} label="Security" count={null} />
                </nav>
            </div>
        </div>
    );
}

function Tab({ active = false, icon, label, count, href }: { active?: boolean; icon: React.ReactNode; label: string; count: number | null; href?: string }) {
    const content = (
        <>
            {icon}
            {label}
            {count !== null && (
                <span className="ml-2 bg-[var(--muted)]/20 text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {count}
                </span>
            )}
        </>
    );

    const className = `flex items-center px-4 py-2 border-b-2 text-sm whitespace-nowrap ${active ? "border-[var(--accent)] font-semibold text-[var(--foreground)]" : "border-transparent text-[var(--muted)] hover:border-[var(--border)]"}`;

    if (href) {
        return (
            <Link href={href} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <button className={className}>
            {content}
        </button>
    );
}


