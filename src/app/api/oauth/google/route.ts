import { NextResponse } from "next/server";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!; // e.g. http://localhost:3000/api/oauth/google/callback
const SCOPE = "email profile";
const STATE = "secure_random_state";

export async function GET() {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SCOPE);
  url.searchParams.set("state", STATE);
  url.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(url.toString());
}