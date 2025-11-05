import { openai } from '@ai-sdk/openai';
import { Output, tool, ToolLoopAgent } from 'ai';
import { TextEncoder } from 'util';
import { z } from 'zod';
import fs from 'fs';
import { searchWeb } from '../../../lib/searchUtils';

const ResponseComponent = (() => {
    const UIComponent: z.ZodTypeAny = z.lazy(() =>
        z.discriminatedUnion("type", [
            z
                .object({
                    type: z.literal("text"),
                    text: z.string(),
                    variant: z
                        .enum(["title", "subtitle", "body", "caption", "code"])
                        .default("body"),
                    align: z.enum(["start", "center", "end", "justify"]).default("start"),
                    style: z
                        .object({
                            bold: z.boolean().default(false),
                            italic: z.boolean().default(false),
                            underline: z.boolean().default(false),
                            strike: z.boolean().default(false),
                            code: z.boolean().default(false),
                            color: z.string().nullable().default(null),
                        })
                        .strict()
                        .default({
                            bold: false,
                            italic: false,
                            underline: false,
                            strike: false,
                            code: false,
                            color: null,
                        }),
                })
                .strict(),

            z
                .object({
                    type: z.literal("flex"),
                    direction: z.enum(["row", "column"]),
                    align: z.enum(["start", "center", "end", "stretch"]).default("stretch"),
                    justify: z
                        .enum(["start", "center", "end", "between", "around", "evenly"])
                        .default("start"),
                    wrap: z.boolean().default(false),
                    children: z.array(UIComponent).max(50).default([]),
                })
                .strict(),

            z
                .object({
                    type: z.literal("image"),
                    src: z.string().min(1).nullable().default(null),
                    searchQuery: z.string().min(1).nullable().default(null),
                    alt: z.string().default(""),
                    fit: z
                        .enum(["cover", "contain", "fill", "none", "scale-down"])
                        .default("cover"),
                    radius: z.number().int().min(0).max(64).default(0),
                })
                .strict(),

            z
                .object({
                    type: z.literal("list"),
                    ordered: z.boolean().default(false),
                    bulletType: z.enum(["disc", "circle", "square", "decimal", "none"]).default("disc"),
                    children: z.array(UIComponent).max(50).default([]),
                })
                .strict(),

            z
                .object({
                    type: z.literal("button"),
                    label: z.string().min(1),
                    action: z.string().min(1),
                    variant: z.enum(["primary", "secondary", "outline", "ghost"]).default("primary"),
                    size: z.enum(["sm", "md", "lg"]).default("md"),
                })
                .strict(),

            z
                .object({
                    type: z.literal("input"),
                    id: z.string().min(1),
                    label: z.string().default(""),
                    placeholder: z.string().default(""),
                    inputType: z.enum(["text", "email", "password", "number", "tel", "url"]).default("text"),
                    required: z.boolean().default(false),
                })
                .strict(),

            z
                .object({
                    type: z.literal("textarea"),
                    id: z.string().min(1),
                    label: z.string().default(""),
                    placeholder: z.string().default(""),
                    rows: z.number().int().min(2).max(20).default(4),
                    required: z.boolean().default(false),
                })
                .strict(),

            z
                .object({
                    type: z.literal("select"),
                    id: z.string().min(1),
                    label: z.string().default(""),
                    placeholder: z.string().default("Select an option"),
                    options: z.array(z.object({
                        value: z.string(),
                        label: z.string(),
                    })).min(1),
                    required: z.boolean().default(false),
                })
                .strict(),

            z
                .object({
                    type: z.literal("chart"),
                    chartType: z.enum(["bar", "line", "area", "pie"]).default("bar"),
                    title: z.string().default(""),
                    description: z.string().default(""),
                    data: z.array(z.record(z.string(), z.union([z.string(), z.number()]))).min(1),
                    config: z.object({
                        xKey: z.string(),
                        yKeys: z.array(z.object({
                            key: z.string(),
                            label: z.string(),
                            color: z.string(),
                        })),
                    }),
                })
                .strict(),

            z
                .object({
                    type: z.literal("badge"),
                    text: z.string().min(1),
                    variant: z.enum(["default", "success", "warning", "error", "info"]).default("default"),
                })
                .strict(),

            z
                .object({
                    type: z.literal("progress"),
                    value: z.number().min(0),
                    max: z.number().min(1).default(100),
                    showLabel: z.boolean().default(true),
                    label: z.string().default("Progress"),
                })
                .strict(),

            z
                .object({
                    type: z.literal("alert"),
                    title: z.string().default(""),
                    description: z.string().default(""),
                    variant: z.enum(["default", "success", "warning", "error", "info"]).default("default"),
                })
                .strict(),

            z
                .object({
                    type: z.literal("separator"),
                    orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
                })
                .strict(),

            z
                .object({
                    type: z.literal("accordion"),
                    items: z.array(z.object({
                        title: z.string(),
                        content: z.array(UIComponent).max(20).default([]),
                    })).min(1),
                    allowMultiple: z.boolean().default(false),
                })
                .strict(),

            z
                .object({
                    type: z.literal("tabs"),
                    tabs: z.array(z.object({
                        label: z.string(),
                        content: z.array(UIComponent).max(20).default([]),
                    })).min(1),
                })
                .strict(),

            z
                .object({
                    type: z.literal("codeblock"),
                    code: z.string().min(1),
                    language: z.string().default("plaintext"),
                    showLineNumbers: z.boolean().default(false),
                })
                .strict(),

            z
                .object({
                    type: z.literal("card"),
                    title: z.string().default(""),
                    description: z.string().default(""),
                    image: z.string().nullable().default(null),
                    imageQuery: z.string().nullable().default(null),
                    children: z.array(UIComponent).max(10).default([]),
                    clickAction: z.string().nullable().default(null),
                })
                .strict(),

            z
                .object({
                    type: z.literal("grid"),
                    columns: z.number().int().min(1).max(3).default(2),
                    children: z.array(UIComponent).max(20).default([]),
                })
                .strict(),

            z
                .object({
                    type: z.literal("hero"),
                    title: z.string().default(""),
                    subtitle: z.string().default(""),
                    backgroundImage: z.string().nullable().default(null),
                    backgroundImageQuery: z.string().nullable().default(null),
                    overlayColor: z.string().default("rgba(0,0,0,0.4)"),
                    children: z.array(UIComponent).max(10).default([]),
                })
                .strict(),

            z
                .object({
                    type: z.literal("stats"),
                    items: z.array(z.object({
                        label: z.string().default(""),
                        value: z.string().default(""),
                        change: z.string().default(""),
                        trend: z.enum(["up", "down", "neutral"]).nullable().default(null),
                        description: z.string().default(""),
                        icon: z.string().nullable().default(null),
                    })).max(8).default([]),
                })
                .strict(),

            z
                .object({
                    type: z.literal("metric"),
                    label: z.string().default(""),
                    value: z.string().default(""),
                    change: z.string().default(""),
                    trend: z.enum(["up", "down"]).nullable().default(null),
                    prefix: z.string().default(""),
                    suffix: z.string().default(""),
                    description: z.string().default(""),
                    variant: z.enum(["default", "primary", "success", "warning", "danger"]).default("default"),
                })
                .strict(),

            z
                .object({
                    type: z.literal("comparison"),
                    title: z.string().default(""),
                    items: z.array(z.object({
                        label: z.string().default(""),
                        subtitle: z.string().default(""),
                        children: z.array(UIComponent).max(10).default([]),
                    })).min(2).max(4).default([]),
                })
                .strict(),

            z
                .object({
                    type: z.literal("gallery"),
                    title: z.string().default(""),
                    images: z.array(z.object({
                        image: z.string().nullable().default(null),
                        imageQuery: z.string().nullable().default(null),
                        title: z.string().default(""),
                        subtitle: z.string().default(""),
                        clickAction: z.string().nullable().default(null),
                    })).max(12).default([]),
                    columns: z.number().int().min(1).max(3).default(3),
                    aspectRatio: z.string().default("16/9"),
                })
                .strict(),

            z
                .object({
                    type: z.literal("timeline"),
                    items: z.array(z.object({
                        date: z.string().default(""),
                        title: z.string().default(""),
                        description: z.string().default(""),
                        active: z.boolean().default(false),
                        children: z.array(UIComponent).max(5).default([]),
                    })).max(10).default([]),
                    variant: z.enum(["vertical", "horizontal"]).default("vertical"),
                })
                .strict(),

            z
                .object({
                    type: z.literal("feature"),
                    title: z.string().default(""),
                    description: z.string().default(""),
                    icon: z.string().nullable().default(null),
                    features: z.array(z.union([z.string(), UIComponent])).max(10).default([]),
                    variant: z.enum(["default", "primary", "dark"]).default("default"),
                })
                .strict(),
        ])
    );

    const Root = z
        .object({
            version: z.literal(1).default(1),
            children: z.array(UIComponent).max(100).default([]),
        })
        .strict();

    return Root;
})();

const systemPrompt = `
You are an advanced AI assistant that creates interactive, beautiful UI responses. You communicate naturally and conversationally while enhancing your responses with rich UI components.

CRITICAL STYLE RULES:
- NEVER use align="center" unless absolutely essential (use it 0.01% of the time)
- NEVER start your response with variant="title" - you're having a conversation, not writing a document
- AVOID bold styling unless something is genuinely important
- Use plain text for most of your responses - let the components enhance the experience, not text formatting
- Start responses conversationally with plain text, not with titles or headers
- Only use title/subtitle variants for actual section headings within complex content (like categories, comparisons)
- DO NOT use markdown (# ## ###) - use Text components with appropriate variants instead
- IMPORTANT: When using Flex row, ALL child components must be properly indented inside the Flex block

Available components: Text, Flex, Image, List, Button, Input, Textarea, Select, Chart, Badge, Progress, Alert, Separator, Accordion, Tabs, CodeBlock, Card, Grid, Hero, Stats, Metric, Comparison, Gallery, Timeline, Feature

Component usage - BE SMART AND CONTEXTUAL:
- Hero: For major announcements, landing sections, or featured content with background images
- Stats: Display multiple metrics/KPIs in a grid (sales figures, user counts, percentages)
- Metric: Single important metric with trend indicator (revenue, growth rate, etc.)
- Comparison: Side-by-side comparisons (before/after, plan A vs plan B, competitors)
- Gallery: Image collections with optional titles (product showcase, portfolio, locations)
- Timeline: Historical events, roadmaps, step-by-step processes with dates
- Feature: Highlight product features or benefits with checkmarks
- Cards: Use for showcasing items, features, achievements. Can contain images, text, badges, buttons
- Grid: Use to display multiple Cards in a responsive layout (1-3 columns only, default 2)
- Images: Use 1 image for simple topics. NOT every response needs images
- Charts: ESSENTIAL for data, statistics, trends, comparisons, history. If discussing performance, wins, growth - USE CHARTS
- Buttons: Only when there are logical next actions. NOT at the end of every response
- Forms: When you need user input, create actual forms with Input/Select/Textarea + submit Button
- Badges: For status indicators, categories, tags
- Alerts: Only for warnings, tips, important notices
- Accordion: For FAQ-style content or categorized information
- Tabs: When presenting different views of the same topic
- Separator: Only between major sections
- Flex row: For side-by-side buttons or small items

THINK before using components:
- Showcasing multiple items? → Use Grid with Cards
- Does this data have numbers/trends? → Use Stats, Metrics, or Charts
- Am I comparing things? → Use Comparison component or side-by-side Cards
- Showing a journey/history? → Use Timeline
- Major feature announcement? → Use Hero with background image
- Portfolio/gallery items? → Use Gallery component
- Do I need user input? → Create a proper form
- Is this a multi-step process? → Use Timeline or Accordion
- Are there natural follow-up questions? → Then add Buttons (in Flex row)
- Am I comparing numbers → Use charts

Please note that these are examples of how your responses should be like, look at them carefully and generate an as good and as visually appealing response as you can.
<example>
User: What's the weather today?
Response:
Image: searchQuery="partly cloudy weather", fit="cover", radius=8
Text: Today's weather is partly cloudy with temperatures reaching 72°F. There's a 20% chance of rain in the afternoon, so you might want to keep an umbrella handy just in case. Wind speeds are mild at 12 mph from the northwest.
Chart: chartType=line, title=Temperature throughout the day, data=[{time: "6am", temp: 58}, {time: "9am", temp: 65}, {time: "12pm", temp: 70}, {time: "3pm", temp: 72}, {time: "6pm", temp: 68}, {time: "9pm", temp: 60}], config={xKey: time, yKeys: [{key: temp, label: Temperature (°F), color: #f59e0b}]}
Flex: direction=row
    Button: label=Tomorrow's forecast, action=weather_tomorrow, variant=outline
    Button: label=Weekly outlook, action=weather_week, variant=outline
    Button: label=What to wear?, action=outfit_suggestion, variant=primary
</example>

<example>
User: How do I make a sandwich?
Response:
Text: Here's how to make a delicious sandwich! The key is layering your ingredients properly for the best taste and structural integrity.
Image: searchQuery="finished sandwich", fit="cover", radius=8
Text: You'll need bread, your choice of protein, cheese, lettuce, tomatoes, and condiments. Here's the step-by-step process:
List: ordered=true
    Text: Start with two slices of your favorite bread
    Text: Spread condiments (mayo, mustard, etc.) on one or both slices
    Text: Layer your protein (turkey, ham, roast beef, etc.)
    Text: Add cheese if desired
    Text: Stack fresh vegetables like lettuce, tomato, onion
    Text: Season with salt and pepper to taste
    Text: Close the sandwich and cut diagonally for easier eating
Alert: variant=info, description=Pro tip: Toast the bread lightly for extra crunch and to prevent sogginess from wet ingredients
Flex: direction=row
    Button: label=Grilled cheese recipe, action=grilled_cheese_recipe
    Button: label=Club sandwich guide, action=club_sandwich
    Button: label=Vegetarian options, action=veg_sandwiches
</example>

<example>
User: Show me Python basics
Response:
Text: I'll walk you through Python basics with examples you can try right away. Python is known for its clean, readable syntax that makes it perfect for beginners.
Separator:
Text: variant=subtitle, text=Variables and Data Types
Text: Python uses dynamic typing, so you don't need to declare variable types:
CodeBlock: code="# Numbers\nage = 25\nheight = 5.9\n\n# Strings\nname = 'Alice'\nmessage = \"Hello, World!\"\n\n# Booleans\nis_student = True\nhas_license = False\n\n# Lists\nfruits = ['apple', 'banana', 'orange']\nnumbers = [1, 2, 3, 4, 5]", language=python, showLineNumbers=true
Text: variant=subtitle, text=Control Flow
CodeBlock: code="# If statements\nif age >= 18:\n    print('You are an adult')\nelse:\n    print('You are a minor')\n\n# For loops\nfor fruit in fruits:\n    print(f'I like {fruit}')\n\n# While loops\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1", language=python
Tabs: tabs=[
    {label: Functions, content: [
        Text: Functions help you organize and reuse code:,
        CodeBlock: code="def greet(name):\n    return f'Hello, {name}!'\n\n# Call the function\nmessage = greet('Alice')\nprint(message)  # Output: Hello, Alice!", language=python
    ]},
    {label: Lists & Dicts, content: [
        Text: Python's built-in data structures are powerful and easy to use:,
        CodeBlock: code="# List operations\nnumbers = [1, 2, 3]\nnumbers.append(4)\nnumbers.extend([5, 6])\n\n# Dictionary\nperson = {\n    'name': 'Bob',\n    'age': 30,\n    'city': 'New York'\n}\nprint(person['name'])", language=python
    ]}
]
Button: label=Try these examples, action=open_python_repl, variant=primary
</example>

<example>
User: Help me plan a trip to Paris
Response:
Text: Paris is an incredible destination! I'll help you plan an unforgettable trip to the City of Light. The best time to visit is typically April-June or September-October when the weather is pleasant and crowds are manageable.
Hero: title=Paris Trip Planning, subtitle=Your Gateway to Romance and Culture, backgroundImageQuery="eiffel tower paris sunset", overlayColor=rgba(0,0,0,0.4)
Feature: title=Why Paris?, description=Discover the magic of the City of Light, features=[Text: Iconic landmarks and world-class museums, Text: Culinary delights from croissants to fine dining, Text: Romantic ambiance perfect for couples or solo adventures]
Tabs: tabs=[
    {label: Attractions, content: [
        Grid: columns=2
            Card: title=Louvre Museum, imageQuery="louvre museum paris", description=Home to the Mona Lisa and thousands of masterpieces, children=[Badge: text=Top Rated, variant=success]
            Card: title=Eiffel Tower, imageQuery="eiffel tower paris", description=Iconic iron lattice tower with stunning views, children=[Badge: text=Must-See, variant=primary]
            Card: title=Notre-Dame, imageQuery="notre dame paris", description=Gothic cathedral under restoration, children=[Badge: text=Historical, variant=info]
    ]},
    {label: Food Scene, content: [
        Text: Paris offers incredible culinary experiences from street food to Michelin-starred restaurants.
        List: children=[
            Text: Try authentic croissants and baguettes at local bakeries,
            Text: Enjoy escargot and coq au vin at traditional bistros,
            Text: Explore food markets like Marché des Enfants Rouges
        ]
    ]},
    {label: Nightlife, content: [
        Text: From jazz clubs to rooftop bars, Paris comes alive at night.
        Grid: columns=2
            Card: title=Montmartre, imageQuery="montmartre paris nightlife", description=Bohemian district with cabarets and street performers
            Card: title=Le Marais, imageQuery="le marais paris bars", description=Trendy area with gay bars and cocktail lounges
    ]}
]
Alert: variant=warning, title=Crowd Tips, description=Book attractions in advance during peak season to avoid long lines.
Flex: direction=row
    Button: label=Itinerary Builder, action=build_paris_itinerary, variant=primary
    Button: label=Local Guides, action=find_paris_guides, variant=outline
    Button: label=Budget Calculator, action=paris_budget_calc, variant=secondary
</example>

<example>
User: Show me the sales performance
Response:
Stats: items=[
    {label: Total Revenue, value: $2.4M, change: +12.5%, trend: up, description: YTD 2024},
    {label: Active Users, value: 145K, change: +8.2%, trend: up, description: Monthly active},
    {label: Conversion Rate, value: 3.2%, change: -0.5%, trend: down, description: Last 30 days},
    {label: Avg Order Value, value: $127, change: +$15, trend: up, description: Per transaction}
]
Chart: chartType=line, title=Revenue Trend, data=[{month: Jan, revenue: 180000}, {month: Feb, revenue: 195000}, {month: Mar, revenue: 210000}, {month: Apr, revenue: 225000}, {month: May, revenue: 240000}], config={xKey: month, yKeys: [{key: revenue, label: Revenue ($), color: #3b82f6}]}
Text: The sales performance shows strong growth across most metrics. Revenue has increased consistently month-over-month, with May reaching our highest point yet.
Flex: direction=row
    Button: label=Download Report, action=download_sales_report, variant=primary
    Button: label=View Details, action=view_detailed_analytics, variant=outline
</example>

<example>
User: Tell me about Mercedes F1 team
Response:
Hero: title=Mercedes-AMG Petronas F1 Team, subtitle=Eight-Time Constructors' Champions • Racing Excellence Since 1954, backgroundImageQuery="Mercedes F1 car on track 2024", overlayColor=rgba(0,0,0,0.5)
    Flex: direction=row
        Metric: label=Championships, value=8, suffix= titles, variant=primary
        Metric: label=Race Wins, value=125, suffix=+, variant=success
        Metric: label=Pole Positions, value=136, trend=up, variant=default
Text: Mercedes-AMG Petronas F1 Team has been one of the most dominant forces in Formula 1 history. They've won 8 consecutive Constructor's Championships from 2014-2021, a feat unmatched in the modern era.
Text: variant=subtitle, text=Championship Victories
Grid: columns=3
    Card: title=2014, imageQuery="Mercedes F1 2014 championship", description=16 wins, 18 podiums
    Card: title=2015, imageQuery="Mercedes F1 2015 Rosberg Hamilton", description=16 wins, 24 podiums
    Card: title=2016, imageQuery="Mercedes F1 2016 championship", description=19 wins, 33 podiums
    Card: title=2017, imageQuery="Mercedes F1 2017 Hamilton", description=12 wins, 26 podiums
    Card: title=2018, imageQuery="Mercedes F1 2018 championship", description=11 wins, 25 podiums
    Card: title=2019, imageQuery="Mercedes F1 2019 dominance", description=15 wins, 32 podiums
    Card: title=2020, imageQuery="Mercedes F1 2020 W11", description=13 wins, 25 podiums, children=[Badge: text=Most dominant car ever, variant=success]
    Card: title=2021, imageQuery="Mercedes Hamilton Verstappen 2021", description=8 wins, 23 podiums
Text: variant=subtitle, text=Performance Comparison
Chart: chartType=line, title=Race Wins: Mercedes vs Competitors, data=[{year: 2014, Mercedes: 16, RedBull: 0, Ferrari: 2}, {year: 2015, Mercedes: 16, RedBull: 0, Ferrari: 3}, {year: 2016, Mercedes: 19, RedBull: 2, Ferrari: 0}, {year: 2017, Mercedes: 12, RedBull: 3, Ferrari: 5}, {year: 2018, Mercedes: 11, RedBull: 4, Ferrari: 6}, {year: 2019, Mercedes: 15, RedBull: 3, Ferrari: 3}, {year: 2020, Mercedes: 13, RedBull: 2, Ferrari: 0}, {year: 2021, Mercedes: 8, RedBull: 11, Ferrari: 0}], config={xKey: year, yKeys: [{key: Mercedes, label: Mercedes, color: #00d2be}, {key: RedBull, label: Red Bull, color: #1e41ff}, {key: Ferrari, label: Ferrari, color: #dc0000}]}
Tabs: tabs=[
    {label: Current Drivers, content: [
        Grid: columns=2,
            Card: title=Lewis Hamilton, imageQuery="Lewis Hamilton Mercedes 2024", description=7x World Champion, children=[
                Badge: text=105 wins, variant=info,
                Badge: text=104 poles, variant=info,
                Text: Joining Ferrari in 2025
            ],
            Card: title=George Russell, imageQuery="George Russell Mercedes 2024", description=Rising Star, children=[
                Badge: text=2 wins, variant=info,
                Badge: text=1 pole, variant=info,
                Text: Team leader from 2025
            ]
    ]},
    {label: Technical Innovation, content: [
        List: children=[
            Text: Split-turbo design (2014): Separated turbo components for better packaging,
            Text: DAS system (2020): Adjustable toe angle for tire temperature management,
            Text: Zero-pod sidepods (2022): Radical aerodynamic concept
        ]
    ]},
    {label: Key Records, content: [
        Progress: value=8, max=8, label=Consecutive Championships (2014-2021),
        Progress: value=125, max=150, label=Race Wins (2010-2024),
        Text: Most 1-2 finishes in a season: 12 (2014 & 2015),
        Text: Most points in a season: 765 (2016)
    ]}
]
Flex: direction=row
    Button: label=2024 Season Details, action=mercedes_2024_season
    Button: label=Compare with Red Bull, action=compare_mercedes_redbull
    Button: label=Hamilton's Legacy, action=hamilton_mercedes_stats
</example>

<example>
User: I want to learn Spanish
Response:
Text: Excellent choice! Spanish is one of the most useful languages to learn, spoken by over 500 million people worldwide. Let me help you get started on your journey.
Text: variant=subtitle, text=Choose Your Learning Path
Accordion: items=[
    {title: Complete Beginner, content: [
        Text: Start with basic greetings and essential phrases,
        Progress: value=0, max=100, label=Your Progress,
        Text: Recommended daily practice: 15-20 minutes
    ]},
    {title: Some Experience, content: [
        Text: Refresh your basics and expand vocabulary,
        Text: Focus on conversation practice
    ]},
    {title: Intermediate, content: [
        Text: Work on complex grammar and fluency,
        Text: Consume Spanish media (shows, podcasts, books)
    ]}
]
Text: variant=subtitle, text=Quick Assessment
Text: Let me understand your current level to provide personalized recommendations:
Input: id=native_language, label=Your native language, placeholder=e.g., English
Select: id=goal, label=Why do you want to learn Spanish?, options=[{value: travel, label: Travel}, {value: work, label: Professional/Work}, {value: family, label: Family/Friends}, {value: culture, label: Cultural Interest}]
Select: id=timeframe, label=How soon do you need to learn?, options=[{value: 3months, label: 3 months}, {value: 6months, label: 6 months}, {value: 1year, label: 1 year}, {value: no_rush, label: No specific timeline}]
Button: label=Get Personalized Plan, action=create_spanish_plan, variant=primary
</example>

IMPORTANT FORMATTING RULES:
1. NEVER use markdown syntax (# ## ### * - etc). Use Text components with variants instead
2. For headings within content, use Text with variant="subtitle" (NOT variant="title")
3. When using Flex with direction="row", ensure ALL children are properly nested inside:
   CORRECT:
   Flex: direction=row
       Image: searchQuery="example1"
       Image: searchQuery="example2"

   WRONG (components outside Flex):
   Flex: direction=row
   Image: searchQuery="example1"
   Image: searchQuery="example2"
4. Make sure the AI is interactable so cards, buttons and other components which support clickAction have them so user can click to get more information. Always include more information button in cards and other places in a way it looks good.
5. Make sure to generate deep, visually rich responses with multiple components - do not generate shallow responses with just one or two components unless its a greeting or a writing task.
6. YOU'RE NOT REQUIRED TO STRICTILY FOLLOW THE EXAMPLES, THEY'RE JUST TO SHOW YOU WHAT YOU'RE CAPABLE OF RESPONDING, YOUR RESPONSES SHOULD NEVER BE REPETITIVE OR CLONED, ALWAYS BE CREATIVE AND DYNAMIC.

Today's date and time is: ${new Date().toISOString()}

Always return valid JSON adhering to the schema. Keep responses natural and conversational. When users interact with buttons or forms, their actions will be sent as messages.

Schema: ${JSON.stringify(z.toJSONSchema(ResponseComponent))}
`

export const POST = async (request: Request) => {
    const body = await request.json();

    const agent = new ToolLoopAgent({
        model: openai('gpt-4.1'),
        instructions: systemPrompt,
        tools: {
            search: tool({
                description: 'Search the web for information',
                inputSchema: z.object({
                    query: z.string().describe('The query to search the web for.'),
                }),
                execute: async ({ query }) => {
                    return await searchWeb(query)
                },
            }),
        },
        temperature: 1,
        output: Output.object({
            schema: ResponseComponent
        })
    });

    const { partialOutputStream } = await agent.stream({
        messages: body.messages
    })

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            try {
                for await (const partialObject of partialOutputStream) {
                    const data = `data: ${JSON.stringify(partialObject)}\n\n`;
                    controller.enqueue(encoder.encode(data));
                }
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
            } catch (error) {
                console.error('Stream error:', error);
                controller.error(error);
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}