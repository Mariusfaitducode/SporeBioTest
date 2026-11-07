# SporeBioTest

A small full-stack app to record biological samples (where, when, by whom, what type) and comment on them, built as a time-boxed technical exercise.

## What it does
- Lists samples in a responsive, paginated grid (pages are cached on the frontend).
- Creates, edits and deletes samples, with form validation and a delete confirmation.
- Each sample stores a sampling location, a type (water, chocolate, flour, ...), a sampling date and the operator who took it.
- Adds and deletes comments on each sample from its detail view.
- REST API with full CRUD for samples (`/biosamples`, paginated with `page` and `size`) and comments (`/comments`).

## Tech stack
- **Backend:** Python, FastAPI, SQLModel (SQLAlchemy + Pydantic), SQLite
- **Frontend:** React 19, TypeScript, Vite, React Router 7

## Run it locally
Backend (Python 3.8+), served on http://localhost:8000:
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The SQLite database (`biosamples.db`) is created on first start. Set `DATABASE_URL` to use another database.

Frontend (Node 18+, pnpm), served on http://localhost:5173:
```bash
cd frontend
pnpm install
pnpm dev
```

## Data model
- **BioSample:** `id`, `sampling_location`, `type`, `sampling_date`, `sampling_operator`
- **Comment:** `id`, `biosample_id`, `content`, `created_at`

## Context
Technical exercise for Spore.Bio, built in about 3 hours in June 2025. Next steps I listed at the time: authentication, search and filters by type, date or operator, CSV export, automated tests (pytest, Vitest), and Docker with CI/CD.
