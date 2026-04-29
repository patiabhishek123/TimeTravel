# ⏳ Time Travel

**Proactively debug broken data pipelines by inspecting schema evolution and lineage changes over time.**

*Built for the OpenMetadata Hackathon.*

## 🚀 The Problem
Modern data stacks are incredibly complex. When a dashboard breaks or a data pipeline fails, data engineers often spend hours tracking down *what changed*. Was a column dropped? Did the upstream lineage change? Without a historical record of metadata, finding the root cause is like finding a needle in a haystack.

## 💡 Our Solution
**Metadata Time-Travel** is a "Git for Data Metadata". It integrates directly with **OpenMetadata** to capture point-in-time snapshots of your dataset schemas and lineage.

Using a sleek, Vercel/Linear-inspired UI, data engineers can scrub through a timeline of metadata changes to visually identify exactly when, how, and why a data asset broke. 

### Key Features
- **OpenMetadata Integration:** Fetches live datasets, schema definitions, and lineage maps directly from your OpenMetadata instance.
- **Visual Metadata Diffing:** Side-by-side comparison highlighting added, removed, and changed columns over time.
- **Time-Traveling Lineage:** A dynamic lineage graph that highlights broken upstream/downstream dependencies in red.
- **Root Cause Engine:** An automated analyzer that scans recent schema and lineage changes to give a probabilistic diagnosis of pipeline failures.
- **Graceful Mock Fallback:** Even if the OpenMetadata server is offline, the app seamlessly falls back to local simulation data for uninterrupted demonstration.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express, Axios.
- **Database (Snapshot Storage):** PostgreSQL, Prisma ORM.
- **Integration:** OpenMetadata REST API.

## 💻 Deployment & Usage

### Option A: Run via Docker (Recommended for Users)
The easiest way for other data teams to use TimeTravel is by pulling the repository and running it via Docker Compose.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/patiabhishek123/TimeRoot.git
   cd TimeRoot
   ```

2. **Configure your OpenMetadata Instance:**
   Open the `docker-compose.yml` file and update the `OPENMETADATA_API_URL` and `OPENMETADATA_JWT_TOKEN` under the `backend` environment variables to point to your company's OM instance.

3. **Spin up the stack:**
   ```bash
   docker compose up -d
   ```
   This will automatically:
   - Spin up a PostgreSQL database
   - Push the Prisma schema
   - Build and start the Node.js Backend API
   - Build and serve the React Frontend via Nginx on port `8080`

4. Open `http://localhost:8080` to explore!

### Option B: Run Locally (For Developers)

**Prerequisites:** Node.js (v18+) and PostgreSQL (port 5434).

1. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Configure Environment:** Create a `.env` in the root:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5434/metadata?schema=public"
   OPENMETADATA_API_URL="http://localhost:8585/api/v1"
   OPENMETADATA_JWT_TOKEN="your_jwt_token_here"
   ```

3. **Start the app:**
   ```bash
   # Terminal 1 (Backend)
   npm run dev

   # Terminal 2 (Frontend)
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173` to explore!
