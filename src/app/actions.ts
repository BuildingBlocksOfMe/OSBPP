"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

    // Basic validation for URL-safe name (simplified)
    const safeName = name.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();

    try {
        const plan = await prisma.plan.create({
            data: {
                name: safeName,
                description,
                isPublic,
                ownerId: session.user.id,
                content: "# " + name + "\n\nStart writing your business plan here.",
            },
            include: {
                owner: true
            }
        });

        // Redirect to the new plan page
        // We assume username is available on user object, or we fallback to ID if needed.
        // Ideally we should have a username field. For now let's use name or email part.
        // NOTE: In real world, User model should have a strict `username` field.
        // prisma schema for User has `name` which might be full name.

        // For now, let's redirect to home and let the user find it, or redirect to generic ID route if we hadn't defined [user]/[repo] strictly.
        // The route is [user]/[repo].
        // We need the user's "username" (e.g. github handle).
        // Auth.js GitHub provider returns this in profile, but we might need to store it.
        // The User model has `name`. Let's assume `name` is username for now or fallback.
    } catch (error) {
        console.error("Failed to create plan:", error);
        throw new Error("Failed to create plan");
    }

    revalidatePath("/");
    redirect("/");
}
