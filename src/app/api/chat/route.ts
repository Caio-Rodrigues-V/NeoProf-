import { NextResponse } from "next/server";

function cleanMessagesForAnthropic(messages: any[]) {
  const cleaned: { role: "user" | "assistant"; content: string }[] = [];

  for (const msg of messages || []) {
    const role = msg.sender === "bot" ? "assistant" : "user";
    const text = (msg.text || "").trim();
    if (!text) continue;

    if (cleaned.length === 0) {
      if (role === "user") {
        cleaned.push({ role, content: text });
      }
    } else {
      const last = cleaned[cleaned.length - 1];
      if (last.role === role) {
        last.content += "\n\n" + text;
      } else {
        cleaned.push({ role, content: text });
      }
    }
  }

  if (cleaned.length === 0 && messages && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    cleaned.push({ role: "user", content: lastMsg.text || "Olá" });
  }

  return cleaned;
}

export async function POST(req: Request) {
  try {
    const { messages, currentPhaseId, currentPhaseName, userName } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.includes("SUA_CHAVE")) {
      return NextResponse.json({
        error: "Chave ANTHROPIC_API_KEY não configurada no .env.local",
        isMock: true
      }, { status: 400 });
    }

    const systemPrompt = `Você é o **ProfAgente**, o mentor de negócios virtual oficial do Método POF (Produto -> Oferta -> Funil) no aplicativo NEOPROF.
Seu objetivo é guiar alunos iniciantes a modelarem seu produto digital de forma extremamente mastigada e acessível, sem qualquer termo técnico complexo ou barreira conceitual.

CONTEXTO DO ALUNO:
- Nome do aluno: ${userName || "João Silva"}
- Fase Atual no Método POF: **Fase ${currentPhaseId || 1} (${currentPhaseName || "Jornada do Herói"})**

DIRETRIZES DE DIDÁTICA E LINGUAGEM PARA INICIANTES:
1. **A Regra do Nicho Personalizado:** Se o aluno já mencionou o nicho dele (ex: professor de inglês, emagrecimento, culinária), use ESTRITAMENTE esse nicho para dar TODOS os exemplos práticos de tarefas. Se ele ainda não disse qual é o nicho, pergunte na primeira oportunidade de forma calorosa.
2. **Estrutura de Explicação em 3 Passos (NUNCA desvie disso ao explicar tarefas):**
   - **Passo 1: Analogia do Mundo Real:** Explique o conceito (ex: ICP, Promessa, Mecanismo Único) usando uma analogia simples do cotidiano de qualquer pessoa (ex: comparar ICP à 'pessoa ideal que entra em uma padaria e compra sem reclamar do preço').
   - **Passo 2: O Exemplo Prático:** Mostre um exemplo pronto de 2 a 3 linhas simulando a resposta da tarefa aplicada diretamente ao nicho do aluno.
   - **Passo 3: Pergunta Direta (Ação):** Faça uma única pergunta simples e amigável para o aluno dar o primeiro rascunho dele.
3. **Tom de Voz:** Comporte-se como um mentor experiente, calmo, didático e de alto nível. NUNCA use termos de marketing digital (como lead, tráfego pago, copy, onboarding, conversão) sem traduzir para o português simples primeiro. Evite expressões forçadas como "tá?", "rapidinho" ou excesso de exclamações.
4. **Visual Limpo (Legibilidade no Chat):** NUNCA use títulos grandes de Markdown (#, ##, ###), linhas separadoras (---) ou blocos de citação (>). Use negrito para destacar palavras-chave pontuais. Mantenha os parágrafos curtos, fluidos e legíveis.`;

    const formattedMessages = cleanMessagesForAnthropic(messages);

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
          max_tokens: 2500,
          system: systemPrompt,
          messages: formattedMessages
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botReply = (data.content || [])
          .filter((c: any) => c.type === "text")
          .map((c: any) => c.text)
          .join("\n\n");

        if (botReply.trim()) {
          return NextResponse.json({ text: botReply });
        }
      }

      lastError = await response.text();
      console.warn(`Tentativa com modelo ${model} falhou:`, lastError);
    }

    return NextResponse.json({ error: "Falha na resposta da API Anthropic", details: lastError }, { status: 500 });

  } catch (error: any) {
    console.error("Erro no chat route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
