"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleStar(planId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const userId = session.user.id;

    try {
        const existingStar = await prisma.star.findUnique({
            where: {
                userId_planId: {
                    userId,
                    planId,
                },
            },
        });

        if (existingStar) {
            await prisma.star.delete({
                where: {
                    id: existingStar.id,
                },
            });
        } else {
            await prisma.star.create({
                data: {
                    userId,
                    planId,
                },
            });
        }

        // We need to revalidate. Since we don't contextually know the URL here easily
        // without passing it, simplistic revalidation is tricky.
        // Ideally we revalidate the path where this is called.
        // For now, let's look up the plan to get owner/name for revalidation path.
        const plan = await prisma.plan.findUnique({
            where: { id: planId },
            include: { owner: true }
        });

        if (plan && plan.owner) {
            revalidatePath(`/${plan.owner.name}/${plan.name}`);
            revalidatePath(`/${plan.owner.name}`); // Revalidate profile
        }

    } catch (error) {
        console.error("Failed to toggle star:", error);
        throw new Error("Failed to toggle star");
    }
}
