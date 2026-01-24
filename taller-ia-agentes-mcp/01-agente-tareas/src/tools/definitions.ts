import { z } from 'zod';

// Esquemas de validación con Zod
export const AddTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional()
});

export const CompleteTaskSchema = z.object({
  id: z.string().uuid()
});

export const ListTasksSchema = z.object({
  filter: z.enum(['all', 'pending', 'completed']).optional().default('all')
});

// Definiciones de tools para el LLM
export const taskTools = [
  {
    name: 'add_task',
    description: 'Añade una nueva tarea a la lista. Usa esto cuando el usuario quiera crear una tarea.',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string' as const,
          description: 'Título de la tarea (máximo 100 caracteres)'
        },
        description: {
          type: 'string' as const,
          description: 'Descripción opcional de la tarea (máximo 500 caracteres)'
        }
      },
      required: ['title']
    }
  },
  {
    name: 'complete_task',
    description: 'Marca una tarea como completada. Necesitas el ID de la tarea.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          description: 'ID único de la tarea a completar'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'list_tasks',
    description: 'Lista las tareas según el filtro especificado.',
    input_schema: {
      type: 'object' as const,
      properties: {
        filter: {
          type: 'string' as const,
          enum: ['all', 'pending', 'completed'],
          description: 'Filtro para las tareas: all (todas), pending (pendientes), completed (completadas)',
          default: 'all'
        }
      }
    }
  }
];
