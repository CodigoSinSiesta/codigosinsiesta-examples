# 03 - Servidor MCP de Calculadora

Un servidor Model Context Protocol (MCP) que proporciona herramientas de calculadora y recursos de historial de cálculos. Este ejemplo demuestra cómo construir un servidor MCP usando Fast-MCP que puede integrarse con Claude Desktop y otros clientes MCP.

## 🎯 Lo Que Aprenderás

- **Arquitectura de Servidor MCP**: Cómo construir un servidor que expone herramientas a clientes de IA
- **Framework Fast-MCP**: Uso de Fast-MCP para desarrollo rápido de servidores
- **Definición de Herramientas**: Crear herramientas con validación de esquema usando Zod
- **Gestión de Recursos**: Exponer el historial de cálculos como un recurso
- **Transporte STDIO**: Comunicarse con clientes a través de entrada/salida estándar
- **Manejo de Errores**: Validar entradas y manejar errores de cálculo

## ✨ Características

- 🧮 **Aritmética Básica**: Operaciones de suma, multiplicación y potencia
- 📊 **Calculadora de Expresiones**: Evaluar expresiones matemáticas complejas
- 📝 **Historial de Cálculos**: Almacenar y recuperar cálculos anteriores
- 🔍 **Filtrado de Historial**: Buscar cálculos por tipo de operación
- 🛡️ **Validación de Entrada**: Validación de esquema con Zod
- 📦 **Exposición de Recursos**: Historial accesible como recurso MCP

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 20.0 o superior
- npm o yarn
- Claude Desktop u otro cliente compatible con MCP

### Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Configura el entorno (opcional):
   ```bash
   cp .env.example .env
   ```

### Ejecutar el Servidor

**Modo rápido** (ejemplo básico):
```bash
npm run start:basic
```

**Modo completo** (todas las herramientas):
```bash
npm start
```

**Modo de desarrollo** con recarga automática:
```bash
npm run dev
```

## 🔌 Integración con Claude Desktop

Para usar este servidor MCP con Claude Desktop, agrégalo a tu archivo de configuración:

### macOS/Linux

Edita `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "node",
      "args": [
        "/ruta/absoluta/a/03-mcp-servers/dist/server.js"
      ]
    }
  }
}
```

### Windows

Edita `%APPDATA%\Claude\claude_desktop_config.json` con la misma estructura.

### Usando tsx en lugar de compilar

Para desarrollo, puedes usar tsx directamente:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "/ruta/absoluta/a/03-mcp-servers/src/server.ts"
      ]
    }
  }
}
```

Después de actualizar la configuración, reinicia Claude Desktop.

## 💬 Herramientas Disponibles

### 1. add

Suma dos números.

**Parámetros:**
- `a` (number): Primer número
- `b` (number): Segundo número

**Ejemplo:**
```
Resultado: 5 + 3 = 8
```

### 2. multiply

Multiplica dos números.

**Parámetros:**
- `a` (number): Primer número
- `b` (number): Segundo número

**Ejemplo:**
```
Resultado: 4 × 6 = 24
```

### 3. power

Calcula la potencia (a^b).

**Parámetros:**
- `base` (number): Número base
- `exponent` (number): Exponente (debe ser entero)
- `validate` (boolean, opcional): Habilitar validación de entrada (predeterminado: true)

**Ejemplo:**
```
Resultado: 2^8 = 256
```

### 4. calculate

Evalúa una expresión matemática y la guarda en el historial.

**Parámetros:**
- `expression` (string): Expresión matemática (ej., "2 + 3 * 4")
- `description` (string, opcional): Descripción del cálculo

**Devuelve:**
- Resultado del cálculo
- ID único del cálculo
- URI del recurso del historial

**Ejemplo:**
```
Expresión: (5 + 3) * 2 - 4
Resultado: 12
ID: calc_1234567890_abcdef123
```

### 5. get_history

Recupera el historial de cálculos.

**Parámetros:**
- `limit` (number, opcional): Número de cálculos recientes (1-50, predeterminado: 10)
- `operation` (string, opcional): Filtrar por tipo de operación

**Devuelve:**
- Array de cálculos recientes
- Conteo total
- Estado del filtro

## 📁 Estructura del Proyecto

```
03-mcp-servers/
├── src/
│   ├── server.ts             # Implementación principal del servidor MCP
│   └── tools.ts              # Definiciones y lógica de herramientas
├── .env.example              # Plantilla de entorno
├── package.json              # Dependencias
├── tsconfig.json             # Configuración de TypeScript
└── README.md                 # Este archivo
```

## 🔧 Cómo Funciona

### 1. Inicialización del Servidor MCP

El servidor se crea usando Fast-MCP:

```typescript
const server = new FastMCP({
  name: 'calculator',
  version: '1.0.0',
  description: 'A calculator MCP server with basic arithmetic operations'
});
```

### 2. Registro de Herramientas

Las herramientas se registran con validación de esquema:

```typescript
server.addTool({
  name: 'add',
  description: 'Add two numbers together',
  parameters: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number')
  }),
  execute: async ({ a, b }) => {
    const result = a + b;
    return {
      result,
      operation: `${a} + ${b} = ${result}`
    };
  }
});
```

### 3. Comunicación STDIO

El servidor usa transporte STDIO para comunicarse con clientes MCP:

```typescript
server.start({
  transport: 'stdio'  // Comunicación de entrada/salida estándar
}).catch(console.error);
```

### 4. Gestión de Estado

El historial de cálculos se almacena en memoria:

```typescript
export let calculationHistory: Array<{
  id: string;
  operation: string;
  result: number;
  timestamp: Date;
}> = [];
```

**Nota:** En producción, considera persistir en una base de datos.

## 🎓 Conceptos Clave

### Protocolo MCP

El Model Context Protocol (MCP) permite que las aplicaciones de IA:
- **Descubran Herramientas**: Los clientes pueden listar las herramientas disponibles
- **Ejecuten Herramientas**: Invocar herramientas con parámetros validados
- **Accedan a Recursos**: Recuperar datos como el historial de cálculos
- **Comunicación Bidireccional**: STDIO permite mensajes bidireccionales

### Framework Fast-MCP

Fast-MCP simplifica el desarrollo de servidores MCP:
- **Type-Safe**: Soporte completo de TypeScript con validación Zod
- **Ligero**: Sobrecarga mínima y inicio rápido
- **Compatible con Estándares**: Sigue la especificación MCP
- **Integración Fácil**: Funciona con Claude Desktop y otros clientes

### Validación de Esquema de Herramientas

Los esquemas Zod aseguran seguridad de tipos y mensajes de error claros:

```typescript
parameters: z.object({
  base: z.number().describe('Base number'),
  exponent: z.number().describe('Exponent (integer)'),
  validate: z.boolean().optional().default(true)
})
```

## 🔍 Probar el Servidor

### Pruebas Manuales

1. Inicia el servidor en modo de desarrollo:
   ```bash
   npm run dev
   ```

2. El servidor esperará mensajes del protocolo MCP en stdin

3. Prueba con Claude Desktop o usa la herramienta MCP Inspector

### Usando MCP Inspector

Instala el MCP Inspector para pruebas interactivas:

```bash
npx @modelcontextprotocol/inspector node src/server.ts
```

Esto abre una interfaz web donde puedes:
- Navegar por las herramientas disponibles
- Probar la ejecución de herramientas
- Ver el historial de cálculos
- Inspeccionar mensajes de solicitud/respuesta

## 🛠️ Desarrollo

```bash
# Ejecutar en modo de desarrollo con recarga automática
npm run dev

# Verificación de tipos sin compilar
npm run typecheck

# Compilar el proyecto
npm run build
```

## 🚨 Notas Importantes

### Consideraciones de Seguridad

La herramienta `calculate` usa `eval()` para fines de demostración. **En producción:**

- ❌ **Nunca uses eval()** con entrada de usuario
- ✅ Usa un analizador de expresiones seguro como [math.js](https://mathjs.org/) o [expr-eval](https://www.npmjs.com/package/expr-eval)

### Limitaciones de Memoria

- El historial se almacena en memoria y está limitado a 100 cálculos
- Los datos se pierden cuando se reinicia el servidor
- Para producción, usa una base de datos como SQLite, PostgreSQL o MongoDB

## 📚 Próximos Pasos

Después de completar este ejemplo:

1. **Añade más herramientas**: Implementa operaciones de resta, división, módulo
2. **Almacenamiento persistente**: Guarda el historial en una base de datos
3. **Características avanzadas**: Añade soporte para funciones científicas (sin, cos, log)
4. **Recursos**: Exponer estadísticas de cálculos como recursos MCP
5. **Manejo de errores**: Mejorar la validación y los mensajes de error
6. **Ir al siguiente ejemplo**: Explorar patrones más complejos de servidor MCP

## 📖 Recursos Adicionales

- [Documentación de Model Context Protocol](https://modelcontextprotocol.io/)
- [Repositorio GitHub de Fast-MCP](https://github.com/punkpeye/fast-mcp)
- [Especificación MCP](https://spec.modelcontextprotocol.io/)
- [Guía de MCP de Claude Desktop](https://docs.anthropic.com/claude/docs/model-context-protocol)
- [Documentación Completa del Taller](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/mcp-servers)

## 🤝 Contribuir

¿Encontraste un error o quieres mejorar este ejemplo? ¡Las contribuciones son bienvenidas! Por favor, consulta el repositorio principal para las pautas de contribución.

## 📄 Licencia

Licencia MIT - Ver archivo LICENSE para detalles

---

**Parte del Taller de Agentes de IA y MCP de Código Sin Siesta**

[← Volver al Taller](../) | [← Anterior: Agente de Investigación](../02-agente-investigador/)
