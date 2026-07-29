import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { taskId, taskTitle, evidenceUrl, note } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.includes("SUA_CHAVE")) {
      return NextResponse.json({
        error: "Chave ANTHROPIC_API_KEY não configurada no .env.local",
        isMock: true
      }, { status: 400 });
    }

    const systemPrompt = `Você é o validador de entregas por inteligência artificial do método POF (Produto -> Oferta -> Funil) para o app NEOPROF.
Seu papel é analisar a comprovação enviada pelo aluno (print de tela ou link + observação) para a tarefa: "${taskTitle}".

CRITÉRIOS DE VALIDAÇÃO:
1. Se for print de Instagram/YouTube: verificar se o perfil aparenta estar organizado com foto, nome e promessa/link visível.
2. Se for print de Checkout (Kiwify/Hotmart): verificar se o produto/oferta está ativo com valor em R$ e área de membros configurada.
3. Se for print de Vendas: verificar se há comprovante de valor, data e consiste com a declaração.
4. Se for link de Canva/Reels/Stories: verificar se a URL é válida e coerente com o entregável.

INSTRUÇÃO DE RESPOSTA:
Você DEVE responder ESTRITAMENTE em formato JSON com o seguinte esquema (sem markdown extra, sem texto fora do JSON):
{
  "status": "APPROVED" | "REJECTED",
  "feedback": "Sua mensagem em português didático, positivo e direto. Se aprovado, parabenize com entusiasmo. Se reprovado, explique com carinho exatamente o que falta corrigir para aprovar."
}`;

    // Prepare content blocks for Anthropic API
    const userContent: any[] = [];

    // If evidenceUrl is base64 image data
    if (evidenceUrl && evidenceUrl.startsWith("data:image")) {
      const parts = evidenceUrl.split(",");
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
      const base64Data = parts[1];

      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType,
          data: base64Data
        }
      });
    }

    let promptText = `Por favor, analise a seguinte entrega do mentorado:\n- Tarefa: ${taskTitle}\n- Evidência Enviada: ${evidenceUrl.startsWith("data:image") ? "[Imagem em anexo]" : evidenceUrl}`;
    if (note) {
      promptText += `\n- Observação do aluno: "${note}"`;
    }
    promptText += `\n\nResponda estritamente com o JSON contendo "status" ("APPROVED" ou "REJECTED") e "feedback".`;

    userContent.push({
      type: "text",
      text: promptText
    });

    const candidateModels = ["claude-sonnet-5", "claude-sonnet-4-6", "claude-sonnet-4-5-20250929"];
    let lastError = "";

    for (const model of candidateModels) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 1500,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: userContent
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.content?.[0]?.text || "";

        try {
          const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json(parsed);
          }
        } catch (parseErr) {
          console.error("Erro ao converter JSON do Claude:", parseErr);
        }

        return NextResponse.json({
          status: "APPROVED",
          feedback: rawContent || "Entrega analisada com sucesso!"
        });
      }

      lastError = await response.text();
      console.warn(`Tentativa com modelo ${model} falhou:`, lastError);
    }

    return NextResponse.json({ error: "Falha na resposta da API Anthropic", details: lastError }, { status: 500 });

  } catch (error: any) {
    console.error("Erro no manipulador de validação:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
