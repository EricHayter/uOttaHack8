# RecipeFind - Frontend

A minimal recipe discovery app built with React, Vite, and Tailwind CSS.

## Features

- Select nearby grocery stores
- Filter by dietary restrictions
- Search for recipes via backend API
- Clean, minimal design with smooth interactions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the backend API URL:

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:
```
VITE_API_URL=http://localhost:3000
```

For production, you can set a different URL:
```
VITE_API_URL=https://api.yourbackend.com
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## API Integration

The app makes a POST request to `{VITE_API_URL}/api/recipes` with the following payload:

```json
{
  "stores": ["Walmart", "Target"],
  "dietaryRestrictions": ["Vegan", "Gluten-Free"]
}
```

The backend should return a JSON response with recipe data.

## Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:3000`)

**Note:** Environment variables in Vite must be prefixed with `VITE_` to be accessible in the client code.
