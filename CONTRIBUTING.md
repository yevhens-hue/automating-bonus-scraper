# Contributing to Automating Bonus Scraper

Thank you for your interest in contributing! This project automates bonus scraping, content generation, and indexing.

## Development Workflow

### Backend (Python)
- Install dependencies: `pip install -r scraper/requirements.txt`
- Run tests: `pytest scraper/tests/`
- All new logic should include corresponding tests in `scraper/tests/`.

### Frontend (Next.js)
- Install dependencies: `npm install` (in `frontend/`)
- Run development server: `npm run dev`
- Run tests: `npm test`
- All UI changes must be verified with Vitest.

## Standards
- Use **modern Google Auth** (`google-auth`, not `oauth2client`).
- Keep all secrets in `.env` files (never commit them).
- Maintain 100% test pass rate before submitting changes.
- Use **Vanilla CSS** for new styles unless Tailwind is requested.

## Pull Request Process
1. Ensure all tests pass.
2. Update documentation if you add new features.
3. Provide screenshots/recordings for UI changes.
