import { verifyToken } from "../auth";

export function getUserFromRequest(
  request: Request
): { userId: number } | null {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  return payload;
}
