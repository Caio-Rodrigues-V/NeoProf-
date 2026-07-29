import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "neoprof-secret-key-123456";

export async function POST(req: Request) {
  try {
    // Auth check
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

    const { taskId, evidenceUrl, note } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Find UserTask
    const userTask = await prisma.userTask.findFirst({
      where: { userId: user.id, taskId: taskId }
    });

    if (!userTask) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }

    // Create a new Submission record
    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        mentoradoName: user.name,
        taskId: taskId,
        taskTitle: userTask.title,
        evidenceUrl: evidenceUrl,
        note: note || null,
        submittedAt: new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
        status: "PENDING"
      }
    });

    // Update UserTask status
    const updatedTask = await prisma.userTask.update({
      where: { id: userTask.id },
      data: {
        status: "PENDING_APPROVAL",
        evidenceUrl: evidenceUrl,
        note: note || null,
        feedback: null
      }
    });

    return NextResponse.json({ task: updatedTask, submission: submission });

  } catch (error: any) {
    console.error("Erro ao enviar comprovação:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
