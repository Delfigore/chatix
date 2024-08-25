# Twitter Clone

This is a modern Twitter-like application built with TypeScript, React, Redux, Next.js, Tailwind CSS, and Supabase. The UI is enhanced using Radix UI primitives and custom styling to create a sleek, futuristic look.

## Features

- User authentication (signup, login, logout)
- Create and view tweets
- Like and retweet functionality
- Follow/unfollow users
- User profiles
- Real-time updates
- Responsive design for various devices
- Search functionality for tweets
- Notifications system
- Futuristic UI with dark mode and interactive elements

## Technologies Used

- TypeScript
- React
- Redux (with Redux Toolkit)
- Next.js
- Tailwind CSS
- Supabase
- Radix UI
- Lucide React (for icons)

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account and project

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/twitter-clone.git
cd twitter-clone
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Copy the `.env.local.example` file to `.env.local` and fill in your Supabase project URL and anon key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase project details:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:

- Create a new Supabase project
- Run the SQL commands provided in the `supabase/schema.sql` file in the Supabase SQL editor to create the necessary tables and set up row-level security.

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Futuristic UI Features

- Dark mode with sleek color scheme
- Gradient accents and hover effects
- Interactive buttons with smooth transitions
- Modern layout for tweets and user profiles
- Responsive design that looks great on various devices

## New Functionality

- **Search**: Users can now search for tweets containing specific keywords.
- **Notifications**: A new notifications page shows users when their tweets are liked, retweeted, or when they're mentioned or followed by other users.

## Deployment

To deploy your Twitter Clone application, you can use platforms like Vercel or Netlify, which offer easy deployment for Next.js applications. Make sure to set up your environment variables in the deployment platform's settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
