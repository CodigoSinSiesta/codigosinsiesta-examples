import { config } from 'dotenv';
import * as readline from 'readline';
import { TaskAgent } from './agents/task-agent';

// Cargar variables de entorno
config();

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
