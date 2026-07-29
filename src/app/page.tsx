"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskStatus, Submission, ChatMessage } from "@/types";

// Mock initial tasks from the briefing
const INITIAL_TASKS: Task[] = [
  // Phase 1: Jornada do Herói
  { id: "t1", phaseId: 1, title: "Jornada do Herói preenchida e validada", description: "Escreva a sua história conectando seu passado, ponto de virada e o método que criou.", status: "NOT_STARTED", evidenceType: "print" },
  
  // Phase 2: Cliente Ideal (ICP)
  { id: "t2", phaseId: 2, title: "ICP (Cliente Ideal) definido e aprovado", description: "Defina quem é seu cliente ideal com dores, sonhos e sem jargões técnicos.", status: "NOT_STARTED", evidenceType: "print" },
  
  // Phase 3: Pesquisa de Mercado
  { id: "t3", phaseId: 3, title: "Pesquisa de mercado realizada", description: "Identifique 3 concorrentes, 3 ofertas e 3 produtos semelhantes no seu nicho.", status: "NOT_STARTED", evidenceType: "link" },
  
  // Phase 4: Construção do Produto
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
  
  // Phase 5: Construção da Oferta
  { id: "t14", phaseId: 5, title: "Entregáveis definidos", description: "Liste exatamente tudo o que o comprador vai receber (aulas, PDFs, planilhas).", status: "NOT_STARTED", evidenceType: "none" },
  { id: "t15", phaseId: 5, title: "Tempo de acesso definido", description: "Defina se o acesso será vitalício, de 1 ano ou assinatura mensal.", status: "NOT_STARTED", evidenceType: "none" },
  { id: "t16", phaseId: 5, title: "4 bônus escolhidos e descritos", description: "Adicione bônus que quebrem as principais objeções de compra dos alunos.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t17", phaseId: 5, title: "Formato de aulas definido", description: "Decida a duração média das aulas e como serão hospedadas.", status: "NOT_STARTED", evidenceType: "none" },
  { id: "t18", phaseId: 5, title: "Precificação definida (valor cheio + parcelado)", description: "Calcule a ancoragem do preço e as opções de parcelamento.", status: "NOT_STARTED", evidenceType: "none" },
  { id: "t19", phaseId: 5, title: "Garantia de 7 dias configurada", description: "Garanta a devolução do dinheiro nas configurações da plataforma.", status: "NOT_STARTED", evidenceType: "print" },
  
  // Phase 6: Posicionamento
  { id: "t20", phaseId: 6, title: "Bio do Instagram escrita (máx 150 caracteres)", description: "Deixe claro sua promessa e coloque uma chamada para ação.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t21", phaseId: 6, title: "3 carrosséis criados no Canva", description: "Crie posts informativos prontos para publicar.", status: "NOT_STARTED", evidenceType: "print" },
  
  // Phase 7: Construção do Funil
  { id: "t22", phaseId: 7, title: "Reels gravados e postados", description: "Publique 2 a 3 vídeos curtos gerando curiosidade.", status: "NOT_STARTED", evidenceType: "link" },
  { id: "t23", phaseId: 7, title: "ManyChat configurado", description: "Configure as automações básicas de direct no Instagram.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t24", phaseId: 7, title: "Grupo de WhatsApp criado e configurado", description: "Monte o grupo onde mandará os links das aulas.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t25", phaseId: 7, title: "Anúncios turbinados (mín R$50/dia)", description: "Coloque verba para atrair pessoas para o seu WhatsApp/Instagram.", status: "NOT_STARTED", evidenceType: "print" },
  { id: "t26", phaseId: 7, title: "Stories com pitch configurados (2x/semana)", description: "Faça chamadas diretas de vendas nos stories.", status: "NOT_STARTED", evidenceType: "none" }
];

const PHASES = [
  { id: 1, name: "Jornada do Herói", desc: "A história do especialista" },
  { id: 2, name: "Cliente Ideal (ICP)", desc: "Quem vai comprar seu produto" },
  { id: 3, name: "Pesquisa de Mercado", desc: "Validação de concorrentes e ofertas" },
  { id: 4, name: "Construção do Produto", desc: "Nome, promessa e mecanismo único" },
  { id: 5, name: "Construção da Oferta", desc: "Entregáveis, precificação e bônus" },
  { id: 6, name: "Posicionamento", desc: "Bio, dor central e identidade visual" },
  { id: 7, name: "Construção do Funil", desc: "Carrosséis, Reels e ManyChat" }
];

const TUTORIALS = [
  { id: 1, title: "1. Como gravar aulas com o celular ou PC", desc: "Dicas de enquadramento, iluminação barata e captação de áudio sem ruídos para quem está começando do zero.", url: "https://www.youtube.com/embed/EYZ5T4Nluwo" },
  { id: 2, title: "2. Como criar e subir seu curso na Kiwify", desc: "Tutorial clique a clique: do cadastro da conta bancária até a ativação da área de membros e upload dos vídeos.", url: "https://www.youtube.com/embed/ialR1GAhBNk" },
  { id: 3, title: "3. Como criar e subir seu curso na Hotmart", desc: "Passo a passo completo de configuração de módulos, aulas e liberação do produto na Hotmart Club.", url: "https://www.youtube.com/embed/wNketOvpUeQ" },
  { id: 4, title: "4. Como configurar o checkout de pagamento", desc: "Aprenda a criar links de checkout personalizados, habilitar parcelamento e testar a compra de R$ 1 real.", url: "https://www.youtube.com/embed/K6ncr29LQ_A" },
  { id: 5, title: "5. Configuração completa do ManyChat", desc: "Como criar automações inteligentes de direct para enviar o link da sua oferta automaticamente quando comentarem.", url: "https://www.youtube.com/embed/pl_8MdPwciw" },
  { id: 6, title: "6. Como criar carrossel infinito no Canva", desc: "Design simplificado para iniciantes criarem posts que atraem o Cliente Ideal (ICP) e geram autoridade.", url: "https://www.youtube.com/embed/x4FTUOE_QFg" },
  { id: 7, title: "7. Como turbinar post no Instagram", desc: "Como configurar públicos, localizações, orçamentos (mín R$ 50/dia) e analisar métricas básicas de conversão.", url: "https://www.youtube.com/embed/aQGBFnQ4w-0" },
  { id: 8, title: "8. Criar e configurar grupo no WhatsApp", desc: "Configuração de segurança e automação para grupos de remarketing e entrega da aula ao vivo do seu funil.", url: "https://www.youtube.com/embed/NyKNQKahgnE" }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "m1", sender: "bot", text: "Olá, João! Eu sou o ProfAgente. Vou guiar você passo a passo na construção do seu negócio digital pelo Método POF.", timestamp: "10:00" },
  { id: "m2", sender: "bot", text: "Atualmente, você já concluiu a **Fase 1 (Jornada do Herói)**. Vamos estruturar a **Fase 2: Cliente Ideal (ICP)**?", timestamp: "10:01" }
];

const INITIAL_RANKING = [
  { rank: 1, name: "Maria Clara", revenue: 42500, isSelf: false },
  { rank: 2, name: "Pedro Henrique", revenue: 18200, isSelf: false },
  { rank: 3, name: "João Silva (Você)", revenue: 1250, isSelf: true },
  { rank: 4, name: "Ana Beatriz", revenue: 0, isSelf: false }
];

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    mentoradoName: "João Silva",
    taskId: "t2",
    taskTitle: "ICP (Cliente Ideal) definido e aprovado",
    evidenceUrl: "say_wallahibro.png",
    submittedAt: "20/07/2026 14:36",
    status: "PENDING"
  },
  {
    id: "sub-2",
    mentoradoName: "Maria Clara",
    taskId: "t5",
    taskTitle: "Promessa escrita e aprovada",
    evidenceUrl: "promessa_mentoria_v2.png",
    submittedAt: "20/07/2026 14:40",
    status: "PENDING"
  },
  {
    id: "sub-3",
    mentoradoName: "Pedro Henrique",
    taskId: "t22",
    taskTitle: "Reels gravados e postados",
    evidenceUrl: "https://instagram.com/p/C_sample_reels",
    submittedAt: "20/07/2026 14:42",
    status: "PENDING"
  }
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("joao@email.com");
  const [password, setPassword] = useState("123456");
  const [registerName, setRegisterName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [userRole, setUserRole] = useState<"mentorado" | "admin">("mentorado");
  const [userName, setUserName] = useState("João Silva");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [currentPhaseId, setCurrentPhaseId] = useState<number>(1);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  
  // Custom states
  const [activePhaseNav, setActivePhaseNav] = useState<number>(1);
  const [selectedTaskUpload, setSelectedTaskUpload] = useState<Task | null>(null);
  const [uploadValue, setUploadValue] = useState("");
  const [uploadNote, setUploadNote] = useState("");
  const [uploadFilePreview, setUploadFilePreview] = useState<string | null>(null);
  const [previewEvidence, setPreviewEvidence] = useState<{ title: string; mentoradoName: string; evidenceUrl: string; submittedAt: string; note?: string; feedback?: string } | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [funnelType, setFunnelType] = useState<"A" | "B">("A");
  const [ranking, setRanking] = useState(INITIAL_RANKING);
  const [revenueValue, setRevenueValue] = useState("");
  const [feedbackTextMap, setFeedbackTextMap] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-unlock next phases when all tasks are complete
  useEffect(() => {
    let maxUnlockedPhase = 1;
    for (let phase = 1; phase <= 7; phase++) {
      const phaseTasks = tasks.filter(t => t.phaseId === phase);
      const allApproved = phaseTasks.every(t => t.status === "APPROVED");
      
      if (allApproved && phaseTasks.length > 0) {
        maxUnlockedPhase = phase + 1;
      } else {
        break;
      }
    }
    // Update current unlocked phase
    const finalUnlocked = Math.min(maxUnlockedPhase, 7);
    if (finalUnlocked > currentPhaseId) {
      setCurrentPhaseId(finalUnlocked);
      // Auto move the active phase nav to the unlocked one
      setActivePhaseNav(finalUnlocked);
      
      // AI Agent messages you when you unlock a new phase
      const phaseName = PHASES.find(p => p.id === finalUnlocked)?.name || "";
      setChatMessages(prev => [
        ...prev,
        {
          id: `unlock-${finalUnlocked}`,
          sender: "bot",
          text: `🎉 Parabéns! Você completou com sucesso a fase anterior. A nova fase **${phaseName}** está oficialmente desbloqueada! Acesse a aba 'Método POF' para ver suas novas tarefas e debater o planejamento comigo.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [tasks]);

  // Restore session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUserRole(data.user.role);
          setUserName(data.user.name);
          setActiveTab(data.user.role === "admin" ? "admin" : "dashboard");
          setTasks(data.tasks);
          setSubmissions(data.submissions);
          setRanking(data.ranking);

          // Dynamic chatbot welcome greeting
          const firstName = data.user.name.split(" ")[0];
          setChatMessages([
            { id: "m1", sender: "bot", text: `Olá, ${firstName}! Eu sou o ProfAgente. Vou guiar você passo a passo na construção do seu negócio digital pelo Método POF.`, timestamp: "10:00" },
            { id: "m2", sender: "bot", text: `Atualmente, você já concluiu a **Fase 1 (Jornada do Herói)**. Vamos estruturar a **Fase 2: Cliente Ideal (ICP)**?`, timestamp: "10:01" }
          ]);
        }
      } catch (err) {
        console.error("Erro de sessão:", err);
      }
    }
    checkSession();
  }, []);

  // Handle Logins via SQLite DB
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erro ao realizar login");
        return;
      }
      // Load user profile & persisted state
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setIsLoggedIn(true);
        setUserRole(meData.user.role);
        setUserName(meData.user.name);
        setActiveTab(meData.user.role === "admin" ? "admin" : "dashboard");
        setTasks(meData.tasks);
        setSubmissions(meData.submissions);
        setRanking(meData.ranking);

        // Dynamic chatbot welcome greeting
        const firstName = meData.user.name.split(" ")[0];
        setChatMessages([
          { id: "m1", sender: "bot", text: `Olá, ${firstName}! Eu sou o ProfAgente. Vou guiar você passo a passo na construção do seu negócio digital pelo Método POF.`, timestamp: "10:00" },
          { id: "m2", sender: "bot", text: `Atualmente, você já concluiu a **Fase 1 (Jornada do Herói)**. Vamos estruturar a **Fase 2: Cliente Ideal (ICP)**?`, timestamp: "10:01" }
        ]);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  // Handle new mentorado signup/registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: registerName, email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erro ao realizar cadastro");
        return;
      }
      // Load newly registered user profile
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setIsLoggedIn(true);
        setUserRole(meData.user.role);
        setUserName(meData.user.name);
        setActiveTab("dashboard");
        setTasks(meData.tasks);
        setSubmissions(meData.submissions);
        setRanking(meData.ranking);
        setIsRegistering(false);
        setRegisterName("");

        // Dynamic chatbot welcome greeting
        const firstName = meData.user.name.split(" ")[0];
        setChatMessages([
          { id: "m1", sender: "bot", text: `Olá, ${firstName}! Eu sou o ProfAgente. Vou guiar você passo a passo na construção do seu negócio digital pelo Método POF.`, timestamp: "10:00" },
          { id: "m2", sender: "bot", text: `Atualmente, você já concluiu a **Fase 1 (Jornada do Herói)**. Vamos estruturar a **Fase 2: Cliente Ideal (ICP)**?`, timestamp: "10:01" }
        ]);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  // Log out via API
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      setActiveTab("dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  // Get total progress percentage
  const getProgressPercentage = () => {
    const approvedTasks = tasks.filter(t => t.status === "APPROVED").length;
    return Math.round((approvedTasks / tasks.length) * 100);
  };

  // Handle task click (only if it doesn't require evidence approval)
  const handleToggleTask = async (task: Task) => {
    if (task.evidenceType !== "none") {
      // Must upload evidence
      setSelectedTaskUpload(task);
      setUploadValue("");
      return;
    }

    const newStatus: TaskStatus = task.status === "APPROVED" ? "NOT_STARTED" : "APPROVED";

    // Optimistically update frontend
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    // Save to database
    try {
      await fetch("/api/tasks/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.taskId || task.id, status: newStatus })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle local image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadFilePreview(result);
        setUploadValue(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitEvidence = async () => {
    if (!selectedTaskUpload) return;
    
    let finalUrl = uploadFilePreview || uploadValue;
    const noteText = uploadNote.trim();
    
    // Conceptual / Strategy tasks can be submitted as text, print, or both
    const textFriendlyIds = ["t1", "t2", "t5", "t6", "t7", "t16", "t20"];
    const isTextFriendly = textFriendlyIds.includes(selectedTaskUpload.taskId || "") || textFriendlyIds.includes(selectedTaskUpload.id);

    if (isTextFriendly) {
      if (!finalUrl.trim() && !noteText.trim()) {
        alert("Por favor, digite o seu rascunho de texto ou anexe um print/screenshot.");
        return;
      }
      if (!finalUrl.trim()) {
        finalUrl = "Texto enviado na plataforma";
      }
    } else {
      if (!finalUrl.trim()) {
        alert(selectedTaskUpload.evidenceType === "link" ? "Por favor, insira o link de comprovação." : "Por favor, anexe o print/screenshot de comprovação.");
        return;
      }
    }

    const taskToSubmit = selectedTaskUpload;

    // Reset upload modal
    setSelectedTaskUpload(null);
    setUploadValue("");
    setUploadNote("");
    setUploadFilePreview(null);

    // Initial bot message: Analyzing
    setChatMessages(prev => [
      ...prev,
      {
        id: `bot-sub-${Date.now()}`,
        sender: "bot",
        text: `📥 Recebi a sua comprovação para a tarefa **"${taskToSubmit.title}"**! Estou analisando seu envio agora com a IA Claude 3.5 Sonnet... 🧠🔍`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      // 1. Persist the pending submission in database
      const taskRes = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: taskToSubmit.taskId || taskToSubmit.id,
          evidenceUrl: finalUrl,
          note: noteText || undefined
        })
      });

      if (!taskRes.ok) throw new Error("Erro ao salvar entrega");
      const { task: dbTask, submission: dbSub } = await taskRes.json();

      // Update frontend state
      setSubmissions(prev => [dbSub, ...prev]);
      setTasks(prev => prev.map(t => t.id === taskToSubmit.id ? dbTask : t));

      // 2. Call AI Validation (Section 4.4)
      const res = await fetch("/api/validate-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: taskToSubmit.taskId || taskToSubmit.id,
          taskTitle: taskToSubmit.title,
          evidenceUrl: finalUrl,
          note: noteText || undefined
        })
      });

      const data = await res.json();
      const aiStatus = data.status === "APPROVED" ? "APPROVED" : "REJECTED";
      const aiFeedback = data.feedback || (aiStatus === "APPROVED" ? "Comprovação aprovada com sucesso pela IA!" : "Por favor, revise a comprovação enviada.");

      // 3. Persist the AI result in database
      const adminRes = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: dbSub.id,
          status: aiStatus,
          feedback: aiFeedback
        })
      });

      if (adminRes.ok) {
        // Fetch updated user data to keep frontend synced
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          setTasks(meData.tasks);
          setSubmissions(meData.submissions);
        }
      }

      // Send AI evaluation chat message
      setTimeout(() => {
        if (aiStatus === "APPROVED") {
          setChatMessages(prev => [
            ...prev,
            {
              id: `bot-ai-app-${Date.now()}`,
              sender: "bot",
              text: `✅ **Entrega Aprovada pela IA!**\n\nSua comprovação para **"${taskToSubmit.title}"** foi validada com sucesso!\n\n💬 **Parecer da IA:** "${aiFeedback}"`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        } else {
          setChatMessages(prev => [
            ...prev,
            {
              id: `bot-ai-rej-${Date.now()}`,
              sender: "bot",
              text: `⚠️ **Ajuste Solicitado pela IA**\n\nAnalisamos a entrega para **"${taskToSubmit.title}"** e identificamos um ponto de atenção:\n\n💬 **O que precisa ser corrigido:** "${aiFeedback}"\n\nPor favor, faça os ajustes e envie um novo print na aba Método POF.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      }, 1000);

    } catch (err) {
      console.error("Erro na validação IA:", err);
    }
  };

  // Admin approves submission
  const handleAdminApprove = async (submission: Submission) => {
    const customMessage = (feedbackTextMap[submission.id] || "").trim();

    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission.id,
          status: "APPROVED",
          feedback: customMessage || undefined
        })
      });

      if (res.ok) {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          setTasks(meData.tasks);
          setSubmissions(meData.submissions);
        }
      }
    } catch (err) {
      console.error(err);
    }

    const messageText = customMessage
      ? `✅ Ótimas notícias, ${submission.mentoradoName}! Sua entrega para a tarefa **"${submission.taskTitle}"** foi APROVADA pelo mentor!\n\n💬 **Recado do mentor:** "${customMessage}"`
      : `✅ Ótimas notícias, ${submission.mentoradoName}! Sua entrega para a tarefa **"${submission.taskTitle}"** foi APROVADA pelo administrador. Excelente trabalho!`;

    // Message from ProfAgente celebrating
    setChatMessages(prev => [
      ...prev,
      {
        id: `bot-approve-${Date.now()}`,
        sender: "bot",
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setFeedbackTextMap(prev => {
      const next = { ...prev };
      delete next[submission.id];
      return next;
    });
  };

  // Admin rejects submission
  const handleAdminReject = async (submission: Submission) => {
    const text = feedbackTextMap[submission.id] || "";
    if (!text.trim()) return;

    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission.id,
          status: "REJECTED",
          feedback: text
        })
      });

      if (res.ok) {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          setTasks(meData.tasks);
          setSubmissions(meData.submissions);
        }
      }
    } catch (err) {
      console.error(err);
    }

    // Message from ProfAgente explaining rejection
    setChatMessages(prev => [
      ...prev,
      {
        id: `bot-reject-${Date.now()}`,
        sender: "bot",
        text: `⚠️ Atenção, ${submission.mentoradoName}. A entrega da tarefa **"${submission.taskTitle}"** precisa de ajustes segundo o feedback do administrador:\n\n*"${text}"*\n\nPor favor, ajuste os pontos descritos e reenvie a evidência na aba Método POF.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setFeedbackTextMap(prev => {
      const next = { ...prev };
      delete next[submission.id];
      return next;
    });
  };

  // AI Validation via Claude 3.5 Sonnet
  const handleAiValidate = async (submission: Submission) => {
    setIsTyping(true);
    try {
      const res = await fetch("/api/validate-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: submission.taskId,
          taskTitle: submission.taskTitle,
          evidenceUrl: submission.evidenceUrl,
          note: submission.note
        })
      });
      const data = await res.json();
      if (data.status === "APPROVED") {
        setFeedbackTextMap(prev => ({ ...prev, [submission.id]: data.feedback }));
        handleAdminApprove(submission);
      } else {
        setFeedbackTextMap(prev => ({ ...prev, [submission.id]: data.feedback }));
        handleAdminReject(submission);
      }
    } catch (e) {
      console.error(e);
      alert("Falha ao consultar Claude 3.5 Sonnet. Verifique a chave no .env.local");
    } finally {
      setIsTyping(false);
    }
  };

  // Handle clicking the (?) help icon on any task in the checklist
  const handleAskTaskExplanation = async (task: Task) => {
    setActiveTab("chat");
    const questionText = `Me explica o que significa a tarefa "${task.title}" (${task.description}) e como devo fazer passo a passo de forma bem didática e simples, como se eu nunca tivesse ouvido falar desse termo antes?`;

    const userMsg: ChatMessage = {
      id: `usr-help-${Date.now()}`,
      sender: "user",
      text: `💡 ProfAgente, pode me explicar o que é a tarefa "${task.title}" e como faço para realizar?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const currentPhaseName = PHASES.find(p => p.id === task.phaseId)?.name || "";
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...chatMessages, { ...userMsg, text: questionText }],
          currentPhaseId: task.phaseId,
          currentPhaseName: currentPhaseName,
          userName: userName
        })
      });

      if (!response.ok) throw new Error("Erro na API");

      const data = await response.json();
      
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-ans-${Date.now()}`,
          sender: "bot",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: `Desculpe, tive um contratempo ao gerar a explicação da tarefa. Por favor, tente novamente.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Direct IA interaction to adjust rejected tasks (Section 4.4 / 5.2)
  const handleGetTaskHelpWithAI = async (task: Task) => {
    setActiveTab("chat");
    const noteContent = task.note || "(Nenhum rascunho anterior)";
    const feedbackContent = task.feedback || "(Sem parecer de correção)";
    
    const userPrompt = `💡 ProfAgente, minha entrega para a tarefa "${task.title}" precisa de ajustes. 
Meu rascunho anterior foi:
"${noteContent}"

O feedback de correção que recebi foi:
"${feedbackContent}"

Você pode me ajudar a melhorar meu texto e modelar melhor essa história ou ideia?`;

    const userMsg: ChatMessage = {
      id: `usr-adjust-${Date.now()}`,
      sender: "user",
      text: `🛠️ ProfAgente, preciso de ajuda para ajustar a tarefa "${task.title}". O feedback foi: "${feedbackContent}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const currentPhaseName = PHASES.find(p => p.id === task.phaseId)?.name || "";
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...chatMessages, { ...userMsg, text: userPrompt }],
          currentPhaseId: task.phaseId,
          currentPhaseName: currentPhaseName,
          userName: userName
        })
      });

      if (!response.ok) throw new Error("Erro na API");
      const data = await response.json();
      
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-ans-${Date.now()}`,
          sender: "bot",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "Desculpe, tive um problema de comunicação. Por favor, tente novamente em instantes.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle sending a chat message to ProfAgente
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userText = chatInput;
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      const currentPhaseName = PHASES.find(p => p.id === currentPhaseId)?.name || "Cliente Ideal (ICP)";
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          currentPhaseId: currentPhaseId,
          currentPhaseName: currentPhaseName,
          userName: userName
        })
      });

      if (!response.ok) throw new Error("Erro na API");

      const data = await response.json();
      
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-ans-${Date.now()}`,
          sender: "bot",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "Desculpe, tive um problema de comunicação com meu cérebro de IA. Por favor, tente novamente em instantes.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Register user revenue (sales check print mock)
  const handleAddRevenue = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(revenueValue);
    if (isNaN(val) || val < 0) return;

    try {
      const res = await fetch("/api/ranking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val })
      });
      if (res.ok) {
        const data = await res.json();
        setRanking(data.ranking);
        setRevenueValue("");
        alert(`Venda registrada com sucesso! R$ ${val.toLocaleString('pt-BR')} adicionados ao seu faturamento.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to calculate progress percentage for a specific phase
  const getPhaseProgress = (phaseId: number) => {
    const phaseTasks = tasks.filter(t => t.phaseId === phaseId);
    if (phaseTasks.length === 0) return 0;
    const approved = phaseTasks.filter(t => t.status === "APPROVED").length;
    return Math.round((approved / phaseTasks.length) * 100);
  };

  // Helper to dynamically find the next task to be completed
  const getNextRecommendedTask = () => {
    // Find the first task in current phase that is not APPROVED
    const currentPhaseTasks = tasks.filter(t => t.phaseId === currentPhaseId);
    const incomplete = currentPhaseTasks.find(t => t.status !== "APPROVED" && t.status !== "PENDING_APPROVAL");
    if (incomplete) return incomplete;
    
    // If all are approved in current phase, look at the next phase (if unlocked)
    const nextTasks = tasks.filter(t => t.phaseId > currentPhaseId);
    const nextIncomplete = nextTasks.find(t => t.status !== "APPROVED");
    return nextIncomplete || null;
  };

  // Helper to dynamically get active notifications/alerts for student
  const getActiveAlerts = () => {
    const alertsList: { id: string; type: "warning" | "success" | "info"; title: string; desc: string; taskId?: string }[] = [];

    tasks.forEach(t => {
      if (t.status === "REJECTED") {
        alertsList.push({
          id: `rej-${t.id}`,
          type: "warning",
          title: `Ajuste na tarefa: ${t.title}`,
          desc: t.feedback || "A IA solicitou revisões no seu envio. Clique para ajustar.",
          taskId: t.id
        });
      } else if (t.status === "PENDING_APPROVAL") {
        alertsList.push({
          id: `pend-${t.id}`,
          type: "info",
          title: `Aguardando Avaliação: ${t.title}`,
          desc: "Sua comprovação está sendo analisada pela IA / Mentor.",
          taskId: t.id
        });
      }
    });

    const approvedCount = tasks.filter(t => t.status === "APPROVED").length;
    if (approvedCount === tasks.length) {
      alertsList.push({
        id: "all-done",
        type: "success",
        title: "🔥 Todos os passos concluídos!",
        desc: "Parabéns! Você completou com sucesso a jornada do Método POF!"
      });
    }

    return alertsList;
  };

  // Renders login/signup screen
  if (!isLoggedIn) {
    return (
      <div className="app-container" style={{ justifyContent: "center", alignItems: "center", padding: "1.5rem" }}>
        <div className="bg-glow-purple" style={{ top: "-10%", left: "-10%", width: "600px", height: "600px" }}></div>
        <div className="bg-glow-cyan" style={{ bottom: "-10%", right: "-10%", width: "500px", height: "500px" }}></div>
        
        <style>{`
          .auth-split-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 480px;
            border-radius: var(--radius-md);
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .auth-info-pane {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.04) 100%);
            padding: 3rem;
            position: relative;
            border-right: 1px solid var(--border-color);
          }
          .auth-info-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(99, 102, 241, 0.15);
            border: 1px solid rgba(99, 102, 241, 0.3);
            color: var(--primary);
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            font-size: 0.8rem;
            font-weight: 700;
            width: fit-content;
            margin-bottom: 1.5rem;
          }
          .auth-features-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-top: 2rem;
          }
          .auth-feature-item {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
          }
          .auth-feature-icon {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            flex-shrink: 0;
          }
          .auth-tab-switch {
            display: flex;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            border-radius: 50px;
            padding: 0.25rem;
            margin-bottom: 2rem;
          }
          .auth-tab-btn {
            flex: 1;
            padding: 0.6rem;
            border: none;
            background: none;
            color: var(--text-secondary);
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border-radius: 50px;
            transition: all 0.2s ease;
          }
          .auth-tab-btn.active {
            background: var(--primary);
            color: var(--text-primary);
            box-shadow: 0 4px 12px var(--primary-glow);
          }
          .auth-input-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .auth-input-icon {
            position: absolute;
            left: 1rem;
            bottom: 0.95rem;
            color: var(--text-muted);
            font-size: 1.1rem;
          }
          .auth-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 0.9rem 1rem 0.9rem 2.7rem;
            border-radius: 8px;
            outline: none;
            font-size: 0.9rem;
            transition: all 0.2s ease;
          }
          .auth-input:focus {
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.06);
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
          }
          .mobile-only {
            display: flex;
          }
          @media (min-width: 900px) {
            .auth-split-container {
              display: grid;
              grid-template-columns: 1.1fr 0.9fr;
              max-width: 1000px;
              min-height: 620px;
              border-radius: 24px;
              border: 1px solid var(--border-color);
              background: rgba(18, 16, 32, 0.4);
              backdrop-filter: blur(20px);
            }
            .auth-info-pane {
              display: flex;
            }
            .mobile-only {
              display: none !important;
            }
          }
        `}</style>

        <div className="auth-split-container">
          {/* Left Column: Premium Branding & Features */}
          <div className="auth-info-pane">
            <div>
              <div className="logo-container" style={{ marginBottom: "2rem" }}>
                <div className="logo-icon">NP</div>
                <div className="logo-text" style={{ fontSize: "1.4rem" }}>NEOPROF</div>
              </div>

              <div className="auth-info-badge">
                ⚡ Método POF de Mentoria
              </div>

              <h1 style={{ fontSize: "2rem", fontWeight: "800", lineHeight: "1.2", marginBottom: "1rem", background: "linear-gradient(90deg, #fff, var(--text-secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Construa seu império digital do absoluto zero.
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>
                Acompanhe o checklist de Produto, Oferta e Funil com o acompanhamento em tempo real da nossa inteligência artificial oficial.
              </p>

              <div className="auth-features-list">
                <div className="auth-feature-item">
                  <div className="auth-feature-icon">🧠</div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Mentor IA ProfAgente</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>Tire dúvidas conceituais, debata planejamentos e receba analogias fáceis de entender.</p>
                  </div>
                </div>

                <div className="auth-feature-item">
                  <div className="auth-feature-icon">📸</div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Validação de Prints com IA</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>Envie capturas de tela das suas planilhas ou plataformas e receba análises visuais imediatas.</p>
                  </div>
                </div>

                <div className="auth-feature-item">
                  <div className="auth-feature-icon">🏆</div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: "700" }}>Ranking de Faturamento</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>Acompanhe suas vendas e veja o seu progresso na disputa saudável entre mentorados.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2rem" }}>
              © 2026 NEOPROF. Todos os direitos reservados.
            </div>
          </div>

          {/* Right Column: Dynamic Form */}
          <div className="auth-form-pane" style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center", background: "rgba(18, 16, 32, 0.4)" }}>
            {/* Show logo on mobile only */}
            <div className="logo-container mobile-only" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
              <div className="logo-icon">NP</div>
              <div className="logo-text">NEOPROF</div>
            </div>

            <div className="auth-tab-switch">
              <button 
                type="button" 
                onClick={() => {
                  setIsRegistering(false);
                  setEmail("");
                  setPassword("");
                }} 
                className={`auth-tab-btn ${!isRegistering ? "active" : ""}`}
              >
                Entrar
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsRegistering(true);
                  setEmail("");
                  setPassword("");
                  setRegisterName("");
                }} 
                className={`auth-tab-btn ${isRegistering ? "active" : ""}`}
              >
                Cadastrar-se
              </button>
            </div>

            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              {isRegistering ? "Crie sua conta de aluno" : "Boas-vindas de volta!"}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "2rem" }}>
              {isRegistering ? "Comece sua jornada rumo às vendas digitais." : "Faça login para gerenciar seu progresso do Método POF."}
            </p>

            <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {isRegistering && (
                <div className="auth-input-wrapper">
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)" }}>Seu Nome</label>
                  <div style={{ position: "relative" }}>
                    <span className="auth-input-icon">👤</span>
                    <input
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      className="auth-input"
                      placeholder="Nome Completo"
                    />
                  </div>
                </div>
              )}

              <div className="auth-input-wrapper">
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)" }}>E-mail</label>
                <div style={{ position: "relative" }}>
                  <span className="auth-input-icon">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="auth-input-wrapper">
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)" }}>Senha</label>
                <div style={{ position: "relative" }}>
                  <span className="auth-input-icon">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input"
                    placeholder="Sua senha"
                  />
                </div>
              </div>

              {!isRegistering && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-secondary)", borderTop: "1px solid var(--border-color)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                  <span style={{ fontWeight: "600" }}>Acessos Rápidos de Teste:</span>
                  <button type="button" onClick={() => { setEmail("joao@email.com"); setPassword("123456"); }} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", textAlign: "left", fontSize: "0.8rem", textDecoration: "underline" }}>👉 Logar como Mentorado (joao@email.com)</button>
                  <button type="button" onClick={() => { setEmail("gleyson@email.com"); setPassword("123456"); }} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", textAlign: "left", fontSize: "0.8rem", textDecoration: "underline" }}>👉 Logar como Mentor Gleyson (gleyson@email.com)</button>
                </div>
              )}

              <button type="submit" className="chat-send-btn" style={{ padding: "0.9rem", marginTop: "1rem", fontSize: "0.95rem", fontWeight: "700" }}>
                {isRegistering ? "Criar Conta & Entrar" : "Entrar na Plataforma"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Background glow effects */}
      <div className="bg-glow-purple" style={{ top: "-100px", right: "-100px" }}></div>
      <div className="bg-glow-cyan" style={{ bottom: "-100px", left: "10%" }}></div>

      {/* Sidebar Navigation */}
      <nav className={`sidebar glass ${isMobileMenuOpen ? "open" : ""}`}>
        <button onClick={() => setIsMobileMenuOpen(false)} className="mobile-close-btn">✕</button>
        <div>
          <div className="logo-container">
            <div className="logo-icon">NP</div>
            <div className="logo-text">NEOPROF</div>
          </div>
          
          <ul className="menu-list">
            {userRole === "mentorado" && (
              <>
                <li>
                  <button 
                    onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }} 
                    className={`menu-item-btn ${activeTab === "dashboard" ? "active" : ""}`}
                  >
                    📊 Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab("method"); setIsMobileMenuOpen(false); }} 
                    className={`menu-item-btn ${activeTab === "method" ? "active" : ""}`}
                  >
                    ⚡ Método POF
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab("chat"); setIsMobileMenuOpen(false); }} 
                    className={`menu-item-btn ${activeTab === "chat" ? "active" : ""}`}
                  >
                    🤖 ProfAgente IA
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab("tutorials"); setIsMobileMenuOpen(false); }} 
                    className={`menu-item-btn ${activeTab === "tutorials" ? "active" : ""}`}
                  >
                    🎥 Vídeo Tutoriais
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab("funnel"); setIsMobileMenuOpen(false); }} 
                    className={`menu-item-btn ${activeTab === "funnel" ? "active" : ""}`}
                  >
                    🧬 Estrutura do Funil
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab("ranking"); setIsMobileMenuOpen(false); }} 
                    className={`menu-item-btn ${activeTab === "ranking" ? "active" : ""}`}
                  >
                    🏆 Ranking de Vendas
                  </button>
                </li>
              </>
            )}
            
            {userRole === "admin" && (
              <li>
                <button 
                  onClick={() => { setActiveTab("admin"); setIsMobileMenuOpen(false); }} 
                  className={`menu-item-btn ${activeTab === "admin" ? "active" : ""}`}
                >
                  🛡️ Painel Admin (Gleyson)
                </button>
              </li>
            )}
          </ul>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              {userName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">
                {userName}
              </span>
              <span className="user-role">
                {userRole === "admin" ? "Administrador/Dono" : "Mentorado POF"}
              </span>
            </div>
          </div>

          <button 
            onClick={() => {
              const newRole = userRole === "mentorado" ? "admin" : "mentorado";
              setUserRole(newRole);
              setIsMobileMenuOpen(false);
              if (newRole === "admin") {
                setActiveTab("admin");
              } else {
                setActiveTab("dashboard");
              }
            }} 
            className="toggle-role-btn"
          >
            🔄 Alternar Perfil ({userRole === "mentorado" ? "Ver como Admin" : "Ver como Aluno"})
          </button>
          
          <button 
            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
            className="menu-item-btn"
            style={{ color: "var(--error)", padding: "0.5rem 1rem", border: "1px solid rgba(239, 68, 68, 0.2)" }}
          >
            🚪 Sair da Conta
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Mobile Top Bar Header */}
        <div className="mobile-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="logo-icon" style={{ width: "28px", height: "28px", fontSize: "0.85rem" }}>NP</div>
            <span className="logo-text" style={{ fontSize: "1.1rem" }}>NEOPROF</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="hamburger-btn">
            ☰
          </button>
        </div>
        
        {/* TAB 1: DASHBOARD (MENTORADO) */}
        {userRole === "mentorado" && activeTab === "dashboard" && (() => {
          const nextTask = getNextRecommendedTask();
          const activeAlerts = getActiveAlerts();
          
          return (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Bem-vindo, {userName.split(" ")[0]}!</h1>
                  <p className="page-description">Gerencie seu progresso nas fases do Método POF.</p>
                </div>
              </div>
              
              <div className="dashboard-grid">
                <div className="glass-card metric-card">
                  <span className="metric-label">Progresso Geral</span>
                  <span className="metric-value">{getProgressPercentage()}%</span>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${getProgressPercentage()}%` }}></div>
                  </div>
                </div>
                
                <div className="glass-card metric-card">
                  <span className="metric-label">Fase Atual Ativa</span>
                  <span className="metric-value" style={{ fontSize: "1.8rem", color: "var(--primary)", marginTop: "0.5rem" }}>
                    Fase {currentPhaseId}: {PHASES.find(p => p.id === currentPhaseId)?.name}
                  </span>
                  <span className="task-desc" style={{ color: "var(--text-secondary)" }}>
                    {PHASES.find(p => p.id === currentPhaseId)?.desc}
                  </span>
                </div>
                
                <div className="glass-card metric-card">
                  <span className="metric-label">Minhas Vendas (Mês)</span>
                  <span className="metric-value" style={{ color: "var(--success)" }}>
                    R$ {ranking.find(item => item.isSelf)?.revenue.toLocaleString('pt-BR')}
                  </span>
                  <span className="task-desc" style={{ color: "var(--text-secondary)" }}>
                    Posição no Ranking: #{ranking.findIndex(item => item.isSelf) + 1} de {ranking.length}
                  </span>
                </div>
              </div>

              {/* Dynamic Alerts / Notifications Section */}
              <div className="glass-card" style={{ marginBottom: "1.5rem", borderLeft: "4px solid var(--primary)" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  🔔 Central de Alertas e Recados
                </h2>
                {activeAlerts.length === 0 ? (
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    <span>🚀 Tudo em dia! Envie suas comprovações de tarefas na aba **Método POF** para avançar na mentoria.</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {activeAlerts.map(alert => (
                      <div 
                        key={alert.id} 
                        style={{ 
                          padding: "0.75rem 1rem", 
                          borderRadius: "6px", 
                          background: alert.type === "warning" ? "rgba(239, 68, 68, 0.1)" : alert.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(59, 130, 246, 0.1)",
                          border: alert.type === "warning" ? "1px solid rgba(239, 68, 68, 0.2)" : alert.type === "success" ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid rgba(59, 130, 246, 0.2)",
                          fontSize: "0.85rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <strong style={{ color: alert.type === "warning" ? "var(--error)" : alert.type === "success" ? "var(--success)" : "var(--primary)", display: "block", marginBottom: "0.15rem" }}>
                            {alert.title}
                          </strong>
                          <span style={{ color: "var(--text-secondary)" }}>{alert.desc}</span>
                        </div>
                        {alert.taskId && (
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            {alert.type === "warning" && (
                              <button 
                                onClick={() => {
                                  const t = tasks.find(item => item.id === alert.taskId);
                                  if (t) handleGetTaskHelpWithAI(t);
                                }}
                                className="chat-send-btn" 
                                style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", margin: 0, background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", color: "var(--primary)" }}
                              >
                                🗣️ Ajustar com IA
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                const t = tasks.find(item => item.id === alert.taskId);
                                if (t) {
                                  setActiveTab("method");
                                  setActivePhaseNav(t.phaseId);
                                }
                              }}
                              className="toggle-role-btn" 
                              style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", margin: 0 }}
                            >
                              Ir para Tarefa
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                {/* Centerpiece: Recommended Next Step */}
                <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>🎯 Próximo Passo Recomendado</h2>
                      <span className="task-status-badge badge-pending" style={{ margin: 0, textTransform: "uppercase", fontSize: "0.7rem" }}>
                        Fase {nextTask ? nextTask.phaseId : currentPhaseId}
                      </span>
                    </div>

                    {nextTask ? (
                      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginTop: "0.5rem" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0, marginTop: "0.2rem" }}>🔥</div>
                        <div>
                          <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)" }}>
                            {nextTask.title}
                          </h3>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.35rem", lineHeight: "1.4" }}>
                            {nextTask.description}
                          </p>
                          <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.75rem", background: "rgba(255, 255, 255, 0.05)", padding: "0.25rem 0.5rem", borderRadius: "4px", color: "var(--text-secondary)" }}>
                              Formato exigido: {nextTask.evidenceType === "print" ? "📸 Print de Comprovação" : nextTask.evidenceType === "link" ? "🔗 Link de Acesso" : "✔️ Apenas Conclusão"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Parabéns! Você completou todas as tarefas!</p>
                    )}
                  </div>

                  {nextTask && (
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                      <button 
                        onClick={() => {
                          setActiveTab("chat");
                          handleAskTaskExplanation(nextTask);
                        }} 
                        className="chat-send-btn" 
                        style={{ padding: "0.6rem 1.25rem", margin: 0, fontSize: "0.85rem", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.3)" }}
                      >
                        🗣️ Perguntar ao ProfAgente
                      </button>

                      {nextTask.evidenceType !== "none" ? (
                        <button 
                          onClick={() => {
                            setSelectedTaskUpload(nextTask);
                            setUploadValue("");
                          }} 
                          className="chat-send-btn" 
                          style={{ padding: "0.6rem 1.25rem", margin: 0, fontSize: "0.85rem" }}
                        >
                          📤 Enviar Comprovação
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleToggleTask(nextTask)} 
                          className="chat-send-btn" 
                          style={{ padding: "0.6rem 1.25rem", margin: 0, fontSize: "0.85rem" }}
                        >
                          ✔️ Concluir Passo
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Grid roadmap phases progress */}
                <div className="glass-card">
                  <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem" }}>🗺️ Mapa das Fases do Método POF</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
                    {[1, 2, 3, 4, 5, 6, 7].map(phaseId => {
                      const phase = PHASES.find(p => p.id === phaseId)!;
                      const progress = getPhaseProgress(phaseId);
                      const isLocked = phaseId > currentPhaseId;

                      return (
                        <div 
                          key={phaseId} 
                          onClick={() => {
                            if (!isLocked) {
                              setActiveTab("method");
                              setActivePhaseNav(phaseId);
                            }
                          }}
                          style={{ 
                            padding: "0.75rem", 
                            borderRadius: "8px", 
                            background: isLocked ? "rgba(255, 255, 255, 0.02)" : phaseId === currentPhaseId ? "rgba(99, 102, 241, 0.08)" : "rgba(255, 255, 255, 0.05)",
                            border: phaseId === currentPhaseId ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid rgba(255, 255, 255, 0.05)",
                            opacity: isLocked ? 0.4 : 1,
                            cursor: isLocked ? "not-allowed" : "pointer",
                            transition: "all 0.2s"
                          }}
                          className="phase-roadmap-card"
                        >
                          <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                            FASE {phaseId} {isLocked ? "🔒" : ""}
                          </div>
                          <div style={{ fontSize: "0.8rem", fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {phase.name}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.75rem" }}>
                            <span style={{ color: "var(--text-secondary)" }}>Progresso</span>
                            <strong style={{ color: progress === 100 ? "var(--success)" : "var(--text-primary)" }}>{progress}%</strong>
                          </div>
                          <div className="progress-container" style={{ height: "4px", marginTop: "0.25rem" }}>
                            <div className="progress-bar" style={{ width: `${progress}%`, background: progress === 100 ? "var(--success)" : "var(--primary)" }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* TAB 2: METODO POF CHECKLIST (MENTORADO) */}
        {userRole === "mentorado" && activeTab === "method" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Checklist do Método POF</h1>
                <p className="page-description">Complete as tarefas obrigatórias de cada fase para liberar a próxima.</p>
              </div>
            </div>

            <div className="phases-nav">
              {PHASES.map(p => {
                const isLocked = p.id > currentPhaseId;
                return (
                  <button
                    key={p.id}
                    onClick={() => !isLocked && setActivePhaseNav(p.id)}
                    className={`phase-nav-btn ${activePhaseNav === p.id ? "active" : ""}`}
                    style={{ 
                      opacity: isLocked ? 0.4 : 1, 
                      cursor: isLocked ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    {isLocked ? "🔒" : ""} Fase {p.id}: {p.name}
                  </button>
                );
              })}
            </div>

            <div className="glass-card">
              <h2 style={{ marginBottom: "1.5rem" }}>
                Fase {activePhaseNav}: {PHASES.find(p => p.id === activePhaseNav)?.name}
              </h2>
              
              <div className="checklist-container">
                {tasks.filter(t => t.phaseId === activePhaseNav).map(task => (
                  <div key={task.id} className="task-row">
                    <div 
                      onClick={() => handleToggleTask(task)}
                      className={`task-checkbox ${task.status === "APPROVED" ? "checked" : ""}`}
                    >
                      {task.status === "APPROVED" && "✓"}
                    </div>
                    
                    <div className="task-details">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="task-title">{task.title}</span>
                        <button
                          type="button"
                          onClick={() => handleAskTaskExplanation(task)}
                          className="tooltip-trigger" 
                          title="Clique para a IA ProfAgente te explicar essa tarefa de forma bem didática"
                          style={{
                            cursor: "pointer",
                            background: "rgba(99, 102, 241, 0.2)",
                            border: "1px solid rgba(99, 102, 241, 0.4)",
                            borderRadius: "50%",
                            width: "22px",
                            height: "22px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            color: "#a5b4fc",
                            transition: "all 0.2s"
                          }}
                        >
                          ?
                        </button>
                      </div>
                      <p className="task-desc">{task.description}</p>
                      
                      {task.feedback && (
                        <div style={{
                          marginTop: "0.75rem",
                          padding: "0.75rem",
                          background: task.status === "APPROVED" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                          border: `1px solid ${task.status === "APPROVED" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          color: task.status === "APPROVED" ? "var(--success)" : "var(--error)"
                        }}>
                          <strong>{task.status === "APPROVED" ? "💬 Recado do Mentor:" : "⚠️ Motivo da Correção:"}</strong> {task.feedback}
                        </div>
                      )}

                      {task.status === "PENDING_APPROVAL" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                          <span className="task-status-badge badge-pending">⏳ Aguardando Validação</span>
                          {task.evidenceUrl && (
                            <button 
                              onClick={() => setPreviewEvidence({
                                title: task.title,
                                mentoradoName: "João Silva",
                                evidenceUrl: task.evidenceUrl || "",
                                submittedAt: "Aguardando Mentor Gleyson",
                                note: task.note
                              })}
                              className="evidence-link"
                              style={{ background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
                            >
                              👁️ Ver o que você enviou
                            </button>
                          )}
                        </div>
                      )}

                      {task.status === "REJECTED" && (
                        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <span className="task-status-badge badge-rejected">Ajuste Solicitado</span>
                          <button 
                            onClick={() => {
                              setSelectedTaskUpload(task);
                              setUploadValue(task.evidenceUrl || "");
                              setUploadNote(task.note || "");
                              setUploadFilePreview(task.evidenceUrl && task.evidenceUrl.startsWith("data:image") ? task.evidenceUrl : null);
                            }}
                            className="upload-btn"
                            style={{ marginTop: 0 }}
                          >
                            🔄 Reenviar Comprovação
                          </button>
                          <button 
                            onClick={() => handleGetTaskHelpWithAI(task)}
                            className="chat-send-btn"
                            style={{ 
                              padding: "0.45rem 1rem", 
                              fontSize: "0.8rem", 
                              margin: 0,
                              background: "rgba(99, 102, 241, 0.15)",
                              border: "1px solid rgba(99, 102, 241, 0.4)",
                              color: "var(--primary)"
                            }}
                          >
                            🗣️ Ajustar com ProfAgente
                          </button>
                        </div>
                      )}

                      {task.status === "APPROVED" && task.evidenceType !== "none" && (
                        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <span className="task-status-badge badge-approved">✓ Concluída & Aprovada</span>
                          {task.evidenceUrl && (
                            <button 
                              onClick={() => setPreviewEvidence({
                                title: task.title,
                                mentoradoName: "João Silva",
                                evidenceUrl: task.evidenceUrl || "",
                                submittedAt: "Aprovado",
                                feedback: task.feedback,
                                note: task.note
                              })}
                              className="evidence-link"
                              style={{ background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
                            >
                              👁️ Ver Comprovação
                            </button>
                          )}
                        </div>
                      )}

                      {task.status !== "APPROVED" && task.status !== "PENDING_APPROVAL" && task.status !== "REJECTED" && task.evidenceType !== "none" && (
                        <button 
                          onClick={() => {
                            setSelectedTaskUpload(task);
                            setUploadValue("");
                            setUploadNote("");
                            setUploadFilePreview(null);
                          }}
                          className="upload-btn"
                        >
                          📤 Enviar Comprovação ({task.evidenceType === "print" ? "Print/Imagem" : "Link"})
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 3: PROFAGENTE IA (MENTORADO) */}
        {userRole === "mentorado" && activeTab === "chat" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">ProfAgente IA</h1>
                <p className="page-description">O seu copiloto no método POF. Debata ideias e crie sua oferta.</p>
              </div>
            </div>

            <div className="glass chat-container">
              <div className="chat-header">
                <div className="bot-avatar">🤖</div>
                <div className="bot-status-container">
                  <span className="bot-name">ProfAgente</span>
                  <span className="bot-status">⚡ Online • Powered by Claude 3.5 Sonnet</span>
                </div>
              </div>

              <div className="chat-messages">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`message ${msg.sender}`}>
                    <div className="message-bubble">
                      {msg.text.split('\n').map((line, idx) => (
                        <p key={idx} style={{ marginBottom: line.startsWith('*') ? '0.5rem' : '0' }}>{line}</p>
                      ))}
                    </div>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                ))}
                {isTyping && (
                  <div className="message bot">
                    <div className="message-bubble" style={{ opacity: 0.6, fontStyle: "italic" }}>
                      ProfAgente está formulando sua orientação...
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Action Suggestion Chips */}
              <div className="no-scrollbar" style={{ display: "flex", gap: "0.5rem", padding: "0.75rem 1.25rem", overflowX: "auto", overflowY: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {[
                  "🎯 Como definir meu Cliente Ideal (ICP)?",
                  "✍️ Crie a Bio perfeita para meu Instagram",
                  "💡 Sugira 3 nomes e promessas para meu produto",
                  "🎁 Quais 4 bônus devo colocar na minha oferta?",
                  "⚙️ Explique meu Mecanismo Único sem jargões"
                ].map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setChatInput(promptText);
                    }}
                    className="glass"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "32px",
                      padding: "0 0.85rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      color: "var(--text-primary)",
                      background: "rgba(99, 102, 241, 0.12)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      lineHeight: "1",
                      transition: "all 0.2s"
                    }}
                  >
                    {promptText}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendChatMessage} className="chat-input-area">
                <input
                  type="text"
                  placeholder="Envie sua resposta ou tire uma dúvida sobre o método..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="chat-input"
                />
                <button type="submit" className="chat-send-btn">
                  Enviar
                </button>
              </form>
            </div>
          </>
        )}

        {/* TAB 4: TUTORIALS (MENTORADO) */}
        {userRole === "mentorado" && activeTab === "tutorials" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Tutoriais Técnicos</h1>
                <p className="page-description">Vídeos rápidos ensinando a configurar as ferramentas do seu funil.</p>
              </div>
            </div>

            <div className="tutorials-grid">
              {TUTORIALS.map(vid => (
                <div key={vid.id} className="glass-card video-card" style={{ padding: 0 }}>
                  <div className="video-wrapper">
                    <iframe
                      src={vid.url}
                      title={vid.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{vid.title}</h3>
                    <p className="video-desc">{vid.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TAB 5: FUNNEL (MENTORADO) */}
        {userRole === "mentorado" && activeTab === "funnel" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Sua Estrutura de Funil</h1>
                <p className="page-description">Visualização interativa das etapas do seu funil POF.</p>
              </div>
            </div>

            <div className="glass-card" style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "2rem" }}>
                <span style={{ marginRight: "1rem", fontWeight: "600" }}>Selecione o seu Modelo de Funil:</span>
                <button 
                  onClick={() => setFunnelType("A")} 
                  className="phase-nav-btn" 
                  style={{ marginRight: "0.5rem", background: funnelType === "A" ? "var(--primary)" : "", color: funnelType === "A" ? "white" : "" }}
                >
                  Caminho A: Grupo de WhatsApp
                </button>
                <button 
                  onClick={() => setFunnelType("B")} 
                  className="phase-nav-btn"
                  style={{ background: funnelType === "B" ? "var(--primary)" : "", color: funnelType === "B" ? "white" : "" }}
                >
                  Caminho B: WhatsApp Direto (Conversão 1x1)
                </button>
              </div>

              <div className="funnel-container">
                <div className="funnel-stage" style={{ background: "rgba(139, 92, 246, 0.15)" }}>
                  <span className="funnel-stage-name">1. Conteúdo Orgânico Turbinado</span>
                  <p className="funnel-stage-desc">3 Carrosséis + Reels no Instagram direcionados para a dor principal do ICP.</p>
                </div>
                
                <div className="funnel-arrow">↓</div>

                {funnelType === "A" ? (
                  <>
                    <div className="funnel-stage" style={{ background: "rgba(6, 182, 212, 0.15)" }}>
                      <span className="funnel-stage-name">2. Grupo do WhatsApp Aquecido</span>
                      <p className="funnel-stage-desc">Clientes clicam no link e entram num grupo silencioso para receber avisos.</p>
                    </div>
                    
                    <div className="funnel-arrow">↓</div>
                    
                    <div className="funnel-stage" style={{ background: "rgba(16, 185, 129, 0.15)" }}>
                      <span className="funnel-stage-name">3. Aula Ao Vivo Semanal</span>
                      <p className="funnel-stage-desc">Uma live demonstrando a aplicação prática da sua mentoria (Pitch de Vendas).</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="funnel-stage" style={{ background: "rgba(6, 182, 212, 0.15)" }}>
                      <span className="funnel-stage-name">2. Conversa Direta no WhatsApp (1x1)</span>
                      <p className="funnel-stage-desc">Lead vai direto para o seu WhatsApp pessoal. Você aplica roteiro de fechamento.</p>
                    </div>
                  </>
                )}

                <div className="funnel-arrow">↓</div>

                <div className="funnel-stage" style={{ background: "rgba(244, 63, 94, 0.15)" }}>
                  <span className="funnel-stage-name">4. Oferta + Checkout</span>
                  <p className="funnel-stage-desc">Envio do link de compra configurado com bônus e garantia de 7 dias.</p>
                </div>

                <div className="funnel-arrow">↓</div>

                <div className="funnel-stage" style={{ background: "rgba(250, 204, 21, 0.15)", borderColor: "#eab308" }}>
                  <span className="funnel-stage-name">💸 Venda Aprovada!</span>
                  <p className="funnel-stage-desc">Acesso automático liberado na plataforma de curso.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 6: RANKING (MENTORADO) */}
        {userRole === "mentorado" && activeTab === "ranking" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Ranking de Resultados</h1>
                <p className="page-description">Vendas aprovadas dos alunos do Método POF (Gera prova social e competição saudável).</p>
              </div>
            </div>

            <div className="dashboard-grid" style={{ marginBottom: "2rem" }}>
              <div className="glass-card">
                <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Registrar Nova Venda</h2>
                <form onSubmit={handleAddRevenue} style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="number"
                    placeholder="Valor da venda (ex: 1500)"
                    value={revenueValue}
                    onChange={(e) => setRevenueValue(e.target.value)}
                    className="chat-input"
                    required
                  />
                  <button type="submit" className="chat-send-btn">
                    Salvar
                  </button>
                </form>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  Nota: Na versão real, o admin precisará validar o print do boleto ou checkout pago para computar no ranking.
                </p>
              </div>
            </div>

            <div className="glass-card">
              <h2 style={{ marginBottom: "1rem" }}>Resultados do Mês Corrente</h2>
              <div className="desktop-table-container">
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Mentorado</th>
                      <th>Faturamento Validador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((row, idx) => (
                      <tr key={row.name} style={{ background: row.isSelf ? "rgba(99, 102, 241, 0.15)" : "" }}>
                        <td>
                          <span className={`ranking-position rank-${idx + 1}`}>
                            #{idx + 1}
                          </span>
                        </td>
                        <td>
                          <span className="ranking-name">{row.name}</span>
                        </td>
                        <td>
                          <span className="ranking-value">R$ {row.revenue.toLocaleString('pt-BR')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mobile-card-list">
                {ranking.map((row, idx) => (
                  <div 
                    key={row.name} 
                    className="ranking-row-card" 
                    style={{ 
                      background: row.isSelf ? "rgba(99, 102, 241, 0.15)" : "",
                      borderLeft: row.isSelf ? "3px solid var(--primary)" : ""
                    }}
                  >
                    <div className="card-row-info">
                      <span className={`ranking-position rank-${idx + 1}`} style={{ fontWeight: 800 }}>
                        #{idx + 1}
                      </span>
                      <span className="ranking-name" style={{ fontWeight: 600, flexGrow: 1, marginLeft: "1rem" }}>
                        {row.name}
                      </span>
                      <span className="ranking-value" style={{ fontWeight: 700, color: "var(--accent)" }}>
                        R$ {row.revenue.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 7: ADMIN PAINEL (GLE YSON) */}
        {userRole === "admin" && activeTab === "admin" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Painel de Acompanhamento</h1>
                <p className="page-description">Visão geral dos mentorados, aprovação de entregas e progresso do método.</p>
              </div>
            </div>

            <div className="admin-stats">
              <div className="glass-card metric-card">
                <span className="metric-label">Total Mentorados</span>
                <span className="metric-value">5 Alunos</span>
              </div>
              <div className="glass-card metric-card">
                <span className="metric-label">Pendentes de Validação</span>
                <span className="metric-value" style={{ color: "var(--warning)" }}>
                  {submissions.filter(s => s.status === "PENDING").length}
                </span>
              </div>
              <div className="glass-card metric-card">
                <span className="metric-label">Faturamento Total Geral</span>
                <span className="metric-value" style={{ color: "var(--success)" }}>
                  R$ {ranking.reduce((acc, i) => acc + i.revenue, 0).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="glass-card" style={{ marginBottom: "2rem" }}>
              <h2 style={{ marginBottom: "1rem" }}>Entregas de Tarefas para Validar</h2>
              {submissions.filter(s => s.status === "PENDING").length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", padding: "1rem 0" }}>
                  🎉 Nenhuma submissão pendente de aprovação! Bom trabalho.
                </p>
              ) : (
                <>
                  <div className="desktop-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Mentorado</th>
                          <th>Tarefa</th>
                          <th>Evidência</th>
                          <th>Data de Envio</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.filter(s => s.status === "PENDING").map(sub => (
                          <tr key={sub.id}>
                            <td style={{ fontWeight: "600" }}>{sub.mentoradoName}</td>
                            <td>{sub.taskTitle}</td>
                            <td>
                              <button 
                                onClick={() => setPreviewEvidence({ title: sub.taskTitle, mentoradoName: sub.mentoradoName, evidenceUrl: sub.evidenceUrl, submittedAt: sub.submittedAt, note: sub.note })} 
                                className="evidence-link"
                                style={{ background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
                              >
                                👁️ Ver Evidência
                              </button>
                            </td>
                            <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{sub.submittedAt}</td>
                            <td>
                              <div style={{ display: "flex", gap: "0.25rem", flexDirection: "column" }}>
                                <button 
                                  onClick={() => handleAdminApprove(sub)} 
                                  className="btn-approve"
                                  style={{ width: "100%" }}
                                >
                                  Aprovar
                                </button>
                                
                                <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.25rem" }}>
                                  <input
                                    type="text"
                                    placeholder="Comentário ou recado..."
                                    value={feedbackTextMap[sub.id] || ""}
                                    onChange={(e) => setFeedbackTextMap(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                    className="chat-input"
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", width: "130px" }}
                                  />
                                  <button 
                                    onClick={() => handleAdminReject(sub)} 
                                    className="btn-reject"
                                  >
                                    Reprovar
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mobile-card-list">
                    {submissions.filter(s => s.status === "PENDING").map(sub => (
                      <div key={sub.id} className="admin-submission-card">
                        <div className="card-row-info">
                          <span className="card-label">Aluno:</span>
                          <span className="card-value">{sub.mentoradoName}</span>
                        </div>
                        <div className="card-row-info">
                          <span className="card-label">Tarefa:</span>
                          <span className="card-value" style={{ textAlign: "right" }}>{sub.taskTitle}</span>
                        </div>
                        <div className="card-row-info">
                          <span className="card-label">Enviado em:</span>
                          <span className="card-value">{sub.submittedAt}</span>
                        </div>
                        <div className="card-row-info">
                          <span className="card-label">Print/Link:</span>
                          <button 
                            onClick={() => setPreviewEvidence({ title: sub.taskTitle, mentoradoName: sub.mentoradoName, evidenceUrl: sub.evidenceUrl, submittedAt: sub.submittedAt, note: sub.note })} 
                            className="evidence-link"
                            style={{ background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
                          >
                            👁️ Ver Evidência
                          </button>
                        </div>
                        
                        <div className="card-actions-wrapper" style={{ marginTop: "1rem", flexDirection: "column" }}>
                          <button 
                            onClick={() => handleAdminApprove(sub)} 
                            className="btn-approve"
                            style={{ padding: "0.75rem", width: "100%", margin: 0 }}
                          >
                            ✓ Aprovar Entrega
                          </button>
                          
                          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem", width: "100%", boxSizing: "border-box" }}>
                            <input
                              type="text"
                              placeholder="Comentário ou recado..."
                              value={feedbackTextMap[sub.id] || ""}
                              onChange={(e) => setFeedbackTextMap(prev => ({ ...prev, [sub.id]: e.target.value }))}
                              className="chat-input"
                              style={{ flex: "1 1 0px", minWidth: 0 }}
                            />
                            <button 
                              onClick={() => handleAdminReject(sub)} 
                              className="btn-reject"
                              style={{ padding: "0 1rem", flexShrink: 0, whiteSpace: "nowrap" }}
                            >
                              Reprovar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Validated Submissions History */}
            <div className="glass-card" style={{ marginBottom: "2rem" }}>
              <h2 style={{ marginBottom: "1rem" }}>📋 Histórico Geral de Entregas (IA & Mentor)</h2>
              {submissions.filter(s => s.status !== "PENDING").length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", padding: "1rem 0" }}>
                  Nenhuma entrega validada no histórico.
                </p>
              ) : (
                <>
                  <div className="desktop-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Mentorado</th>
                          <th>Tarefa</th>
                          <th>Evidência</th>
                          <th>Status Final</th>
                          <th>Data</th>
                          <th>Ação Corretiva</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.filter(s => s.status !== "PENDING").map(sub => (
                          <tr key={sub.id}>
                            <td style={{ fontWeight: "600" }}>{sub.mentoradoName}</td>
                            <td>{sub.taskTitle}</td>
                            <td>
                              <button 
                                onClick={() => setPreviewEvidence({ title: sub.taskTitle, mentoradoName: sub.mentoradoName, evidenceUrl: sub.evidenceUrl, submittedAt: sub.submittedAt, note: sub.note })} 
                                className="evidence-link"
                                style={{ background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
                              >
                                👁️ Ver Evidência
                              </button>
                            </td>
                            <td>
                              <span className={`task-status-badge ${sub.status === "APPROVED" ? "badge-approved" : "badge-rejected"}`}>
                                {sub.status === "APPROVED" ? "✅ APROVADO" : "❌ REPROVADO"}
                              </span>
                            </td>
                            <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{sub.submittedAt}</td>
                            <td>
                              <div style={{ display: "flex", gap: "0.25rem" }}>
                                <button 
                                  onClick={async () => {
                                    const nextStatus = sub.status === "APPROVED" ? "REJECTED" : "APPROVED";
                                    const feedbackText = nextStatus === "APPROVED" ? "Aprovação manual por auditoria do Mentor." : "Ajuste solicitado pelo Mentor.";
                                    try {
                                      const res = await fetch("/api/admin/submissions", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                          submissionId: sub.id,
                                          status: nextStatus,
                                          feedback: feedbackText
                                        })
                                      });
                                      if (res.ok) {
                                        const meRes = await fetch("/api/auth/me");
                                        if (meRes.ok) {
                                          const meData = await meRes.json();
                                          setTasks(meData.tasks);
                                          setSubmissions(meData.submissions);
                                        }
                                      }
                                    } catch (err) { console.error(err); }
                                  }}
                                  className="toggle-role-btn"
                                  style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", margin: 0 }}
                                >
                                  {sub.status === "APPROVED" ? "Rejeitar Manualmente" : "Aprovar Manualmente"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mobile-card-list">
                    {submissions.filter(s => s.status !== "PENDING").map(sub => (
                      <div key={sub.id} className="admin-submission-card">
                        <div className="card-row-info">
                          <span className="card-label">Aluno:</span>
                          <span className="card-value">{sub.mentoradoName}</span>
                        </div>
                        <div className="card-row-info">
                          <span className="card-label">Tarefa:</span>
                          <span className="card-value" style={{ textAlign: "right" }}>{sub.taskTitle}</span>
                        </div>
                        <div className="card-row-info">
                          <span className="card-label">Status:</span>
                          <span className="card-value">
                            <span className={`task-status-badge ${sub.status === "APPROVED" ? "badge-approved" : "badge-rejected"}`}>
                              {sub.status === "APPROVED" ? "✅ Aprovado" : "❌ Reprovado"}
                            </span>
                          </span>
                        </div>
                        <div className="card-row-info">
                          <span className="card-label">Evidência:</span>
                          <button 
                            onClick={() => setPreviewEvidence({ title: sub.taskTitle, mentoradoName: sub.mentoradoName, evidenceUrl: sub.evidenceUrl, submittedAt: sub.submittedAt, note: sub.note })} 
                            className="evidence-link"
                            style={{ background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
                          >
                            👁️ Ver Evidência
                          </button>
                        </div>
                        <div className="card-actions-wrapper" style={{ marginTop: "0.5rem" }}>
                          <button 
                            onClick={async () => {
                              const nextStatus = sub.status === "APPROVED" ? "REJECTED" : "APPROVED";
                              const feedbackText = nextStatus === "APPROVED" ? "Aprovação manual por auditoria do Mentor." : "Ajuste solicitado pelo Mentor.";
                              try {
                                const res = await fetch("/api/admin/submissions", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    submissionId: sub.id,
                                    status: nextStatus,
                                    feedback: feedbackText
                                  })
                                });
                                if (res.ok) {
                                  const meRes = await fetch("/api/auth/me");
                                  if (meRes.ok) {
                                    const meData = await meRes.json();
                                    setTasks(meData.tasks);
                                    setSubmissions(meData.submissions);
                                  }
                                }
                              } catch (err) { console.error(err); }
                            }}
                            className="toggle-role-btn"
                            style={{ width: "100%", padding: "0.5rem", fontSize: "0.8rem" }}
                          >
                            {sub.status === "APPROVED" ? "Rejeitar Manualmente" : "Aprovar Manualmente"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="glass-card">
              <h2 style={{ marginBottom: "1rem" }}>Lista Geral de Alunos</h2>
              <div className="desktop-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Fase Atual</th>
                      <th>Progresso</th>
                      <th>Faturamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: "600" }}>{userName}</td>
                      <td>Fase {currentPhaseId}</td>
                      <td>{getProgressPercentage()}%</td>
                      <td style={{ color: "var(--accent)" }}>R$ {ranking.find(i => i.isSelf)?.revenue.toLocaleString('pt-BR')}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>Maria Clara</td>
                      <td>Fase 6</td>
                      <td>85%</td>
                      <td style={{ color: "var(--accent)" }}>R$ 42.500</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>Pedro Henrique</td>
                      <td>Fase 5</td>
                      <td>68%</td>
                      <td style={{ color: "var(--accent)" }}>R$ 18.200</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>Ana Beatriz</td>
                      <td>Fase 2</td>
                      <td>15%</td>
                      <td style={{ color: "var(--accent)" }}>R$ 0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mobile-card-list">
                {[
                  { name: userName, phase: `Fase ${currentPhaseId}`, progress: `${getProgressPercentage()}%`, revenue: `R$ ${ranking.find(i => i.isSelf)?.revenue.toLocaleString('pt-BR')}` },
                  { name: "Maria Clara", phase: "Fase 6", progress: "85%", revenue: "R$ 42.500" },
                  { name: "Pedro Henrique", phase: "Fase 5", progress: "68%", revenue: "R$ 18.200" },
                  { name: "Ana Beatriz", phase: "Fase 2", progress: "15%", revenue: "R$ 0" }
                ].map(std => (
                  <div key={std.name} className="admin-student-card">
                    <div className="card-row-info">
                      <span className="card-value" style={{ fontSize: "1.05rem", fontWeight: "700" }}>{std.name}</span>
                      <span className="task-status-badge badge-approved" style={{ margin: 0 }}>{std.progress}</span>
                    </div>
                    <div className="card-row-info" style={{ marginTop: "0.25rem" }}>
                      <span className="card-label">Fase Ativa:</span>
                      <span className="card-value">{std.phase}</span>
                    </div>
                    <div className="card-row-info">
                      <span className="card-label">Faturamento:</span>
                      <span className="card-value" style={{ color: "var(--accent)" }}>{std.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </main>

      {/* Modal 1: Upload Evidence Modal (Mentorado) */}
      {selectedTaskUpload && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100, padding: "1rem" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "500px", background: "var(--bg-surface-elevated)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "16px", padding: "1.75rem", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <span className="task-status-badge badge-pending" style={{ fontSize: "0.7rem", marginBottom: "0.35rem", display: "inline-block" }}>
                  {(selectedTaskUpload.taskId === "t1" || selectedTaskUpload.id === "t1") ? "📝 Texto / Imagem da Jornada" : selectedTaskUpload.evidenceType === "print" ? "📸 Comprovação por Imagem" : "🔗 Comprovação por Link"}
                </span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Enviar para Validação</h3>
              </div>
              <button onClick={() => setSelectedTaskUpload(null)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "1.25rem", cursor: "pointer" }}>✕</button>
            </div>
            
            <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", display: "block" }}>Tarefa Selecionada</span>
              <strong style={{ fontSize: "0.95rem", color: "white" }}>{selectedTaskUpload.title}</strong>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{selectedTaskUpload.description}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", display: "block", marginBottom: "0.5rem" }}>
                  {["t1", "t2", "t5", "t6", "t7", "t16", "t20"].includes(selectedTaskUpload.taskId || "") || ["t1", "t2", "t5", "t6", "t7", "t16", "t20"].includes(selectedTaskUpload.id)
                    ? "✍️ Rascunho do Trabalho / Observação (Texto):"
                    : "✍️ Observação ou mensagem para o Mentor Gleyson (Opcional):"}
                </label>
                
                <textarea
                  placeholder={
                    selectedTaskUpload.taskId === "t1" || selectedTaskUpload.id === "t1"
                      ? "Conte a sua história: Passado (Antes), Ponto de Virada, O Método e Onde Está Hoje..."
                      : selectedTaskUpload.taskId === "t2" || selectedTaskUpload.id === "t2"
                      ? "Defina o seu Cliente Ideal (ICP): Dores, desejos, objeções e perfil..."
                      : selectedTaskUpload.taskId === "t5" || selectedTaskUpload.id === "t5"
                      ? "Escreva a sua promessa única de transformação..."
                      : "Digite suas anotações ou o conteúdo do trabalho aqui..."
                  }
                  value={uploadNote}
                  onChange={(e) => setUploadNote(e.target.value)}
                  className="chat-input"
                  rows={6}
                  style={{ 
                    width: "100%", 
                    resize: "vertical", 
                    fontSize: "0.85rem", 
                    fontFamily: "inherit",
                    borderRadius: "8px 8px 0 0",
                    borderBottom: "none",
                    margin: 0
                  }}
                />

                {/* Integrated Attachment Zone */}
                <div style={{
                  border: "1px solid var(--border-color)",
                  borderTop: "1px dashed rgba(255,255,255,0.15)",
                  borderRadius: "0 0 8px 8px",
                  background: "rgba(0,0,0,0.15)",
                  padding: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem"
                }}>
                  {/* Selected image preview */}
                  {uploadFilePreview ? (
                    <div style={{ position: "relative", display: "inline-block", maxWidth: "fit-content" }}>
                      <img 
                        src={uploadFilePreview} 
                        alt="Preview" 
                        style={{ maxHeight: "110px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)" }} 
                      />
                      <button
                        type="button"
                        onClick={() => { setUploadFilePreview(null); setUploadValue(""); }}
                        style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          background: "var(--error)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          fontSize: "0.7rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        ✕
                      </button>
                      <span style={{ display: "block", fontSize: "0.7rem", color: "var(--success)", marginTop: "0.25rem" }}>
                        📸 {uploadValue} selecionado
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                      {/* Image Picker */}
                      {selectedTaskUpload.evidenceType === "print" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            id="integrated-file-input"
                            style={{ display: "none" }}
                          />
                          <label 
                            htmlFor="integrated-file-input" 
                            style={{ 
                              cursor: "pointer", 
                              display: "inline-flex", 
                              alignItems: "center", 
                              gap: "0.35rem", 
                              background: "rgba(255,255,255,0.06)", 
                              border: "1px solid var(--border-color)", 
                              padding: "0.45rem 0.75rem", 
                              borderRadius: "6px", 
                              fontSize: "0.75rem", 
                              fontWeight: "600", 
                              color: "var(--text-primary)", 
                              transition: "background 0.2s" 
                            }} 
                            className="hover-highlight"
                          >
                            📎 Anexar Print/Screenshot
                          </label>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>PNG, JPG ou WEBP</span>
                        </div>
                      )}

                      {/* Link Input Box */}
                      {selectedTaskUpload.evidenceType === "link" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", flexShrink: 0 }}>🔗 Link:</span>
                          <input
                            type="text"
                            placeholder="https://instagram.com/... ou https://canva.com/..."
                            value={uploadValue}
                            onChange={(e) => setUploadValue(e.target.value)}
                            className="chat-input"
                            style={{ flex: "1 1 0px", fontSize: "0.75rem", padding: "0.45rem 0.75rem", margin: 0, borderRadius: "6px" }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual file text input fallback (only for prints) */}
                  {selectedTaskUpload.evidenceType === "print" && !uploadFilePreview && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.4rem" }}>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Ou digite o nome do print:</span>
                      <input
                        type="text"
                        placeholder="ex: print_configurado.png"
                        value={uploadValue}
                        onChange={(e) => { setUploadValue(e.target.value); setUploadFilePreview(null); }}
                        className="chat-input"
                        style={{ flex: "1 1 0px", fontSize: "0.65rem", padding: "0.2rem 0.4rem", margin: 0, borderRadius: "4px", background: "rgba(0,0,0,0.1)" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button 
                onClick={() => { setSelectedTaskUpload(null); setUploadValue(""); setUploadNote(""); setUploadFilePreview(null); }} 
                className="btn-reject"
                style={{ padding: "0.6rem 1.25rem" }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmitEvidence} 
                className="chat-send-btn"
                style={{ padding: "0.6rem 1.25rem" }}
              >
                🚀 Enviar para Validação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: View Evidence Modal (Mentorado + Admin) */}
      {previewEvidence && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 110, padding: "1rem" }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "520px", background: "var(--bg-surface-elevated)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "16px", padding: "1.75rem", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: "600", textTransform: "uppercase" }}>Visualizador de Comprovação</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", marginTop: "0.15rem" }}>{previewEvidence.title}</h3>
              </div>
              <button onClick={() => setPreviewEvidence(null)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "1.25rem", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Enviado por: <strong>{previewEvidence.mentoradoName}</strong> ({previewEvidence.submittedAt})
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              {previewEvidence.evidenceUrl.startsWith("data:image") ? (
                <div style={{ textAlign: "center", background: "#000", padding: "0.5rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <img src={previewEvidence.evidenceUrl} alt="Evidência" style={{ maxWidth: "100%", maxHeight: "280px", objectFit: "contain", borderRadius: "6px" }} />
                </div>
              ) : previewEvidence.evidenceUrl.startsWith("http") ? (
                <div style={{ padding: "1rem", background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "10px", textAlign: "center" }}>
                  <span style={{ fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Link de Comprovação Externo:</span>
                  <a href={previewEvidence.evidenceUrl} target="_blank" rel="noopener noreferrer" className="chat-send-btn" style={{ display: "inline-block", padding: "0.5rem 1.25rem", textDecoration: "none" }}>
                    🔗 Abrir Link ({previewEvidence.evidenceUrl})
                  </a>
                </div>
              ) : (
                <div style={{ padding: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>🖼️</span>
                  <div>
                    <span style={{ fontSize: "0.85rem", color: "white", fontWeight: "600", display: "block" }}>Arquivo Anexado: {previewEvidence.evidenceUrl}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Simulação de print enviado pelo mentorado</span>
                  </div>
                </div>
              )}
            </div>

            {previewEvidence.note && (
              <div style={{ marginBottom: "1rem", padding: "0.85rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "0.85rem" }}>
                <strong style={{ color: "var(--primary)" }}>💬 Observação do Aluno:</strong>
                <p style={{ marginTop: "0.25rem", color: "var(--text-primary)" }}>"{previewEvidence.note}"</p>
              </div>
            )}

            {previewEvidence.feedback && (
              <div style={{ marginBottom: "1.25rem", padding: "0.85rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px", fontSize: "0.85rem", color: "var(--success)" }}>
                <strong>💬 Recado do Mentor:</strong>
                <p style={{ marginTop: "0.25rem" }}>"{previewEvidence.feedback}"</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setPreviewEvidence(null)} 
                className="chat-send-btn"
                style={{ padding: "0.5rem 1.25rem" }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
