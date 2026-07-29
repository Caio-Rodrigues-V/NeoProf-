import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "neoprof-secret-key-123456";

// GET: load all submissions for admin review
export async function GET(req: Request) {
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

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const submissions = await prisma.submission.findMany({
      orderBy: { submittedAt: "desc" }
    });

    const submissionsWithFeedback = await Promise.all(
      submissions.map(async (sub) => {
        const userTask = await prisma.userTask.findFirst({
          where: { userId: sub.userId, taskId: sub.taskId },
          select: { feedback: true }
        });
        return {
          ...sub,
          feedback: userTask?.feedback || null
        };
      })
    );

    return NextResponse.json({ submissions: submissionsWithFeedback });

  } catch (error: any) {
    console.error("Erro ao carregar submissões:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: approve or reject submission
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

    // Both Admin and System (AI validation API) can evaluate submissions
    const { submissionId, status, feedback } = await req.json();

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId }
    });

    if (!submission) {
      return NextResponse.json({ error: "Envio não encontrado" }, { status: 404 });
    }

    // Update Submission status
    const updatedSub = await prisma.submission.update({
      where: { id: submissionId },
      data: { status: status }
    });

    // Find and update UserTask
    const userTask = await prisma.userTask.findFirst({
      where: { userId: submission.userId, taskId: submission.taskId }
    });

    if (userTask) {
      await prisma.userTask.update({
        where: { id: userTask.id },
        data: {
          status: status === "APPROVED" ? "APPROVED" : "REJECTED",
          feedback: feedback || null
        }
      });
    }

    return NextResponse.json({ submission: updatedSub });

  } catch (error: any) {
    console.error("Erro ao processar avaliação:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
