# Código Sin Siesta - Repositorio de Ejemplos

¡Bienvenido al repositorio de código complementario para [Código Sin Siesta](https://codigosinsiesta.com)! 🚀

Este repositorio contiene todos los ejemplos de código funcionales de nuestra documentación y publicaciones del blog. Cada ejemplo está organizado por tema con instrucciones completas de configuración, dependencias y código ejecutable.

## 📑 Tabla de Contenidos

- [Qué Contiene](#-qué-contiene)
  - [Taller de Agentes de IA y MCP](#-taller-de-agentes-de-ia-y-mcp)
  - [Arquitectura de IA](#️-arquitectura-de-ia)
  - [Herramientas y Utilidades](#-herramientas-y-utilidades)
- [Inicio Rápido](#-inicio-rápido-5-minutos)
- [Documentación](#-documentación)
- [Requisitos Previos](#-requisitos-previos)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Enlaces](#-enlaces)

## 📚 Qué Contiene

Todos los ejemplos están organizados por tema para coincidir con la estructura de la documentación:

### 🤖 Taller de Agentes de IA y MCP

Ejemplos completos de nuestro taller de Agentes de IA y Model Context Protocol:

- **[01-agente-tareas](./taller-ia-agentes-mcp/01-agente-tareas/)** - Agente de gestión de tareas con memoria
- **[02-agente-investigador](./taller-ia-agentes-mcp/02-agente-investigador/)** - Agente de investigación con búsqueda web
- **[03-mcp-servers](./taller-ia-agentes-mcp/03-mcp-servers/)** - Implementación del servidor Model Context Protocol

📖 **[Ver Guía del Taller →](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/)**

### 🏗️ Arquitectura de IA

Ejemplos que demuestran patrones de arquitectura de sistemas de IA y mejores prácticas para sistemas de producción.

**[Ver Ejemplos de Arquitectura de IA →](./arquitectura-ia/)**

Temas cubiertos:
- Patrones de orquestación de agentes
- Gestión y versionado de prompts
- Manejo de errores y estrategias de reintentos
- Técnicas de optimización de costos
- Monitoreo de rendimiento

### 🔧 Herramientas y Utilidades

Implementaciones de herramientas prácticas, utilidades y bibliotecas auxiliares para el desarrollo de IA.

**[Explorar Herramientas y Utilidades →](./herramientas/)**

Incluye:
- Herramientas de CLI para flujos de trabajo de IA
- Bibliotecas auxiliares reutilizables
- Scripts de integración
- Utilidades de desarrollo

## 🚀 Inicio Rápido (5 Minutos)

### Requisitos Previos

- **Node.js** 20.0 o superior
- **npm** o **yarn** como gestor de paquetes
- **Git** para clonar el repositorio
- **Claves de API** para servicios de IA (Anthropic, OpenAI, etc.) - los requisitos específicos se indican en cada ejemplo

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/codigosinsiesta/codigosinsiesta-examples.git
   cd codigosinsiesta-examples
   ```

2. Navega a un ejemplo (por ejemplo, Agente de Gestión de Tareas):
   ```bash
   cd taller-ia-agentes-mcp/01-agente-tareas
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita .env y añade tus claves de API
   ```

5. Ejecuta el ejemplo:
   ```bash
   npm start
   ```

¡Eso es todo! Ya estás listo para explorar los ejemplos.

## 📁 Estructura del Repositorio

Cada directorio de ejemplo contiene:

- **README.md** - Instrucciones de configuración y explicación detallada
- **package.json** - Dependencias y scripts
- **.env.example** - Plantilla de variables de entorno requeridas
- **Código fuente** - Listo para ejecutar

## 📁 Estructura del Repositorio

```
codigosinsiesta-examples/
├── taller-ia-agentes-mcp/      # Taller de Agentes de IA y MCP
│   ├── 01-agente-tareas/       # Agente de Gestión de Tareas
│   ├── 02-agente-investigador/ # Agente de Investigación
│   └── 03-mcp-servers/         # Implementación del Servidor MCP
├── arquitectura-ia/            # Patrones de Arquitectura de IA
└── herramientas/               # Herramientas y Utilidades
```

## 📖 Documentación

Para explicaciones detalladas y tutoriales, visita:

- **[Sitio Principal](https://codigosinsiesta.com)** - Página de inicio y últimas actualizaciones
- **[Documentación](https://codigosinsiesta.com/docs)** - Documentación técnica completa
- **[Taller de Agentes de IA](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/)** - Guía del taller y tutoriales
- **[Arquitectura de IA](https://codigosinsiesta.com/docs/categoria/arquitectura-ia)** - Patrones de arquitectura y mejores prácticas
- **[Herramientas y Utilidades](https://codigosinsiesta.com/docs/categoria/herramientas)** - Guías de desarrollo de herramientas
- **[Blog](https://codigosinsiesta.com/blog)** - Últimos artículos y actualizaciones

## 💡 Requisitos Previos

La mayoría de los ejemplos requieren:

- **Node.js** 20.0 o superior
- **npm** o **yarn** como gestor de paquetes
- **Claves de API** para servicios de IA (Anthropic, OpenAI, etc.)

Los requisitos específicos se indican en el README de cada ejemplo.

## ❓ ¿Necesitas Ayuda?

- **¿Preguntas?** Consulta primero la [documentación](https://codigosinsiesta.com/docs)
- **¿Problemas?** Abre un [issue](https://github.com/codigosinsiesta/codigosinsiesta-examples/issues) en GitHub
- **¿Sugerencias?** ¡Nos encantaría escuchar tus ideas!

## 🤝 Contribuir

¿Encontraste un error o quieres mejorar un ejemplo? ¡Las contribuciones son bienvenidas!

1. Haz un fork de este repositorio
2. Crea una rama de características
3. Realiza tus cambios
4. Envía un pull request

Asegúrate de que tu código siga los patrones existentes e incluya la documentación adecuada.

## 📝 Licencia

Licencia MIT - ¡siéntete libre de usar estos ejemplos en tus propios proyectos!

## 🔗 Enlaces

- [Sitio Web de Código Sin Siesta](https://codigosinsiesta.com)
- [Documentación](https://codigosinsiesta.com/docs)
- [Blog](https://codigosinsiesta.com/blog)

---

¡Feliz programación! 🎉
