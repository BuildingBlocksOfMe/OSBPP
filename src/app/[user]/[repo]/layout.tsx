import RepoHeader from "@/components/RepoHeader";

export default async function RepoLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ user: string; repo: string }>;
}) {
    const { user, repo } = await params;

    return (
        <div className="flex flex-col min-h-screen bg-[var(--canvas-default)]">
            <RepoHeader user={user} repo={repo} />
            <div className="flex-1 container mx-auto px-4 md:px-6 max-w-[1280px] py-6">
                {children}
            </div>
        </div>
    );
}
