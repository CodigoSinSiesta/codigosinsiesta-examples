import { z } from 'zod';

// Tool definitions for MCP server
export const addTool = {
  name: 'add',
  description: 'Sumar dos números',
  parameters: z.object({
    a: z.number().describe('Primer número'),
    b: z.number().describe('Segundo número')
  }),
  execute: async ({ a, b }: { a: number; b: number }) => {
    const result = a + b;
    return `Resultado: ${a} + ${b} = ${result}`;
  }
};

export const multiplyTool = {
  name: 'multiply',
  description: 'Multiplicar dos números',
  parameters: z.object({
    a: z.number().describe('Primer número'),
    b: z.number().describe('Segundo número')
  }),
  execute: async ({ a, b }: { a: number; b: number }) => {
    const result = a * b;
    return `Resultado: ${a} × ${b} = ${result}`;
  }
};

export const powerTool = {
  name: 'power',
  description: 'Calcular potencia (a^b)',
  parameters: z.object({
    base: z.number().describe('Número base'),
    exponent: z.number().describe('Exponente (entero)'),
    validate: z.boolean().optional().default(true).describe('Validar entradas')
  }),
  execute: async ({ base, exponent, validate }: { base: number; exponent: number; validate?: boolean }) => {
    if (validate && !Number.isInteger(exponent)) {
      throw new Error('El exponente debe ser un entero');
    }

    if (validate && exponent < 0) {
      throw new Error('Los exponentes negativos no están soportados');
    }

    const result = Math.pow(base, exponent);
    return `Resultado: ${base}^${exponent} = ${result}`;
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
  description: 'Realizar un cálculo y guardarlo en el historial',
  parameters: z.object({
    expression: z.string().describe('Expresión matemática (ej: "2 + 3 * 4")'),
    description: z.string().optional().describe('Descripción del cálculo')
  }),
  execute: async ({ expression, description }: { expression: string; description?: string }) => {
    try {
      // Evaluar expresión (en producción usa una librería segura)
      const result = eval(expression);

      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Resultado de cálculo inválido');
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

      return `Cálculo completado: ${expression} = ${result}\nID: ${calculation.id}\nURI del historial: calculator://history`;

    } catch (error) {
      throw new Error(`Error en el cálculo: ${(error as Error).message}`);
    }
  }
};

export const getHistoryTool = {
  name: 'get_history',
  description: 'Obtener historial de cálculos',
  parameters: z.object({
    limit: z.number().min(1).max(50).optional().default(10).describe('Número de cálculos recientes a devolver'),
    operation: z.string().optional().describe('Filtrar por tipo de operación')
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

    return `Historial de cálculos (${filtered.length} total${operation ? ', filtrado' : ''}):\n${historyText || 'No se encontraron cálculos'}`;
  }
};
