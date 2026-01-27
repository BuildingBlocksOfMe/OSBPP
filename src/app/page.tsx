import Sidebar from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function Home() {
  const session = await auth();

  // Fetch public plans (simulating a "Feed")
  const plans = await prisma.plan.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { owner: true } // Include owner (User) details
  });

  return (
    <div className="flex flex-col md:flex-row max-w-[1280px] mx-auto px-4 md:px-6 md:gap-6 min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Home</h1>
          <p className="text-[var(--muted)]">
            {session?.user ? `Welcome back, ${session.user.name || 'User'}!` : 'Discover open business plans.'}
          </p>
        </div>

        <div className="border border-[var(--border)] rounded-md p-6 bg-[var(--canvas-default)]">
          <h2 className="text-lg font-semibold mb-4">Discover interesting plans</h2>
          <div className="space-y-4">
            {plans.length === 0 ? (
              <div className="text-[var(--muted)] text-center py-4">
                No public plans found.
                <br />
                <Link href="/new" className="text-[var(--accent)] hover:underline">Create the first one!</Link>
              </div>
            ) : (
              plans.map((plan) => (
                <div key={plan.id} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <Link href={`/${plan.owner?.name || 'user'}/${plan.name}`} className="font-semibold hover:text-[var(--accent)] cursor-pointer">
                      {plan.owner?.name || 'user'} / {plan.name}
                    </Link>
                    <span className="text-xs border border-[var(--border)] rounded-full px-2 text-[var(--muted)]">Public</span>
                  </div>
                  <p className="text-sm text-[var(--muted)] mb-2">{plan.description || "No description provided."}</p>
                  <div className="flex gap-4 text-xs text-[var(--muted)]">
                    <span className="flex items-center gap-1">Markdown</span>
                    <span className="flex items-center gap-1">★ 0</span>
                    <span>Updated {formatDistanceToNow(plan.updatedAt, { addSuffix: true })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
