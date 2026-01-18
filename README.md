# RecipeFind

RecipeFind helps you discover delicious recipes that match your dietary restrictions while using ingredients that are currently on sale at nearby Canadian grocery stores. Built with AI agents to make eating affordable, healthy, and enjoyable.

## Demo Video

[![RecipeFind Demo](https://img.youtube.com/vi/eiMMAlXh53c/0.jpg)](https://youtu.be/eiMMAlXh53c)

## Inspiration

Eating food that is affordable, healthy, and enjoyable can be challenging. As students, it is especially hard to find meals that keep both you and your wallet healthy. RecipeFind was inspired by this problem. It helps users select nearby grocery stores and discover recipes that match their dietary restrictions while using ingredients that are currently on sale.

## What it Does

RecipeFind parses weekly flyers from many Canadian grocery stores to find deals on a wide variety of ingredients. It then leverages AI to generate recipes that use these discounted items while respecting the user's dietary restrictions.

## How We Built It

RecipeFind uses Yellowcake to parse multiple grocery store websites and extract weekly deals. This data is exposed as a tool to Solace's Agent Mesh, which coordinates several agents responsible for generating recipes and filtering them based on dietary needs.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Solace Agent Mesh (SAM), Python
- **Data Parsing**: Yellowcake
- **Caching**: Redis
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local frontend development)
- Yellowcake API key

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and add your Yellowcake API key:
   ```bash
   YELLOW_CAKE_KEY=your_api_key_here
   ```

4. Start the backend services (Solace Agent Mesh and Redis):
   ```bash
   docker compose up --build
   ```

   This will start:
   - Redis cache on port 6379
   - Solace Agent Mesh on ports 8000 (HTTP), 8001 (Platform API), 5002 (Web UI), and 8080 (REST API)

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Select your preferred Canadian grocery stores
3. Specify any dietary restrictions (vegetarian, vegan, gluten-free, etc.)
4. Click "Find Recipes" to discover recipes that use ingredients currently on sale
5. Browse AI-generated recipes that match your preferences and budget

## Challenges We Ran Into

Using agents throughout the entire stack, from website parsing to recipe generation, introduced significant latency. We were able to reduce processing time by about 50 percent by caching parsed flyer data in a Redis database, which greatly improved the speed of finding items on sale.

## Accomplishments

We built a very usable application that could genuinely help people like ourselves make better food choices on a budget.

## What We Learned

During the hackathon, we became more familiar with new offerings from Solace and Yellowcake. We also gained additional experience working with Docker Compose, including running both the Solace Agent Mesh and a Redis container together.

## Project Structure

```
.
├── backend/              # Solace Agent Mesh backend
│   ├── src/             # Agent plugins
│   ├── configs/         # Agent configurations
│   ├── Dockerfile       # Backend container
│   └── compose.yaml     # Docker Compose configuration
└── frontend/            # React frontend
    ├── src/             # Frontend source code
    └── package.json     # Frontend dependencies
```

## License

Built at uOttaHack8
