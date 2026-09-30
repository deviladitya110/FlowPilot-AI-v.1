# FlowPilot-AI-v.1
**AI-Powered Smart Workflow Automation Platform**

FlowPilot AI is a modern SaaS platform that leverages AI to understand organizational requests, apply deterministic business rules, and automatically route or execute workflows. It stops the endless stream of manual ticket triaging and ensures requests are handled intelligently.

## Features
- **AI Classification**: Understands intent, priority, and category via Google Gemini.
- **Rule Engine**: Deterministic rules that decide between auto-processing and human-in-the-loop.
- **Approval Center**: Managers can review AI-flagged edge cases.
- **Audit Logs**: Immutable timeline of every AI decision and workflow action.
- **Visual Analytics**: Insights into automation rate, time saved, and department workloads.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, ReactFlow, Lucide Icons
- **Backend**: Node.js, Express.js, Zod (Validation), jsonwebtoken, bcrypt
- **Database**: PostgreSQL (Supabase)
- **AI**: Google Gemini 2.5 Pro API

## Local Setup

### 1. Database Setup
1. Create a project in [Supabase](https://supabase.com/).
2. Run the SQL script found in `backend/database.sql` in the Supabase SQL editor to create all necessary tables.

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`

Create a `.env` file in the `backend` directory:
\`\`\`
PORT=5000
DATABASE_URL="your_supabase_connection_string_here"
JWT_SECRET="your_secure_random_string_here"
GEMINI_API_KEY="your_gemini_api_key_here"
\`\`\`

Run the backend:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Demo Flow
1. Register a new user with the "Admin" or "Manager" role.
2. Go to **Requests -> New Request**.
3. Submit: "My college Wi-Fi has been down for two days..."
4. Watch the AI instantly analyze, classify, and trigger the workflow.
5. Submit a high-value request (e.g. Finance). Watch it get flagged for Human Review in the Approvals Center.
