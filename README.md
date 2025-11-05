# Epoch ✨

A visual interface for LLMs. Epoch transforms traditional text-based AI conversations into interactive, component-driven experiences. Every response is rendered as a living interface with clickable elements, dynamic forms, live data visualizations, and explorable UI - making LLM interactions intuitive, engaging, and truly visual.

![Epoch Screenshot](./.assets/screenshot.png)

## Motivation

Traditional LLM interactions are fundamentally constrained by their text-first nature. Even with static visualizations, users remain passive consumers of information with no mechanism for bidirectional interaction within the response itself.

Epoch eliminates this constraint through a structured component architecture. The LLM generates type-safe JSON schemas representing UI component trees, which are recursively rendered into fully interactive React interfaces. Each component—whether a data visualization, form input, or action button—maintains bidirectional state flow with the conversation context. User interactions are serialized back into the dialogue, enabling the LLM to build upon previous interface states and create truly stateful, explorable experiences.

This architecture transforms LLMs from text generators into interface compilers, where every response is a composable tree of interactive components rather than static markup.

## Features

- **25+ Interactive Components**: Complete UI primitives from layout containers (Flex, Grid, Hero) to data visualizations (Charts, Stats, Metrics) and form controls (Input, Select, Textarea)
- **Real-time Streaming**: Server-Sent Events stream partial object updates as the LLM generates component trees, with progressive rendering on the client
- **Stateful Conversational Context**: All user interactions (button clicks, form submissions, card selections) are serialized and fed back into the conversation history
- **Recursive Rendering Engine**: UIRenderer recursively traverses component trees, maintaining form state and action handlers through the entire tree depth
- **Integrated Search**: Serper API integration for real-time web search and image retrieval directly within generated interfaces

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
6. **Search Integration**: Components with `imageQuery` or `searchQuery` fields trigger async Serper API calls for real-time web/image search, with results cached in-memory
7. **Stateful Re-generation**: The LLM processes interaction context and generates new component trees, creating iterative, explorable interfaces across conversation turns

## Installation

### Prerequisites

- Node.js 18+ and Yarn
- LLM API key (currently supports OpenAI)
- Serper API key from [serper.dev](https://serper.dev) for web and image search capabilities

### Setup

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

3. Open `.env` and fill in your API keys as written in the file:
```env
OPENAI_API_KEY=your_api_key_here
SERPER_API_KEY=your_serper_api_key_here  # Get from serper.dev
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

- **Local Model Support**
  - Ollama integration for local LLMs
  - LM Studio support
  - Custom model endpoints
  - Offline-first architecture

- **Web Search Integration**
  - SearXNG support for privacy-focused web search
  - Real-time web data fetching
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

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT

---

Built with passion to make AI conversations truly interactive.
