import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "neoprof-secret-key-123456";

export async function GET(req: Request) {
  try {
    // Get cookies from request headers
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => c.trim().split("="))
    );

    const token = cookies["auth_token"];
    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Verify JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Fetch user's tasks
    const tasks = await prisma.userTask.findMany({
      where: { userId: user.id }
    });

    // Fetch submissions
    const submissions = await prisma.submission.findMany({
      orderBy: { submittedAt: "desc" }
    });

    // Fetch all users for ranking ordering
    const rankingUsers = await prisma.user.findMany({
      where: { role: "mentorado" },
      orderBy: { revenue: "desc" }
    });

    const ranking = rankingUsers.map((u, index) => ({
      rank: index + 1,
      name: u.name === user.name ? `${u.name} (Você)` : u.name,
      revenue: u.revenue,
      isSelf: u.id === user.id
    }));

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        revenue: user.revenue
      },
      tasks: tasks.length > 0 ? tasks : [],
      submissions: submissions.length > 0 ? submissions : [],
      ranking: ranking
    });

  } catch (error: any) {
    console.error("Erro no api/auth/me:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
