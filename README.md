# Finland Company List

A full-stack web application to browse, search, and filter a curated list of companies in Finland. The data includes industry classifications (NACE Rev. 2.1) and direct links to career pages.

## Features

*   **Dynamic Search & Filter**: Real-time filtering by company name and industry.
*   **Enriched Data**: Includes standardized industry codes and "Careers" page links for 100+ companies.
*   **Full-Stack**: Built with a Node.js/Express backend and a SQLite database.
*   **Persistent Storage**: Data is stored locally in `companies.db`.

## Technologies

*   **Backend**: Node.js, Express, @libsql/client
*   **Database**: Turso (SQLite compatible)
*   **Frontend**: HTML5, CSS3, Vanilla JavaScript

## Setup & Deployment

### 1. Local Development Support
This project uses **Turso** as the database provider to ensure compatibility with serverless environments like Vercel.

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    TURSO_DATABASE_URL="libsql://your-database.turso.io"
    TURSO_AUTH_TOKEN="your-auth-token"
    ```

3.  **Migrate Data (One-Time)**
    If you have a local `companies.db` and want to move data to Turso:
    ```bash
    node migrate_to_turso.js
    ```

4.  **Start Server**
    ```bash
    node server.js
    ```

### 2. Deploy to Vercel
1.  Push this repository to GitHub.
2.  Import the project in Vercel.
3.  Add the `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` environment variables in Vercel.
4.  Deploy!