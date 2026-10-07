# 🦅 Eagles Daily Challenge

A polished, mobile-first Eagles trivia PWA for friends and family.

## Features

- One medium/hard Eagles question every day
- AI-generated automatically with OpenAI + web search
- No admin approval
- Four multiple-choice answers
- Answer is not included in the shared question
- Daily streak, best streak, accuracy and played count
- Native phone sharing
- Eagles-inspired midnight-green / silver design
- GitHub Pages deployment
- GitHub Actions daily question generation

## Setup

1. Create a **public** GitHub repository and upload these files.
2. Go to **Settings → Pages** and select **GitHub Actions** as the source.
3. Go to **Settings → Secrets and variables → Actions → New repository secret**.
4. Create `OPENAI_API_KEY` and paste your OpenAI API key.
5. The question workflow runs daily at 4:05 UTC (11:05 PM Eastern during standard time / 12:05 AM Eastern during daylight time). For exact midnight publication, adjust the cron seasonally or use a timezone-aware external scheduler.
6. Run the question workflow manually once from **Actions → Generate Eagles Question → Run workflow**.
7. Pushes to `main` deploy the site automatically.

GitHub Pages publishes static files; the OpenAI key is used only inside GitHub Actions and is never placed in the browser code.

## Important

The daily question is stored in `data/today.json`, so it is public. The correct answer is therefore technically discoverable by someone inspecting the repository. This version is optimized for a private friends-and-family game, not for a competitive/public game where answer secrecy matters.

For a truly secure version, put answer checking and question data behind a server/database rather than GitHub Pages alone.

## Branding

The design uses Eagles-inspired midnight green, teal, silver and white. It intentionally does not include official Eagles artwork or logos, so you can add licensed assets if you have permission.

## GitHub Pages URL

After deployment, GitHub will provide a URL similar to:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`
