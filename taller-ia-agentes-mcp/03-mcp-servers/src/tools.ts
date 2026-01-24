import { z } from 'zod';

// Tool definitions for MCP server
export const addTool = {
  name: 'add',
  description: 'Add two numbers together',
  parameters: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number')
  }),
  execute: async ({ a, b }: { a: number; b: number }) => {
    const result = a + b;
    return `Result: ${a} + ${b} = ${result}`;
  }
};

export const multiplyTool = {
  name: 'multiply',
  description: 'Multiply two numbers',
  parameters: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number')
  }),
  execute: async ({ a, b }: { a: number; b: number }) => {
    const result = a * b;
    return `Result: ${a} × ${b} = ${result}`;
  }
};

export const powerTool = {
  name: 'power',
  description: 'Calculate power (a^b)',
  parameters: z.object({
    base: z.number().describe('Base number'),
    exponent: z.number().describe('Exponent (integer)'),
    validate: z.boolean().optional().default(true).describe('Validate inputs')
  }),
  execute: async ({ base, exponent, validate }: { base: number; exponent: number; validate?: boolean }) => {
    if (validate && !Number.isInteger(exponent)) {
      throw new Error('Exponent must be an integer');
    }

    if (validate && exponent < 0) {
      throw new Error('Negative exponents not supported');
    }

    const result = Math.pow(base, exponent);
    return `Result: ${base}^${exponent} = ${result}`;
  }
};

// Resource: Historial de cálculos
export let calculationHistory: Array<{
  id: string;
  operation: string;
  result: number;
  description: string;
  timestamp: Date;
}> = [];

export const calculateTool = {
  name: 'calculate',
  description: 'Perform a calculation and store in history',
  parameters: z.object({
    expression: z.string().describe('Mathematical expression (e.g., "2 + 3 * 4")'),
    description: z.string().optional().describe('Description of the calculation')
  }),
  execute: async ({ expression, description }: { expression: string; description?: string }) => {
    try {
      // Evaluar expresión (en producción usa una librería segura)
      const result = eval(expression);

      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid calculation result');
      }

      // Registrar en historial
      const calculation = {
        id: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        operation: expression,
        result,
        description: description || expression,
        timestamp: new Date()
      };

      calculationHistory.push(calculation);

      // Mantener solo últimos 100 cálculos
      if (calculationHistory.length > 100) {
        calculationHistory = calculationHistory.slice(-100);
      }

      return `Calculation complete: ${expression} = ${result}\nID: ${calculation.id}\nHistory URI: calculator://history`;

    } catch (error) {
      throw new Error(`Calculation failed: ${(error as Error).message}`);
    }
  }
};

export const getHistoryTool = {
  name: 'get_history',
  description: 'Get calculation history',
  parameters: z.object({
    limit: z.number().min(1).max(50).optional().default(10).describe('Number of recent calculations to return'),
    operation: z.string().optional().describe('Filter by operation type')
  }),
  execute: async ({ limit, operation }: { limit?: number; operation?: string }) => {
    let filtered = calculationHistory;

    if (operation) {
      filtered = filtered.filter(calc =>
        calc.operation.includes(operation) ||
        calc.description.includes(operation)
      );
    }

    const recent = filtered.slice(-(limit || 10)).reverse();

    const historyText = recent.map(calc =>
      `${calc.id}: ${calc.operation} = ${calc.result} (${calc.timestamp.toISOString()})`
    ).join('\n');

    return `Calculation History (${filtered.length} total${operation ? ', filtered' : ''}):\n${historyText || 'No calculations found'}`;
  }
};
