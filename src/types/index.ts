export type TaskStatus = 'NOT_STARTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface Task {
  id: string;
  taskId?: string;
  phaseId: number;
  title: string;
  description: string;
  status: TaskStatus;
  evidenceType: 'print' | 'link' | 'none';
  evidenceUrl?: string;
  feedback?: string;
  note?: string;
}

export interface Submission {
  id: string;
  mentoradoName: string;
  taskId: string;
  taskTitle: string;
  evidenceUrl: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  note?: string;
  feedback?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export interface MentoradoProgress {
  id: string;
  name: string;
  email: string;
  revenue: number;
  currentPhaseId: number;
  tasks: Task[];
}
