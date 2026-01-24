import { FastMCP } from 'fastmcp';
import { z } from 'zod';

// Crear servidor MCP
const server = new FastMCP({
  name: 'calculator',
  version: '1.0.0'
});

// Definir tools
server.addTool({
  name: 'add',
  description: 'Add two numbers together',
  parameters: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number')
  }),
  execute: async ({ a, b }) => {
    const result = a + b;
    return `Result: ${a} + ${b} = ${result}`;
  }
});

server.addTool({
  name: 'multiply',
  description: 'Multiply two numbers',
  parameters: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number')
  }),
  execute: async ({ a, b }) => {
    const result = a * b;
    return `Result: ${a} × ${b} = ${result}`;
  }
});

server.addTool({
  name: 'power',
  description: 'Calculate power (a^b)',
  parameters: z.object({
    base: z.number().describe('Base number'),
    exponent: z.number().describe('Exponent (integer)'),
    validate: z.boolean().optional().default(true).describe('Validate inputs')
  }),
  execute: async ({ base, exponent, validate }) => {
    if (validate && !Number.isInteger(exponent)) {
      throw new Error('Exponent must be an integer');
    }

    if (validate && exponent < 0) {
      throw new Error('Negative exponents not supported');
    }

    const result = Math.pow(base, exponent);
    return `Result: ${base}^${exponent} = ${result}`;
  }
});

// Iniciar servidor
server.start({
  transportType: 'stdio'  // Comunicación via stdin/stdout
}).catch(console.error);
