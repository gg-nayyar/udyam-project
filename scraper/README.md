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
