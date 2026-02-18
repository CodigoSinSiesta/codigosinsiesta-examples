# Taller: Agentes de IA y Model Context Protocol

Esta sección contiene ejemplos de código funcionales completos de nuestro taller de Agentes de IA y Model Context Protocol. Cada ejemplo se basa en conceptos anteriores, guiándote a través de la creación de agentes inteligentes usando Claude y MCP.

## 📚 Ejemplos

### [01-agente-tareas](./01-agente-tareas/) - Agente de Gestión de Tareas
Construye un agente de gestión de tareas con capacidades de memoria. Aprende a:
- Crear herramientas estructuradas para operaciones CRUD de tareas
- Implementar memoria y contexto del agente
- Manejar interacciones de usuario con Claude

### [02-agente-investigador](./02-agente-investigador/) - Agente de Investigación
Desarrolla un agente de investigación que puede buscar en la web y sintetizar información. Temas cubiertos:
- Integración de búsqueda web
- Síntesis de información
- Razonamiento de múltiples pasos

### [03-mcp-servers](./03-mcp-servers/) - Implementación de Servidor MCP
Crea tu propio servidor Model Context Protocol. Aprenderás:
- Arquitectura y estándares de MCP
- Configuración y puesta en marcha del servidor
- Registro y manejo de herramientas

## 🚀 Comenzando

Cada directorio de ejemplo contiene:
- **README.md** con instrucciones detalladas de configuración
- **package.json** con todas las dependencias
- **.env.example** con las variables de entorno requeridas
- Código fuente completo y ejecutable

### Requisitos Previos

- Node.js 20.0 o superior
- npm o yarn
- Clave de API de Anthropic (obtén una en https://console.anthropic.com)

### Inicio Rápido

1. Navega a un ejemplo:
   ```bash
   cd 01-agente-tareas
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el entorno:
   ```bash
   cp .env.example .env
   # Edita .env y añade tus claves de API
   ```

4. Ejecuta el ejemplo:
   ```bash
   npm start
   ```

## 📖 Documentación

Para explicaciones detalladas y tutoriales paso a paso, visita:
- [Visión General del Taller](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/)
- [Tutorial del Agente de Tareas](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/agente-tareas)
- [Tutorial del Agente de Investigación](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/agente-investigador)
- [Tutorial de Servidores MCP](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/mcp-servers)

## 💡 Ruta de Aprendizaje

Recomendamos seguir los ejemplos en orden:

1. **Comienza con el Agente de Tareas** para entender la estructura básica del agente y las herramientas
2. **Pasa al Agente de Investigación** para aprender sobre integraciones externas
3. **Termina con Servidores MCP** para entender la capa del protocolo

Cada ejemplo incluye comentarios en línea y documentación para guiarte a través del código.

## 🤝 ¿Necesitas Ayuda?

- Consulta la [documentación](https://codigosinsiesta.com/docs)
- Revisa el README en cada directorio de ejemplo
- Abre un issue si encuentras errores o tienes preguntas

¡Feliz programación! 🎉
