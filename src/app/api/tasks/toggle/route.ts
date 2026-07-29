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
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    let decoded: any;
    try { decoded = jwt.verify(token, JWT_SECRET); }
    catch { return NextResponse.json({ error: "Sessão inválida" }, { status: 401 }); }

    const { taskId, status } = await req.json();

    const userTask = await prisma.userTask.findFirst({
      where: { userId: decoded.userId, taskId: taskId }
    });

    if (!userTask) return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });

    const updated = await prisma.userTask.update({
      where: { id: userTask.id },
      data: { status: status }
    });

    return NextResponse.json({ task: updated });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
