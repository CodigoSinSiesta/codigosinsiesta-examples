import { FastMCP } from 'fastmcp';
import { z } from 'zod';

// Handle CLI arguments
const args = process.argv.slice(2);

// Show help information
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: npm run start:basic

Calculator MCP Server Quick Start Example

This example demonstrates a Model Context Protocol (MCP) server built with Fast-MCP.
The server provides calculator tools that can be used by Claude Desktop and other
MCP clients.

Features:
  • Arithmetic operations: add, multiply, power
  • Expression evaluation: calculate mathematical expressions
  • Calculation history: track and retrieve past calculations
  • Resource exposure: access history as an MCP resource

Prerequisites:
  1. Node.js 20.0 or higher
  2. Run: npm install

To run the server:
  npm run start:basic

The server will start in STDIO mode, waiting for MCP protocol messages.
For interactive testing, use the MCP Inspector:

  npx @modelcontextprotocol/inspector npx -y tsx src/basic.ts

To integrate with Claude Desktop, add this to your config:

  {
    "mcpServers": {
      "calculator": {
        "command": "npx",
        "args": ["-y", "tsx", "/absolute/path/to/03-mcp-servers/src/basic.ts"]
      }
    }
  }
  `);
  process.exit(0);
}

// Create MCP server
const server = new FastMCP({
  name: 'calculator',
  version: '1.0.0'
});

// Define tools
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

// Start server with STDIO transport
console.log('🧮 Calculator MCP Server starting in STDIO mode...');
console.log('📡 Waiting for MCP client connection...\n');

server.start({
  transportType: 'stdio'
}).catch((error) => {
  console.error('❌ Error starting MCP server:', error);
  process.exit(1);
});
