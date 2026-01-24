import { Task, TaskManager } from '../types/tasks';
import { writeFile, readFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class FileTaskManager implements TaskManager {
  private filePath: string;

  constructor(filePath: string = './tasks.json') {
    this.filePath = filePath;
  }

  // Cargar tareas del archivo
  private async loadTasks(): Promise<Task[]> {
    try {
      const data = await readFile(this.filePath, 'utf-8');
      const tasks = JSON.parse(data);
      // Convertir strings de fecha a objetos Date
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined
      }));
    } catch {
      return []; // Si no existe el archivo, retornar lista vacía
    }
  }

  // Guardar tareas al archivo
  private async saveTasks(tasks: Task[]): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(tasks, null, 2));
  }

  // Obtener todas las tareas
  async getTasks(): Promise<Task[]> {
    return this.loadTasks();
  }

  // Añadir nueva tarea
  async addTask(title: string, description?: string): Promise<Task> {
    const tasks = await this.loadTasks();
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      createdAt: new Date()
    };

    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }

  // Marcar tarea como completada
  async completeTask(id: string): Promise<Task> {
    const tasks = await this.loadTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    if (task.completed) {
      throw new Error(`Task ${id} is already completed`);
    }

    task.completed = true;
    task.completedAt = new Date();
    await this.saveTasks(tasks);
    return task;
  }

  // Obtener solo tareas pendientes
  async getPendingTasks(): Promise<Task[]> {
    const tasks = await this.loadTasks();
    return tasks.filter(task => !task.completed);
  }
}
