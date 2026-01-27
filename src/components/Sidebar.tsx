import Link from "next/link";
import { BookMarked, Lock } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="w-full md:w-[296px] md:shrink-0 py-6 md:pr-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-2 md:px-0">
                    <h2 className="font-semibold text-sm">Top Repositories</h2>
                    <Link href="/new" className="bg-[#238636] text-white text-xs font-semibold py-1 px-3 rounded-md flex items-center gap-1 hover:bg-[#2ea043] transition-colors">
                        New
                    </Link>
                </div>

                <div className="flex flex-col gap-1 mt-2">
                    <input
                        type="text"
                        placeholder="Find a repository..."
                        className="w-full bg-[var(--canvas-subtle)] border border-[var(--border)] rounded-md py-1 px-2 text-sm placeholder-[var(--muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none mb-2"
                    />

                    <ul className="flex flex-col">
                        {[1, 2, 3].map((i) => (
                            <li key={i}>
                                <Link href={`/user/repo-${i}`} className="flex items-center gap-2 py-2 hover:bg-[var(--canvas-subtle)] -mx-2 px-2 rounded-md">
                                    <div className="text-[var(--muted)]">
                                        <BookMarked size={16} />
                                    </div>
                                    <span className="font-semibold text-sm truncate">user/repo-{i}</span>
                                    <span className="ml-auto text-[var(--muted)]">
                                        <Lock size={12} />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <button className="text-[var(--muted)] text-xs text-left mt-2 hover:text-[var(--accent)]">
                        Show more
                    </button>
                </div>
            </div>

            <div className="border-t border-[var(--border)] md:hidden"></div>

            <div className="px-2 md:px-0">
                <h2 className="font-semibold text-sm mb-2">Recent activity</h2>
                <div className="p-4 border border-[var(--border)] rounded-md border-dashed text-center text-sm text-[var(--muted)]">
                    When you have activity, it will show up here.
                </div>
            </div>
        </aside>
    );
}
