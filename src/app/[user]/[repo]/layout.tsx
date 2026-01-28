import RepoHeader from "@/components/RepoHeader";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

export default async function RepoLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ user: string; repo: string }>;
}) {
    const { user: username, repo: planName } = await params;
    const session = await auth();

    // Fetch Plan to get ID and Star stats
    const plan = await prisma.plan.findFirst({
        where: {
            name: planName,
            owner: {
                name: username
            }
        },
        include: {
            _count: {
                select: {
                    stars: true,
                    forks: true,
                    discussions: {
                        where: {
                            isOpen: true
                        }
                    }
                }
            },
            stars: {
                where: {
                    userId: session?.user?.id || ""
                },
                select: { id: true }
            },
            forkedFrom: {
                include: {
                    owner: true
                }
            }
        }
    });

    if (!plan) {
        return notFound();
    }

    const starCount = plan._count.stars;
    const isStarred = plan.stars.length > 0;
    const forkCount = plan._count.forks;
    const forkedFrom = plan.forkedFrom ? { user: plan.forkedFrom.owner.name || 'unknown', repo: plan.forkedFrom.name } : null;
    const discussionCount = plan._count.discussions;

    return (
        <div className="flex flex-col min-h-screen bg-[var(--canvas-default)]">
            <RepoHeader
                user={username}
                repo={planName}
                planId={plan.id}
                starCount={starCount}
                isStarred={isStarred}
                forkCount={forkCount}
                forkedFrom={forkedFrom}
                discussionCount={discussionCount}
            />
            <div className="flex-1 container mx-auto px-4 md:px-6 max-w-[1280px] py-6">
                {children}
            </div>
        </div>
    );
}
