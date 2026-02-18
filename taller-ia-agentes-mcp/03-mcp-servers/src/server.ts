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
  description: 'Sumar dos números',
  parameters: z.object({
    a: z.number().describe('Primer número'),
    b: z.number().describe('Segundo número')
  }),
  execute: async ({ a, b }) => {
    const result = a + b;
    return `Resultado: ${a} + ${b} = ${result}`;
  }
});

server.addTool({
  name: 'multiply',
  description: 'Multiplicar dos números',
  parameters: z.object({
    a: z.number().describe('Primer número'),
    b: z.number().describe('Segundo número')
  }),
  execute: async ({ a, b }) => {
    const result = a * b;
    return `Resultado: ${a} × ${b} = ${result}`;
  }
});

server.addTool({
  name: 'power',
  description: 'Calcular potencia (a^b)',
  parameters: z.object({
    base: z.number().describe('Número base'),
    exponent: z.number().describe('Exponente (entero)'),
    validate: z.boolean().optional().default(true).describe('Validar entradas')
  }),
  execute: async ({ base, exponent, validate }) => {
    if (validate && !Number.isInteger(exponent)) {
      throw new Error('El exponente debe ser un entero');
    }

    if (validate && exponent < 0) {
      throw new Error('Los exponentes negativos no están soportados');
    }

    const result = Math.pow(base, exponent);
    return `Resultado: ${base}^${exponent} = ${result}`;
  }
});

// Iniciar servidor
server.start({
  transportType: 'stdio'  // Comunicación via stdin/stdout
}).catch(console.error);
