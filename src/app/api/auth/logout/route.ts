import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    // Clear auth_token cookie
    response.headers.set(
      "Set-Cookie",
      "auth_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );

    return response;
  } catch (error: any) {
    console.error("Erro no logout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
