export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskManager {
  getTasks(): Promise<Task[]>;
  addTask(title: string, description?: string): Promise<Task>;
  completeTask(id: string): Promise<Task>;
  getPendingTasks(): Promise<Task[]>;
}

export interface ToolCall {
  id: string;
  tool: string;
  parameters: Record<string, any>;
}

export interface AgentResponse {
  message: string;
  toolCalls?: ToolCall[];
  final?: boolean;
}
