# Udyam Project Frontend

Hello everyone, This is the frontend for the Udyam Project, built with [Next.js](https://nextjs.org/) and TypeScript.

## Features

- Modern React (Next.js App Router)
- TypeScript for type safety
- Modular component structure
- Custom UI components
- Integration-ready with backend API

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Navigate to the frontend directory:

   ```sh
   cd frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Development Server

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Building for Production

```sh
npm run build
npm start
```

## Project Structure

```
frontend/
  ├── public/           # Static assets
  ├── src/
  │   ├── app/          # Next.js app directory (pages, layout, styles)
  │   ├── components/   # Reusable React components
  │   ├── lib/          # Utility functions
  ├── .next/            # Next.js build output (auto-generated)
  ├── package.json      # Project metadata and scripts
  └── tsconfig.json     # TypeScript configuration
```

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm start` — Start the production server

## License