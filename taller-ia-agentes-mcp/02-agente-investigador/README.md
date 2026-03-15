# 02 - Research Agent (Investigation Agent)

An advanced AI agent that conducts comprehensive research using the **Plan-Execute-Synthesize** pattern. This example demonstrates how to build autonomous agents that can break down complex topics into investigable subtasks, execute them with dependency management, and synthesize findings into coherent reports.

## 🎯 What You'll Learn

- **Plan-Execute-Synthesize Pattern**: Multi-phase agent architecture for complex tasks
- **Dynamic Planning**: AI-generated investigation plans with dependency graphs
- **Parallel Execution**: Execute independent subtasks concurrently
- **Result Synthesis**: Aggregate findings into comprehensive reports
- **Investigation Memory**: Learn from successful patterns and failures
- **Quality Assessment**: Automatic evaluation of investigation completeness

## ✨ Features

- 🧠 **Intelligent Planning**: Claude generates investigation plans based on topic complexity
- 🔄 **Dependency Management**: Respects task dependencies and executes in optimal order
- ⚡ **Parallel Execution**: Runs independent subtasks concurrently for speed
- 📊 **Comprehensive Synthesis**: Generates structured reports with findings and recommendations
- 💾 **Investigation Memory**: Learns from past investigations to improve future plans
- 📈 **Quality Metrics**: Tracks confidence, duration, and quality scores
- 🛡️ **Schema Validation**: Validates plans and results with Zod

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
npm run start:basic
```

## 💬 Usage Examples

Once the agent is running, try these research topics:

```
Tópico: Tendencias en desarrollo móvil 2024
🔍 Investigation Agent iniciado

📋 FASE 1: Planificación...
📋 FASE 2: Ejecución...
📋 FASE 3: Síntesis...

✅ Investigación completada!

═══════════════════════════════════════════════════════
📊 PLAN: Tendencias en Desarrollo Móvil 2024
═══════════════════════════════════════════════════════

📝 SUBTAREAS EJECUTADAS:
  1. [✓] Investigar frameworks y tecnologías emergentes
     Tipo: research | Duración: 234ms
  2. [✓] Analizar patrones de adopción y métricas
     Tipo: analysis | Duración: 189ms
  3. [✓] Sintetizar tendencias clave y predicciones
     Tipo: synthesis | Duración: 156ms

📊 SÍNTESIS:
───────────────────────────────────────────────────────
[Executive summary with key insights...]
───────────────────────────────────────────────────────

🔑 HALLAZGOS CLAVE:
  • React Native y Flutter dominan el desarrollo cross-platform
  • IA y ML se integran cada vez más en apps móviles
  • Progressive Web Apps ganan tracción empresarial

📈 METADATA:
  • Duración total: 612ms
  • Calidad: 9/10
  • Confianza: 10.0/10
  • Tools usadas: search, analyze, validate
```

Type `exit` to quit.

## 📁 Project Structure

```
02-agente-investigador/
├── src/
│   ├── agents/
│   │   └── research-agent.ts    # Plan-Execute-Synthesize implementation
│   └── index.ts                 # CLI entry point
├── .env.example                # Environment template
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # This file
```

## 🔧 How It Works

### 1. Planning Phase

The **PlanningEngine** asks Claude to analyze the topic and create an investigation plan:

```typescript
const plan = await this.planningEngine.createPlan(topic);
// Returns: { title, subtasks, dependencies }
```

Each subtask includes:
- **Type**: `research`, `analysis`, `synthesis`, or `validation`
- **Tools**: Which tools the subtask needs
- **Estimated Time**: Duration prediction
- **Success Criteria**: How to measure completion
- **Dependencies**: Which subtasks must finish first

### 2. Execution Phase

The **ExecutionEngine** executes subtasks respecting dependencies:

```typescript
const results = await this.executionEngine.executePlan(plan);
```

Key features:
- **Dependency Resolution**: Executes tasks only when dependencies are met
- **Parallel Execution**: Runs independent tasks concurrently
- **Tool Execution**: Simulates tools (search, analyze, validate)
- **Quality Assessment**: Evaluates each subtask's results
- **Error Handling**: Gracefully handles failures

### 3. Synthesis Phase

The **SynthesisEngine** generates a comprehensive report:

```typescript
const synthesis = await this.synthesisEngine.synthesizeResults(plan, executionResults);
```

The report includes:
- **Executive Summary**: 2-3 paragraph overview
- **Key Findings**: Bullet-pointed insights
- **Detailed Analysis**: Organized by subtask type
- **Conclusions**: Main takeaways
- **Recommendations**: Actionable next steps
- **Quality & Confidence**: Numeric assessments

### 4. Investigation Memory

The agent learns from each investigation:

```typescript
// Records successful patterns
this.memory.recordSuccessfulPattern(topic, plan, result);

// Records failures for future improvement
this.memory.recordFailure(topic, error, context);
```

This enables the agent to improve planning over time.

## 🎓 Key Concepts

### Plan-Execute-Synthesize Pattern

This three-phase pattern is ideal for complex tasks:

1. **Plan**: Break down the problem into smaller pieces
2. **Execute**: Solve each piece independently
3. **Synthesize**: Combine results into a coherent answer

Benefits:
- ✅ Handles complex topics systematically
- ✅ Maximizes parallelization opportunities
- ✅ Produces structured, comprehensive outputs
- ✅ Easier to debug and improve

### Dependency Graph

Subtasks can have three relationship types:

- **requires**: Task B must wait for Task A to complete
- **enhances**: Task B benefits from Task A but can run independently
- **parallel**: Tasks can run simultaneously

The execution engine automatically schedules tasks for optimal performance.

### Quality Assessment

Each investigation is evaluated on multiple dimensions:

- **Subtask Quality**: Individual task success rate
- **Synthesis Quality**: Completeness of final report
- **Confidence**: Percentage of successful subtasks
- **Overall Quality**: Aggregate score (0-10)

## 🔍 Tool System

The agent uses an extensible tool system:

```typescript
interface Tool {
  name: string;
  execute: (subtask: Subtask) => Promise<any>;
}
```

Built-in tools (simulated):
- **search**: Research information
- **analyze**: Process and analyze data
- **validate**: Verify findings

You can register custom tools:

```typescript
this.executionEngine.registerTool({
  name: 'custom-tool',
  execute: async (subtask) => {
    // Your tool logic here
    return { result: 'Tool output' };
  }
});
```

## 🛠️ Development

```bash
# Run in development mode with auto-reload
npm run dev

# Type-check without building
npm run typecheck

# Build the project
npm run build
```

## 🚀 Extending the Agent

### Add Real Web Search

Replace simulated tools with real APIs:

```typescript
const searchTool: Tool = {
  name: 'search',
  execute: async (subtask) => {
    const response = await fetch(`https://api.search.com/q=${subtask.description}`);
    return await response.json();
  }
};
```

### Persist Investigation Memory

Save learning patterns to disk:

```typescript
// In InvestigationMemory class
saveToFile() {
  fs.writeFileSync('memory.json', JSON.stringify({
    learnings: this.learnings,
    failurePatterns: this.failurePatterns
  }));
}
```

### Add More Subtask Types

Extend the type system:

```typescript
type: 'research' | 'analysis' | 'synthesis' | 'validation' | 'comparison' | 'prediction'
```

### Improve Planning with Examples

Provide Claude with successful plan examples:

```typescript
const prompt = `Here are successful plans from similar topics:
${pastSuccessfulPlans}

Now create a plan for: "${topic}"`;
```

## 📚 Next Steps

After completing this example:

1. **Integrate Real APIs**: Add web search, data fetching, or external tools
2. **Add MCP Servers**: Use Model Context Protocol for standardized tool integration
3. **Improve Memory**: Implement vector-based similarity search for learning patterns
4. **Move to [03-mcp-servers](../03-mcp-servers/)**: Learn about standardized tool protocols

## 📖 Additional Resources

- [Anthropic SDK Documentation](https://docs.anthropic.com/en/docs/)
- [Multi-Agent Patterns](https://www.anthropic.com/research/building-effective-agents)
- [Workshop Full Documentation](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/agente-investigador)

## 🤝 Contributing

Found a bug or want to improve this example? Contributions are welcome! Please check the main repository for contribution guidelines.

## 📄 License

MIT License - See LICENSE file for details

---

**Part of the Código Sin Siesta AI Agents & MCP Workshop**

[← Previous: Task Agent](../01-agente-tareas/) | [Back to Workshop](../) | [Next: MCP Servers →](../03-mcp-servers/)
