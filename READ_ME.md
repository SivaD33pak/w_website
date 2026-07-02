# Wedding Website

Monorepo for the Sushmi & Nijin wedding website.

## Structure

- `frontend/` - Next.js, TypeScript, Tailwind CSS, Framer Motion, and GSAP.
- `backend/` - FastAPI API with an Excel-backed RSVP data layer.
- `frontend/reference/` - Preserved Banani export reference files.

## Planned Local Development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

## API

- `GET /api/events`
- `GET /api/gallery`
- `POST /api/verify`
- `POST /api/rsvp`

## Data

The initial Excel workbook lives at `backend/excel/wedding_database.xlsx`.
