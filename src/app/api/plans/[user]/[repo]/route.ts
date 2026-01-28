import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ user: string; repo: string }> }
) {
    const { user: username, repo: planName } = await params;

    const plan = await prisma.plan.findFirst({
        where: {
            name: planName,
            owner: {
                name: username,
            },
        },
        select: {
            id: true,
            name: true,
        },
    });

    if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(plan);
}
