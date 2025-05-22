  import { prisma } from "@/lib/prisma";
  import { NextResponse } from "next/server";
  import bcrypt from "bcrypt";
  import { generateToken } from "@/lib/auth";

  export async function POST(req: Request) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken(user.id);

    return NextResponse.json({ success: true, token });
  }
