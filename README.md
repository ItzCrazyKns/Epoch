# Epoch ✨

A **visual interface** for LLMs. Epoch transforms traditional text-based AI conversations into **interactive**, **component-driven** experiences. Every response is rendered as a **living interface** with **clickable elements**, **dynamic forms**, **live data visualizations**, and **explorable UI** - making LLM interactions intuitive, engaging, and truly visual.

![Epoch Screenshot](./.assets/screenshot.png)

## Motivation

Traditional LLM interactions are fundamentally constrained by their text-first nature. Even with static visualizations, users remain passive consumers of information with no mechanism for bidirectional interaction within the response itself.

Epoch eliminates this constraint through a structured component architecture. The LLM generates type-safe JSON schemas representing UI component trees, which are recursively rendered into fully interactive React interfaces. Each component - whether a data visualization, form input, or action button - maintains bidirectional state flow with the conversation context. User interactions are serialized back into the dialogue, enabling the LLM to build upon previous interface states and create truly stateful, explorable experiences.

This architecture transforms LLMs from text generators into interface compilers, where every response is a composable tree of interactive components rather than static markup.

## Features

- **25+ Interactive Components**: Complete UI primitives from layout containers (Flex, Grid, Hero) to data visualizations (Charts, Stats, Metrics) and form controls (Input, Select, Textarea)
- **Real-time Streaming**: Server-Sent Events stream partial object updates as the LLM generates component trees, with progressive rendering on the client
- **Stateful Conversational Context**: All user interactions (button clicks, form submissions, card selections) are serialized and fed back into the conversation history
- **Recursive Rendering Engine**: UIRenderer recursively traverses component trees, maintaining form state and action handlers through the entire tree depth
- **Integrated Search**: Pluggable search layer with privacy-friendly SearxNG support or Serper API integration for real-time web and image search directly within generated interfaces
- **Local LLM Support**: Run completely offline with Ollama integration - no API costs, full privacy, and support for Llama, Mistral, Qwen, and other open-source models

## Available Components

Epoch supports a wide range of UI components:

- **Layout**: Flex, Grid, Card, Hero, Separator
- **Content**: Text, Image, List, CodeBlock, Gallery
- **Data Visualization**: Chart, Stats, Metric, Progress, Badge
- **Interactive**: Button, Input, Textarea, Select, Accordion, Tabs
- **Specialized**: Timeline, Comparison, Feature, Alert

## How It Works

1. **Message Ingestion**: User input is appended to the conversation history and sent to the API route
2. **Structured Output Generation**: The backend invokes the LLM with a recursive Zod schema using `z.lazy()` for self-referential component definitions, enforcing type-safe JSON generation
3. **Server-Sent Events (SSE) Streaming**: Partial JSON objects stream back via SSE as the LLM generates tokens, with the schema validator ensuring structural integrity at each chunk
4. **Recursive Component Rendering**: `UIRenderer` uses discriminated union pattern matching to recursively traverse the component tree, instantiating React renderers for each node while propagating action handlers and form state
5. **Bidirectional State Flow**: User interactions (button actions, form inputs) are serialized into natural language descriptions and appended to conversation history, maintaining stateful context
6. **Search Integration**: Components with `imageQuery` or `searchQuery` fields trigger async calls to SearxNG or Serper (based on configuration) for real-time web/image search, with results cached in-memory
7. **Stateful Re-generation**: The LLM processes interaction context and generates new component trees, creating iterative, explorable interfaces across conversation turns

## Installation

### Prerequisites

- Node.js 18+
- **One of the following**:
  - OpenAI API key (for cloud-based models)
  - [Ollama](https://ollama.ai) installed locally (for local LLMs - **recommended for privacy and cost savings**)
- Search provider (configure at least one):
  - SearxNG instance URL (self-hosted or hosted) for privacy-focused meta search
  - Serper API key from [serper.dev](https://serper.dev) for Google-powered search

### Setup

<!-- markdownlint-disable MD029 -->

1. Clone the repository:

```bash
git clone https://github.com/itzcrazykns/epoch.git
cd epoch
```

2. Rename the environment file and configure it:

```bash
# On Windows
ren .env.example .env

# On macOS/Linux
mv .env.example .env
```

3. Open `.env` and configure your setup:

#### Option A: Using Ollama (Local, Private, Free)

```env
....
MODEL_NAME=llama3.2:3b
USE_OLLAMA=true
OLLAMA_API_URL=http://localhost:11434/api
...
```

#### Option B: Using OpenAI (Cloud-based)

```env
...
MODEL_NAME=gpt-5-mini

USE_OPENAI=true
OPENAI_API_KEY=your_api_key_here
...
```


#### Search Provider (Required — configure one)

Provide values for the provider you plan to use (leave the other blank).

```env
SEARXNG_API_URL= # Set to your SearxNG instance URL (e.g., http://localhost:8080)
SERPER_API_KEY= # Set to your Serper API key
```

4. Install dependencies:

```bash
npm install
```

5. Build the project:

```bash
npm run build
```

6. Start the application:

```bash
npm run start
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

<!-- markdownlint-enable MD029 -->

## Development

To run in development mode with hot reload:

```bash
npm run dev
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **AI**: Vercel AI SDK
- **Charts**: Recharts
- **Schema Validation**: Zod

## Roadmap

### 🚧 In Progress

- **More Components**
  - Data tables with sorting/filtering/pagination
  - Calendar and date picker components
  - Map integration for location-based interfaces
  - Video and audio players
  - File upload and preview
  - Drag-and-drop interfaces

- **Extended Model Support**
  - LM Studio integration
  - Custom model endpoints
  - Anthropic Claude support
  - Google Gemini integration

- **Web Search Integration**
  - Automatic source citations
  - Live content scraping capabilities

- **Enhanced UI/UX**
  - Dark mode support
  - Custom theme engine
  - Animation presets
  - Better accessibility (WCAG 2.1 AA compliance)
  - Mobile-responsive optimizations
  - Multi-language support

### 🔮 Future Plans

- **Multi-modal Support**
  - Image upload and vision analysis
  - Voice input/output integration
  - PDF document parsing and interaction

- **Advanced Features**
  - Multi-agent orchestration
  - Conversation memory and context persistence
  - User authentication and profiles
  - Conversation sharing and export
  - Export interfaces to React/Vue/HTML

- **Developer Experience**
  - Custom component SDK
  - Plugin system for extensions
  - Visual component builder
  - Live playground and documentation

## Contributing

Contributions are highly encouraged! Epoch is built to be extensible and community driven. Here's how you can contribute:

### Ways to Contribute

- **🐛 Bug Reports**: Found an issue? Open a detailed bug report with reproduction steps
- **💡 Feature Requests**: Have ideas for new components or capabilities? Share them in discussions
- **🔧 Pull Requests**: Submit PRs for bug fixes, new components, or performance improvements
- **📖 Documentation**: Help improve docs, add examples, or create tutorials
- **🎨 Component Development**: Build new UI component renderers or extend existing ones

### Development Guidelines

1. Fork the repository and create a feature branch
2. Follow the existing code structure and TypeScript conventions
3. Add new components to `src/components/llm-components/`
4. Update the Zod schema in `src/app/api/generate/route.ts` for new component types
5. Test thoroughly with different LLM outputs
6. Submit a PR with clear description and examples

For major changes, please open an issue first to discuss the proposed changes.

## Support

Need help or want to connect?

- **📧 Email**: `kushagra20103[at]gmail.com`
- **💬 Discord**: `itzcrazykns`
- **🐛 Issues**: [GitHub Issues](https://github.com/itzcrazykns/epoch/issues) for bug reports and feature requests
- **💭 Discussions**: [GitHub Discussions](https://github.com/itzcrazykns/epoch/discussions) for questions and ideas

---

The project is built with passion to make AI conversations truly interactive. If you like Epoch, consider giving it a ⭐ on GitHub!
