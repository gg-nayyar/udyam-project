# Udyam Project Backend

This is the backend service for the Udyam Project, built with TypeScript, Node.js, and Prisma ORM.

## Features

- RESTful API for form submissions and related operations
- PostgreSQL database integration via Prisma
- Modular code structure for scalability

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository and navigate to the backend folder:

   ```sh
   cd backend
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Copy `.env.example` to `.env` and update environment variables as needed.

4. Set up the database:

   ```sh
   npx prisma migrate deploy
   ```

### Running the Development Server

```sh
npm run dev
# or
yarn dev
```

The server will start on the port specified in your `.env` file.

## Project Structure

```
backend/
  ├── prisma/              # Prisma schema and migrations
  ├── src/
  │   ├── app.ts           # Main app setup
  │   ├── server.ts        # Server entry point
  │   ├── lib/             # Libraries (e.g., prismaClient)
  │   ├── routes/          # API route handlers
  │   ├── utils/           # Utility functions
  │   └── validators/      # Input validation logic
  ├── .env                 # Environment variables
  ├── package.json         # Project metadata and scripts
  └── tsconfig.json        # TypeScript configuration
```

## Database

- Prisma is used as the ORM.
- Database schema is defined in [`prisma/schema.prisma`](prisma/schema.prisma).

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build the project
- `npm start` — Start the production server
- `npx prisma migrate dev` — Run migrations in 


# Udyam Project Frontend

This is the frontend for the Udyam Project, built with [Next.js](https://nextjs.org/) and TypeScript.

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


# Udyam Project Scraper

This directory contains the web scraping utilities and form schema definitions for the Udyam Project.

## Features

- Scrapes data from the Udyam portal
- Outputs form schema as JSON for use in other project modules
- Shared schema for consistency across backend and frontend

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Navigate to the `scraper` directory:

   ```sh
   cd scraper
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

### Usage

- To run the scraper:

  ```sh
  node udyamScraper.js
  ```

- Output schemas:
  - `udyam_form_schema.json`: Full form schema
  - `udyam_form_schema_step1.json`: Step 1 schema
  - `shared/udyam_form_schema.json`: Shared schema for other modules

## Project Structure

```
scraper/
  ├── udyamScraper.js           # Main scraper script
  ├── udyam_form_schema.json    # Full form schema output
  ├── udyam_form_schema_step1.json # Step 1 schema output
  ├── shared/
  │   └── udyam_form_schema.json   # Shared schema for other modules
  └── package.json              # Project metadata and scripts
```

## License

MIT
