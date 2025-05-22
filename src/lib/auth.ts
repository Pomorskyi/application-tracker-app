import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string): { userId: number } | null {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT secret!");
  }

  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

export function generateToken(userId: number): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT secret!");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}
