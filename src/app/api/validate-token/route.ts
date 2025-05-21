import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { valid: false, error: "Missing token" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { valid: false, error: "Invalid token" },
      { status: 401 }
    );
  }

  return NextResponse.json({ valid: true, userId: payload.userId });
}
