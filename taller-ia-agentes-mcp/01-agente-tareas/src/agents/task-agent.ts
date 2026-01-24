import { Anthropic } from '@anthropic-ai/sdk';
import { TaskManager } from '../types/tasks';
import { taskTools, AddTaskSchema, CompleteTaskSchema, ListTasksSchema } from '../tools/definitions';
import { FileTaskManager } from '../tools/task-manager';

export class TaskAgent {
  private client: Anthropic;
  private taskManager: TaskManager;
  private maxIterations = 5; // Evitar loops infinitos

  constructor(apiKey: string, taskManager?: TaskManager) {
    this.client = new Anthropic({ apiKey });
    this.taskManager = taskManager || new FileTaskManager();
  }

  /**
   * Ejecuta el ciclo principal del agente
   * 1. Envía el mensaje al LLM
   * 2. Si el LLM quiere usar tools, las ejecuta
   * 3. Vuelve a enviar al LLM con los resultados
   * 4. Repite hasta que el LLM devuelva una respuesta final
   */
  async execute(userMessage: string): Promise<string> {
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      {
        role: 'user',
        content: userMessage
      }
    ];

    let response = await this.callLLM(messages);
    let iterations = 0;

    // Loop principal del agente
    while (iterations < this.maxIterations) {
      // Si el LLM quiere usar tools
      if (response.toolCalls && response.toolCalls.length > 0) {
        // Ejecutar las tools y obtener resultados
        const toolResults = await this.executeTools(response.toolCalls);

        // Añadir respuesta del LLM al historial
        messages.push({
          role: 'assistant',
          content: response.message
        });

        // Añadir resultados de cada tool
        for (const result of toolResults) {
          messages.push({
            role: 'user',
            content: `Tool result for ${result.tool}: ${result.result}`
          });
        }

        // Siguiente iteración: enviar de vuelta al LLM
        response = await this.callLLM(messages);
        iterations++;
      } else {
        // El LLM dio una respuesta final (sin tools)
        return response.message;
      }
    }

    // Fallback si se alcanza max iteraciones
    return 'Lo siento, el agente alcanzó el límite máximo de iteraciones. ¿Puedes reformular tu solicitud?';
  }

  /**
   * Llama al LLM con el contexto actual y tools disponibles
   */
  private async callLLM(messages: any[]): Promise<any> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        messages,
        tools: taskTools
      });

      // Buscar texto y tool use en la respuesta
      const textContent = response.content.find(c => c.type === 'text');
      const toolUseContent = response.content.find(c => c.type === 'tool_use');

      // Si hay tool use, retornar con los tool calls
      if (toolUseContent) {
        return {
          message: textContent?.text || '',
          toolCalls: [{
            id: toolUseContent.id,
            tool: toolUseContent.name,
            parameters: toolUseContent.input
          }]
        };
      }

      // Si solo hay texto, retornar mensaje
      if (textContent) {
        return { message: textContent.text };
      }

      return { message: '' };
    } catch (error) {
      return { message: 'Lo siento, hubo un error procesando tu solicitud.' };
    }
  }

  /**
   * Ejecuta las tools que el LLM indicó
   * Mapea cada tool a su función correspondiente y valida parámetros
   */
  private async executeTools(toolCalls: any[]): Promise<any[]> {
    const results = [];

    for (const call of toolCalls) {
      try {
        let result;

        switch (call.tool) {
          case 'add_task':
            const addParams = AddTaskSchema.parse(call.parameters);
            result = await this.taskManager.addTask(
              addParams.title,
              addParams.description
            );
            break;

          case 'complete_task':
            const completeParams = CompleteTaskSchema.parse(call.parameters);
            result = await this.taskManager.completeTask(completeParams.id);
            break;

          case 'list_tasks':
            const listParams = ListTasksSchema.parse(call.parameters);
            result = await this.filterTasks(listParams.filter);
            break;

          default:
            throw new Error(`Tool ${call.tool} not found`);
        }

        results.push({
          tool: call.tool,
          result: JSON.stringify(result, null, 2)
        });

      } catch (error: any) {
        // Capturar errores de validación o ejecución
        results.push({
          tool: call.tool,
          result: `Error: ${error.message}`
        });
      }
    }

    return results;
  }

  /**
   * Helper para filtrar tareas por estado
   */
  private async filterTasks(filter: 'all' | 'pending' | 'completed'): Promise<any> {
    switch (filter) {
      case 'pending':
        return await this.taskManager.getPendingTasks();
      case 'completed':
        const allTasks = await this.taskManager.getTasks();
        return allTasks.filter(t => t.completed);
      default:
        return await this.taskManager.getTasks();
    }
  }
}
