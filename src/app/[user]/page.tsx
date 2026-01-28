import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookMarked, MapPin, Link as LinkIcon, Mail, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ user: string }>;
}) {
    const { user: username } = await params;

    // Find User
    const user = await prisma.user.findFirst({
        where: { name: username },
        include: {
            plans: {
                where: { isPublic: true },
                orderBy: { updatedAt: 'desc' }
            }
        }
    });

    if (!user) {
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 md:px-6 max-w-[1280px] py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar: User Info */}
                <div className="md:w-[296px] flex flex-col gap-4">
                    <div className="relative group">
                        <div className="w-full aspect-square rounded-full border border-[var(--border)] overflow-hidden bg-[var(--canvas-subtle)] flex items-center justify-center text-4xl text-[var(--muted)]">
                            {user.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                            ) : (
                                <span>{user.name?.[0].toUpperCase()}</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold leading-tight">{user.name}</h1>
                        <p className="text-[var(--muted)] text-xl font-light">{username}</p>
                    </div>

                    <button className="w-full bg-[var(--canvas-subtle)] border border-[var(--border)] rounded-md py-1.5 font-semibold text-sm hover:bg-[var(--border)] transition-colors">
                        Follow
                    </button>

                    <div className="flex flex-col gap-2 text-sm text-[var(--foreground)]">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-[var(--muted)]" />
                            <span className="font-bold">0</span> <span className="text-[var(--muted)]">followers</span>
                            <span>·</span>
                            <span className="font-bold">0</span> <span className="text-[var(--muted)]">following</span>
                        </div>
                        {/* Mocked data for now */}
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-[var(--muted)]" />
                            <span>Tokyo, Japan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-[var(--muted)]" />
                            <span className="truncate">{user.email || "hidden"}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content: Repositories */}
                <div className="flex-1">
                    {/* Tabs */}
                    <div className="border-b border-[var(--border)] mb-4 overflow-x-auto">
                        <nav className="flex gap-4">
                            <button className="px-4 py-2 border-b-2 border-[var(--accent)] font-semibold text-sm flex items-center gap-2">
                                <BookMarked size={16} />
                                Repositories
                                <span className="bg-[var(--muted)]/20 text-xs rounded-full px-2 py-0.5">{user.plans.length}</span>
                            </button>
                            <button className="px-4 py-2 border-b-2 border-transparent text-[var(--muted)] hover:border-[var(--border)] text-sm flex items-center gap-2">
                                Projects
                            </button>
                            <button className="px-4 py-2 border-b-2 border-transparent text-[var(--muted)] hover:border-[var(--border)] text-sm flex items-center gap-2">
                                Stars
                            </button>
                        </nav>
                    </div>

                    {/* Search */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Find a repository..."
                            className="flex-1 bg-[var(--canvas-default)] border border-[var(--border)] rounded-md px-3 py-1.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                        />
                        <div className="flex gap-1">
                            <button className="hidden md:block bg-[var(--canvas-subtle)] border border-[var(--border)] rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-[var(--border)]">Type</button>
                            <button className="hidden md:block bg-[var(--canvas-subtle)] border border-[var(--border)] rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-[var(--border)]">Language</button>
                            <button className="hidden md:block bg-[var(--canvas-subtle)] border border-[var(--border)] rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-[var(--border)]">Sort</button>
                            <Link href="/new" className="bg-[#238636] text-white border border-[#238636] rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-[#2ea043] flex items-center gap-2">
                                <BookMarked size={16} /> New
                            </Link>
                        </div>
                    </div>

                    {/* Repo List */}
                    <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                        {user.plans.map(plan => (
                            <div key={plan.id} className="py-6 flex items-start justify-between">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-xl font-semibold">
                                        <Link href={`/${username}/${plan.name}`} className="text-[var(--accent)] hover:underline">
                                            {plan.name}
                                        </Link>
                                        <span className="text-xs border border-[var(--border)] rounded-full px-2 py-0.5 text-[var(--muted)] font-medium">Public</span>
                                    </div>
                                    <p className="text-[var(--muted)] text-sm max-w-lg">
                                        {plan.description || "No description provided."}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-[var(--muted)] mt-2">
                                        <span className="flex items-center gap-1">Markdown</span>
                                        <span className="hover:text-[var(--accent)] cursor-pointer">Updated {formatDistanceToNow(plan.updatedAt, { addSuffix: true })}</span>
                                    </div>
                                </div>

                                <button className="hidden md:flex bg-[var(--canvas-subtle)] border border-[var(--border)] rounded-md px-3 py-1 text-xs font-semibold hover:bg-[var(--border)] gap-1 items-center">
                                    <span className={cn("text-[var(--muted)]", "text-yellow-500")}>★</span> Star
                                </button>
                            </div>
                        ))}

                        {user.plans.length === 0 && (
                            <div className="py-8 text-center text-[var(--muted)]">
                                {username} doesn’t have any public repositories yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
