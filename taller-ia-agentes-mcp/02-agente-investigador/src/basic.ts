import { config } from 'dotenv';
import * as readline from 'readline';
import { InvestigationAgent } from './agents/research-agent';

// Handle CLI arguments
const args = process.argv.slice(2);

// Show help information
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: npm run start:basic

Investigation Agent Quick Start Example

This example demonstrates a research agent built with Claude AI
using the Plan-Execute-Synthesize pattern. The agent can help you:

  • Investigate complex topics
  • Break down research into structured subtasks
  • Analyze and synthesize findings
  • Generate comprehensive reports

Prerequisites:
  1. Set ANTHROPIC_API_KEY in .env file
  2. Run: npm install

To run the example:
  npm run start:basic
  `);
  process.exit(0);
}

// Load environment variables
config();

// Validate API key
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ Error: ANTHROPIC_API_KEY not found in .env file');
  console.error('\nPlease create a .env file with your API key:');
  console.error('  echo "ANTHROPIC_API_KEY=your_key_here" > .env');
  console.error('\nOr run the setup script from the repository root:');
  console.error('  bash ../../scripts/setup.sh\n');
  process.exit(1);
}

// Main example
async function main() {
  const agent = new InvestigationAgent(process.env.ANTHROPIC_API_KEY!);

  console.log('🔍 Investigation Agent iniciado. Escribe un tópico para investigar:\n');

  // Ejemplos de uso
  const examples = [
    'Tendencias en desarrollo móvil 2024',
    'Impacto de la IA en el desarrollo de software',
    'Mejores prácticas en arquitectura de microservicios',
    'Estado actual de TypeScript en 2024'
  ];

  console.log('Ejemplos de tópicos para investigar:');
  examples.forEach(example => console.log(`  • "${example}"`));
  console.log('\nEscribe "exit" para salir.\n');

  // Bucle interactivo
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question('Tópico: ', async (input: string) => {
      if (input.toLowerCase() === 'exit') {
        console.log('👋 ¡Hasta luego!');
        rl.close();
        return;
      }

      if (!input.trim()) {
        console.log('⚠️  Por favor ingresa un tópico válido.\n');
        askQuestion();
        return;
      }

      try {
        console.log('\n📋 FASE 1: Planificación...');
        const result = await agent.investigate(input);

        console.log('\n✅ Investigación completada!\n');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`📊 PLAN: ${result.plan.title}`);
        console.log('═══════════════════════════════════════════════════════\n');

        console.log('📝 SUBTAREAS EJECUTADAS:');
        result.plan.subtasks.forEach((subtask, index) => {
          const execResult = result.execution.find(e => e.subtaskId === subtask.id);
          const status = execResult?.success ? '✓' : '✗';
          const duration = execResult?.duration || 0;
          console.log(`  ${index + 1}. [${status}] ${subtask.description}`);
          console.log(`     Tipo: ${subtask.type} | Duración: ${duration}ms`);
        });

        console.log('\n📊 SÍNTESIS:');
        console.log('───────────────────────────────────────────────────────');
        console.log(result.synthesis.summary);
        console.log('───────────────────────────────────────────────────────\n');

        if (result.synthesis.findings.length > 0) {
          console.log('🔑 HALLAZGOS CLAVE:');
          result.synthesis.findings.forEach(finding => {
            console.log(`  • ${finding}`);
          });
          console.log('');
        }

        console.log('📈 METADATA:');
        console.log(`  • Duración total: ${result.metadata.duration}ms`);
        console.log(`  • Calidad: ${result.metadata.quality}/10`);
        console.log(`  • Confianza: ${result.synthesis.confidence.toFixed(1)}/10`);
        console.log(`  • Tools usadas: ${result.metadata.toolsUsed.join(', ') || 'Ninguna'}`);
        console.log('\n═══════════════════════════════════════════════════════\n');

      } catch (error) {
        console.error('❌ Error durante la investigación:', (error as Error).message);
        console.log('');
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch(console.error);
