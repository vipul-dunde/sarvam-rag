import { NextRequest, NextResponse } from "next/server";

async function getHandler(request: NextRequest) {
    try {
        return NextResponse.json({ status: "ok" });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

export const GET = getHandler;
