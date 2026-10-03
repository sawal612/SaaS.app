# Converso

Converso is a real-time AI learning platform. Users can browse AI companions, create learning companions, start voice conversations, view live transcripts, and revisit recent sessions.

## Features

- Clerk authentication
- Supabase companion and session-history storage
- Vapi voice conversations with microphone controls
- Live user and assistant transcripts
- Subject-based companion colors
- Responsive dashboard and companion pages
- Lottie sound-wave animation during speech

## Tech Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Clerk
- Supabase
- Vapi Web SDK
- Lottie React

## Requirements

- Node.js 20 or newer
- npm
- A Clerk application
- A Supabase project
- A Vapi account and web token

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root. Do not commit this file or paste real secrets into documentation:

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

The application expects these Supabase tables.

### `companions`

Companion records should include `id`, `name`, `subject`, `topic`, `voice`, `style`, `duration`, and `author`.

### `session_history`

Session history should include `id`, `companion_id`, `user_id`, and `created_at`. The `companion_id` column should reference `companions.id`. The `user_id` value should contain the Clerk user ID, and `created_at` is used to order recent sessions.

## Main Routes

- `/` - dashboard with recent sessions
- `/companions` - browse and filter companions
- `/companions/new` - create a companion
- `/companions/[id]` - start a voice learning session
- `/sign-in` - Clerk sign-in page

## Scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run lint      # Run ESLint
```

## Vercel Deployment

1. Import the repository into Vercel.
2. Add every variable from `.env.local` under Vercel Project Settings.
3. Add the variables to the required Preview and Production environments.
4. Configure the deployed URL in Clerk and Vapi where required.
5. Redeploy after changing environment variables.

Never commit `.env`, `.env.local`, Clerk secret keys, or Vapi tokens. If a secret is exposed, revoke and rotate it before deploying.

## Project Structure

```text
app/                  Next.js routes and global styles
components/           Reusable UI and companion components
constants/             Subjects, colors, voices, and animation data
lib/actions/           Server actions for companion data
lib/supabase.ts        Supabase client setup
lib/vapi.sdk.ts        Vapi browser singleton
types/                 Shared TypeScript declarations
public/                Images and icons
```

## Documentation

- [Next.js documentation](https://nextjs.org/docs)
- [Clerk Next.js documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Supabase JavaScript documentation](https://supabase.com/docs/reference/javascript/introduction)
- [Vapi Web SDK documentation](https://docs.vapi.ai/sdk/web)

