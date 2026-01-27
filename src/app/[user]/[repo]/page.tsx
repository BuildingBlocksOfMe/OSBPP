import { FileText, Folder, MoreHorizontal, History } from "lucide-react";

export default async function RepoPage({
    params,
}: {
    params: Promise<{ user: string; repo: string }>;
}) {
    const { user, repo } = await params;

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

            {/* File List */}
            <div className="border border-[var(--border)] rounded-md overflow-hidden bg-[var(--canvas-default)]">
                {/* Header */}
                <div className="bg-[var(--canvas-subtle)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] text-xs font-bold">
                            {user[0].toUpperCase()}
                        </div>
                        <span className="font-semibold hover:underline cursor-pointer">{user}</span>
                        <span className="text-[var(--muted)]">Initial commit</span>
                    </div>

                    <div className="flex items-center gap-4 text-[var(--muted)]">
                        <span className="hidden md:inline text-xs">Targeting release v1.0</span>
                        <div className="flex items-center gap-1 hover:text-[var(--accent)] cursor-pointer">
                            <History size={14} />
                            <span className="font-semibold">12 commits</span>
                        </div>
                    </div>
                </div>

                {/* Files */}
                <div className="divide-y divide-[var(--border)]">
                    <FileRow name=".github" type="folder" message="Configure workflows" time="2 days ago" />
                    <FileRow name="src" type="folder" message="Initialize project structure" time="3 days ago" />
                    <FileRow name=".gitignore" type="file" message="Initial commit" time="3 days ago" />
                    <FileRow name="README.md" type="file" message="Update documentation" time="5 hours ago" />
                    <FileRow name="business-plan.docx" type="file" message="Draft v1" time="1 week ago" />
                    <FileRow name="financials.xlsx" type="file" message="Q1 Projections" time="1 week ago" />
                </div>
            </div>

            {/* README Preview */}
            <div className="border border-[var(--border)] rounded-md mt-6 bg-[var(--canvas-default)]">
                <div className="px-4 py-2 bg-[var(--canvas-subtle)] border-b border-[var(--border)] flex items-center gap-2 sticky top-0">
                    <div className="p-1 hover:bg-[var(--border)] rounded cursor-pointer">
                        <MoreHorizontal size={16} />
                    </div>
                    <span className="font-semibold text-sm">README.md</span>
                </div>
                <div className="p-8 prose dark:prose-invert max-w-none">
                    <h1>{repo}</h1>
                    <p>Calculated projections for the upcoming fiscal year. This business plan outlines our strategy for market domination.</p>

                    <h2>Goals</h2>
                    <ul>
                        <li>Achieve $1M ARR</li>
                        <li>Expand to 3 new markets</li>
                        <li>Hire 5 key engineers</li>
                    </ul>

                    <h2>Getting Started</h2>
                    <p>Read the <code>business-plan.docx</code> for the full narrative.</p>
                </div>
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
