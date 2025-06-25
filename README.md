This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This project requires **Node.js version 18 or higher**.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Google Cloud Vision

OCR features require a Google Cloud Vision service account key. Place the JSON
key at `gcp-vision-key.json` in the project root or specify a custom path by
setting `GCP_VISION_KEY_PATH` in your environment (see `.env.example`) when
running the server.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Authentication

Use `/signup` to create an account and `/login` to access the app. After sign-up you will be redirected to `/setup` where you can register your profile. Completing setup creates a "メイン倉庫" record automatically.

### FAQ

Basic usage tips and troubleshooting steps are available at `/faq`.

### Error Pages

Visiting `/404` or navigating to a non-existent route shows a 404 screen with
the message "ページが見つかりません". The `/500` path displays
"サーバーエラーが発生しました" and is also shown when an unhandled server error
occurs.

---

### Running Tests

Install dependencies with `npm install` so Jest and other packages are available.
Then run the test suite using:

```bash
npm test
```

The command launches Jest and prints the test results.

### Linting

Run the linter to check code style and catch errors:

```bash
npm run lint
```

This command uses ESLint with the Next.js configuration.

