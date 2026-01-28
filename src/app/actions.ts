"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function forkPlan(planId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const userId = session.user.id;

    // 1. Fetch original plan
    const originalPlan = await prisma.plan.findUnique({
        where: { id: planId },
        include: { owner: true }
    });

    if (!originalPlan) {
        throw new Error("Plan not found");
    }

    // 2. Check if user already owns a plan with this name
    const existingPlan = await prisma.plan.findFirst({
        where: {
            ownerId: userId,
            name: originalPlan.name
        }
    });

    if (existingPlan) {
        if (session?.user?.name) {
            revalidatePath(`/${session.user.name}/${existingPlan.name}`);
            redirect(`/${session.user.name}/${existingPlan.name}`);
        }
        return;
    }

    // 3. Create the fork
    try {
        const newPlan = await prisma.plan.create({
            data: {
                name: originalPlan.name,
                description: originalPlan.description,
                content: originalPlan.content,
                isPublic: originalPlan.isPublic,
                ownerId: userId,
                forkedFromId: originalPlan.id
            },
            include: { owner: true }
        });

        if (newPlan.owner.name) {
            revalidatePath(`/${newPlan.owner.name}/${newPlan.name}`);
            redirect(`/${newPlan.owner.name}/${newPlan.name}`);
        }

    } catch (error) {
        console.error("Failed to fork plan:", error);
        throw new Error("Failed to fork plan");
    }
}

export async function createPlan(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const isPublic = formData.get("visibility") === "public";

    if (!name) {
        throw new Error("Name is required");
    }

    const safeName = name.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();

    try {
        await prisma.plan.create({
            data: {
                name: safeName,
                description,
                isPublic,
                ownerId: session.user.id,
                content: "# " + name + "\n\nStart writing your business plan here.",
            },
        });
    } catch (error) {
        console.error("Failed to create plan:", error);
        throw new Error("Failed to create plan");
    }

    revalidatePath("/");
    redirect("/");
}

export async function updatePlan(planId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const plan = await prisma.plan.findUnique({
        where: { id: planId },
    });

    if (!plan) {
        throw new Error("Plan not found");
    }

    if (plan.ownerId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    await prisma.plan.update({
        where: { id: planId },
        data: { content },
    });

    revalidatePath(`/${session.user.name}/${plan.name}`);
}

// ============ Discussion Actions ============

export async function createDiscussion(planId: string, title: string, body: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    if (!title || !body) {
        throw new Error("Title and body are required");
    }

    const discussion = await prisma.discussion.create({
        data: {
            planId,
            authorId: session.user.id,
            title,
            body,
        },
        include: {
            plan: {
                include: {
                    owner: true
                }
            }
        }
    });

    revalidatePath(`/${discussion.plan.owner.name}/${discussion.plan.name}/discussions`);
    redirect(`/${discussion.plan.owner.name}/${discussion.plan.name}/discussions/${discussion.id}`);
}

export async function toggleDiscussion(discussionId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const discussion = await prisma.discussion.findUnique({
        where: { id: discussionId },
        include: {
            plan: {
                include: {
                    owner: true
                }
            }
        }
    });

    if (!discussion) {
        throw new Error("Discussion not found");
    }

    // Only plan owner or discussion author can toggle
    if (discussion.plan.ownerId !== session.user.id && discussion.authorId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    await prisma.discussion.update({
        where: { id: discussionId },
        data: { isOpen: !discussion.isOpen },
    });

    revalidatePath(`/${discussion.plan.owner.name}/${discussion.plan.name}/discussions/${discussionId}`);
}

export async function createComment(discussionId: string, body: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    if (!body) {
        throw new Error("Comment body is required");
    }

    const discussion = await prisma.discussion.findUnique({
        where: { id: discussionId },
        include: {
            plan: {
                include: {
                    owner: true
                }
            }
        }
    });

    if (!discussion) {
        throw new Error("Discussion not found");
    }

    await prisma.comment.create({
        data: {
            discussionId,
            authorId: session.user.id,
            body,
        },
    });

    revalidatePath(`/${discussion.plan.owner.name}/${discussion.plan.name}/discussions/${discussionId}`);
}

export async function updateComment(commentId: string, body: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    if (!body) {
        throw new Error("Comment body is required");
    }

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
    });

    if (!comment) {
        throw new Error("Comment not found");
    }

    if (comment.authorId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    await prisma.comment.update({
        where: { id: commentId },
        data: { body },
    });

    const discussion = await prisma.discussion.findUnique({
        where: { id: comment.discussionId },
        include: {
            plan: {
                include: {
                    owner: true
                }
            }
        }
    });

    if (discussion) {
        revalidatePath(`/${discussion.plan.owner.name}/${discussion.plan.name}/discussions/${comment.discussionId}`);
    }
}

export async function deleteComment(commentId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
            discussion: {
                include: {
                    plan: {
                        include: {
                            owner: true
                        }
                    }
                }
            }
        }
    });

    if (!comment) {
        throw new Error("Comment not found");
    }

    if (comment.authorId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    await prisma.comment.delete({
        where: { id: commentId },
    });

    revalidatePath(`/${comment.discussion.plan.owner.name}/${comment.discussion.plan.name}/discussions/${comment.discussionId}`);
}
