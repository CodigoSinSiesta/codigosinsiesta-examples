# 01 - Task Management Agent

A simple yet powerful task management agent built with Claude AI. This example demonstrates how to create an AI agent that can understand natural language commands and execute task management operations.

## 🎯 What You'll Learn

- **Agent Architecture**: How to structure an AI agent with a message loop
- **Tool Integration**: Define and execute tools that the AI can use
- **State Management**: Persist task data using file-based storage
- **Natural Language Processing**: Let users interact in plain language
- **Error Handling**: Gracefully handle validation and runtime errors

## ✨ Features

- ✅ Add tasks with natural language
- 📋 List all, pending, or completed tasks
- ✔️ Mark tasks as complete
- 💾 File-based persistence (tasks.json)
- 🔄 Interactive CLI interface
- 🛡️ Schema validation with Zod

## 🚀 Quick Start

### Prerequisites

- Node.js 20.0 or higher
- npm or yarn
- Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

### Run the Agent

```bash
npm start
```

## 💬 Usage Examples

Once the agent is running, try these commands:

```
Tú: Añade una tarea para "Comprar leche"
🤖 Tarea añadida: Comprar leche

Tú: Añade una tarea para "Hacer ejercicio" con descripción "Ir al gimnasio 3 veces por semana"
🤖 Tarea añadida: Hacer ejercicio - Ir al gimnasio 3 veces por semana

Tú: Lista todas las tareas
🤖 Tienes 2 tareas:
    1. Comprar leche (pendiente)
    2. Hacer ejercicio (pendiente)

Tú: Completa la tarea de comprar leche
🤖 Tarea completada: Comprar leche

Tú: Lista las tareas pendientes
🤖 Tienes 1 tarea pendiente:
    1. Hacer ejercicio
```

Type `exit` to quit.

## 📁 Project Structure

```
01-agente-tareas/
├── src/
│   ├── agents/
│   │   └── task-agent.ts      # Main agent logic
│   ├── tools/
│   │   ├── definitions.ts     # Tool schemas for Claude
│   │   └── task-manager.ts    # Task storage implementation
│   ├── types/
│   │   └── tasks.ts          # TypeScript interfaces
│   └── index.ts              # CLI entry point
├── .env.example              # Environment template
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript config
└── README.md                # This file
```

## 🔧 How It Works

### 1. Tool Definitions

The agent has three tools defined in `src/tools/definitions.ts`:

- **add_task**: Creates a new task
- **complete_task**: Marks a task as done
- **list_tasks**: Retrieves tasks with filters

Each tool has a JSON schema that Claude uses to understand parameters.

### 2. Agent Loop

The agent follows this pattern:

1. User sends a message
2. Claude analyzes the message and decides which tool(s) to use
3. Agent executes the tools and returns results
4. Claude uses results to generate a natural language response
5. Response is shown to the user

### 3. State Management

Tasks are persisted to `tasks.json` in the project root. The `FileTaskManager` class handles all CRUD operations.

## 🎓 Key Concepts

### Agentic Loop

The `execute()` method in `TaskAgent` implements the core agentic loop:

```typescript
async execute(userMessage: string): Promise<string> {
  // 1. Send message to Claude
  let response = await this.callLLM(messages);

  // 2. If Claude wants to use tools
  while (response.toolCalls) {
    // 3. Execute tools
    const results = await this.executeTools(response.toolCalls);

    // 4. Send results back to Claude
    response = await this.callLLM(updatedMessages);
  }

  // 5. Return final response
  return response.message;
}
```

### Schema Validation

All tool inputs are validated using Zod:

```typescript
export const AddTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional()
});
```

This ensures data integrity and provides clear error messages.

## 🔍 Debugging

Enable verbose logging by uncommenting debug statements in `task-agent.ts`. You'll see:
- Raw messages sent to Claude
- Tool calls with parameters
- Tool execution results

## 📚 Next Steps

After completing this example:

1. **Extend functionality**: Add edit_task, delete_task, or set_due_date tools
2. **Add persistence**: Use a real database instead of JSON files
3. **Improve UX**: Add task priorities, categories, or tags
4. **Move to [02-agente-investigador](../02-agente-investigador/)**: Learn about web search integration

## 🛠️ Development

```bash
# Run in development mode with auto-reload
npm run dev

# Type-check without building
npm run typecheck

# Build the project
npm run build
```

## 📖 Additional Resources

- [Anthropic SDK Documentation](https://docs.anthropic.com/en/docs/)
- [Claude Tool Use Guide](https://docs.anthropic.com/en/docs/tool-use)
- [Workshop Full Documentation](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/agente-tareas)

## 🤝 Contributing

Found a bug or want to improve this example? Contributions are welcome! Please check the main repository for contribution guidelines.

## 📄 License

MIT License - See LICENSE file for details

---

**Part of the Código Sin Siesta AI Agents & MCP Workshop**

[← Back to Workshop](../) | [Next Example: Research Agent →](../02-agente-investigador/)
