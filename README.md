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

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally on port 5434, or update the `DATABASE_URL`)

### 1. Clone & Install
```bash
git clone https://github.com/patiabhishek123/TimeRoot.git
cd TimeRoot

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/metadata?schema=public"
OPENMETADATA_API_URL="http://localhost:8585/api/v1"
OPENMETADATA_JWT_TOKEN="your_jwt_token_here"
```

### 3. Run the App
Start both the frontend and backend concurrently:

**Backend:**
```bash
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` to explore!
