import { config } from 'dotenv';
import * as readline from 'readline';
import { TaskAgent } from './agents/task-agent';

// Handle CLI arguments
const args = process.argv.slice(2);

// Show help information
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: npm run start:basic

Task Agent Quick Start Example

This example demonstrates a task management agent built with Claude AI.
The agent can help you:

  • Add tasks with descriptions
  • List all tasks
  • Mark tasks as complete

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
  const agent = new TaskAgent(process.env.ANTHROPIC_API_KEY!);

  console.log('🤖 Task Agent iniciado. Escribe tus comandos:\n');

  // Ejemplos de uso
  const examples = [
    'Añade una tarea para "Comprar leche"',
    'Lista todas las tareas',
    'Añade una tarea para "Hacer ejercicio" con descripción "Ir al gimnasio 3 veces por semana"',
    'Lista las tareas pendientes',
    'Completa la tarea con ID xxx' // Reemplaza con ID real
  ];

  console.log('Ejemplos de comandos:');
  examples.forEach(example => console.log(`  • "${example}"`));
  console.log('\nEscribe "exit" para salir.\n');

  // Bucle interactivo
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question('Tú: ', async (input: string) => {
      if (input.toLowerCase() === 'exit') {
        console.log('👋 ¡Hasta luego!');
        rl.close();
        return;
      }

      try {
        console.log('🤔 Pensando...');
        const response = await agent.execute(input);
        console.log(`🤖 ${response}\n`);
      } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : String(error));
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch(console.error);
