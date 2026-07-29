import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "neoprof-secret-key-123456";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => c.trim().split("="))
    );
    const token = cookies["auth_token"];
    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
    }

    const { value } = await req.json();
    const val = parseFloat(value);
    if (isNaN(val) || val < 0) {
      return NextResponse.json({ error: "Valor de venda inválido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Update user's revenue
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { revenue: user.revenue + val }
    });

    // Fetch updated ranking list
    const rankingUsers = await prisma.user.findMany({
      where: { role: "mentorado" },
      orderBy: { revenue: "desc" }
    });

    const ranking = rankingUsers.map((u, index) => ({
      rank: index + 1,
      name: u.name === updatedUser.name ? `${u.name} (Você)` : u.name,
      revenue: u.revenue,
      isSelf: u.id === updatedUser.id
    }));

    return NextResponse.json({
      revenue: updatedUser.revenue,
      ranking: ranking
    });

  } catch (error: any) {
    console.error("Erro ao registrar venda:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
