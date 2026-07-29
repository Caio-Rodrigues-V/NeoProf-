import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// The 26 tasks checklist template from page.tsx
const TASK_TEMPLATES = [
  { id: "t1", phaseId: 1, title: "Jornada do Herói preenchida e validada", description: "Escreva a sua história conectando seu passado, ponto de virada e o método que criou.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t2", phaseId: 2, title: "ICP (Cliente Ideal) definido e aprovado", description: "Defina quem é seu cliente ideal com dores, sonhos e sem jargões técnicos.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t3", phaseId: 3, title: "Pesquisa de mercado realizada", description: "Identifique 3 concorrentes, 3 ofertas e 3 produtos semelhantes no seu nicho.", status: "NOT_STARTED", evidenceType: "link" },
  { id: "t4", phaseId: 4, title: "Nome do produto definido", description: "Escolha um nome marcante e autoexplicativo para a sua mentoria ou curso.", status: "NOT_STARTED", evidenceType: "none" },
  { id: "t5", phaseId: 4, title: "Promessa escrita e aprovada", description: "Crie uma frase que resume o resultado concreto que seu aluno terá.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t6", phaseId: 4, title: "Método organizado em 3-4 passos", description: "Divida seu conhecimento em um passo a passo simples de entender.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t7", phaseId: 4, title: "Mecanismo único nomeado e explicado", description: "Diga qual é a engrenagem ou ferramenta especial que faz seu método funcionar.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t8", phaseId: 4, title: "Formato de entrega definido", description: "Decida se será ao vivo, gravado, individual, em grupo ou híbrido.", status: "NOT_STARTED", evidenceType: "none" },
  { id: "t9", phaseId: 4, title: "Instagram organizado e aberto", description: "Deixe seu perfil profissional e aberto para o público.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t10", phaseId: 4, title: "Canal no YouTube criado", description: "Configure as artes básicas e informações do canal de suporte.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t11", phaseId: 4, title: "3 a 4 postagens estratégicas no ar", description: "Publique conteúdo que mostre sua autoridade no assunto.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t12", phaseId: 4, title: "Curso criado na plataforma (básico)", description: "Crie a estrutura do produto na Hotmart, Kiwify ou outra de sua escolha.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t13", phaseId: 4, title: "Checkout de pagamento testado", description: "Faça uma compra teste de R$1 para garantir que o link funciona.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t14", phaseId: 5, title: "Entregáveis definidos", description: "Liste exatamente tudo o que o comprador vai receber (aulas, PDFs, planilhas).", status: "NOT_STARTED", evidenceType: "none" },
  { id: "t15", phaseId: 5, title: "Tempo de acesso definido", description: "Defina se o acesso será vitalício, de 1 ano ou assinatura mensal.", status: "NOT_STARTED", evidenceType: "none" },
  { id: "t16", phaseId: 5, title: "4 bônus escolhidos e descritos", description: "Adicione bônus que quebrem as principais objeções de compra dos alunos.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t17", phaseId: 5, title: "Formato de aulas definido", description: "Decida a duração média das aulas e como serão hospedadas.", status: "NOT_STARTED", evidenceType: "none" },
  { id: "t18", phaseId: 5, title: "Precificação definida (valor cheio + parcelado)", description: "Calcule a ancoragem do preço e as opções de parcelamento.", status: "NOT_STARTED", evidenceType: "none" },
  { id: "t19", phaseId: 5, title: "Garantia de 7 dias configurada", description: "Garanta a devolução do dinheiro nas configurações da plataforma.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t20", phaseId: 6, title: "Bio do Instagram escrita (máx 150 caracteres)", description: "Deixe claro sua promessa e coloque uma chamada para ação.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t21", phaseId: 6, title: "3 carrosséis criados no Canva", description: "Crie posts informativos prontos para publicar.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t22", phaseId: 7, title: "Reels gravados e postados", description: "Publique 2 a 3 vídeos curtos gerando curiosidade.", status: "NOT_STARTED", evidenceType: "link" },
  { id: "t23", phaseId: 7, title: "ManyChat configurado", description: "Configure as automações básicas de direct no Instagram.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t24", phaseId: 7, title: "Grupo de WhatsApp criado e configurado", description: "Monte o grupo onde mandará os links das aulas.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t25", phaseId: 7, title: "Anúncios turbinados (mín R$50/dia)", description: "Coloque verba para atrair pessoas para o seu WhatsApp/Instagram.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t26", phaseId: 7, title: "Stories com pitch configurados (2x/semana)", description: "Faça chamadas diretas de vendas nos stories.", status: "NOT_STARTED", evidenceType: "none" }
];

async function main() {
  console.log("Iniciando sementeira (seed)...");

  // Clean database
  await prisma.submission.deleteMany();
  await prisma.userTask.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  // 1. Create João Silva (Mentorado)
  const joao = await prisma.user.create({
    data: {
      email: "joao@email.com",
      name: "João Silva",
      password: hashedPassword,
      role: "mentorado",
      revenue: 1250.0
    }
  });

  // Create tasks for João Silva
  for (const template of TASK_TEMPLATES) {
    await prisma.userTask.create({
      data: {
        userId: joao.id,
        taskId: template.id,
        title: template.title,
        description: template.description,
        phaseId: template.phaseId,
        status: template.status,
        evidenceType: template.evidenceType
      }
    });
  }

  // 2. Create Gleyson Lima (Admin / Mentor)
  await prisma.user.create({
    data: {
      email: "gleyson@email.com",
      name: "Gleyson Lima",
      password: hashedPassword,
      role: "admin",
      revenue: 154300.0
    }
  });

  // 3. Create mock users for Ranking
  await prisma.user.create({
    data: {
      email: "maria@email.com",
      name: "Maria Clara",
      password: hashedPassword,
      role: "mentorado",
      revenue: 42500.0
    }
  });

  await prisma.user.create({
    data: {
      email: "pedro@email.com",
      name: "Pedro Henrique",
      password: hashedPassword,
      role: "mentorado",
      revenue: 18200.0
    }
  });

  await prisma.user.create({
    data: {
      email: "ana@email.com",
      name: "Ana Beatriz",
      password: hashedPassword,
      role: "mentorado",
      revenue: 0.0
    }
  });

  // 4. Create initial pending submissions
  const sub1Task = await prisma.userTask.findFirst({ where: { userId: joao.id, taskId: "t2" } });
  if (sub1Task) {
    // Mark t2 as pending approval for Joao
    await prisma.userTask.update({
      where: { id: sub1Task.id },
      data: { status: "PENDING_APPROVAL", evidenceUrl: "say_wallahibro.png" }
    });

    await prisma.submission.create({
      data: {
        userId: joao.id,
        mentoradoName: "João Silva",
        taskId: "t2",
        taskTitle: "ICP (Cliente Ideal) definido e aprovado",
        evidenceUrl: "say_wallahibro.png",
        submittedAt: new Date().toLocaleDateString("pt-BR") + " 14:36",
        status: "PENDING"
      }
    });
  }

  console.log("Sementeira finalizada com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
