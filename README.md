# Codinger

![main](./screenshots/main.png)

A platform to learn to code by completing interactive coding exercises.

## Gettings Started

0. Make sure you have Node.js and npm installed on your machine. You can download them from [Node.js official website](https://nodejs.org/).

1. Clone the repository:

```bash
git clone https://github.com/BenjaminDerProgrammierer/codinger.git
```

2. Navigate to the project directory, and install dependencies:

```bash
cd codinger
npm -g install pnpm
pnpm install
```

3. Set up the database and configure the environment variables. You can use the provided `.env.example` file as a template. Rename it to `.env` and fill in the required values.

```bash
docker compose -f prisma/docker-compose.yml up
cp .env.example .env
```

```dotenv
DATABASE_URL="postgresql://codinger:562e0783104f15a9e3fb95fa496069c1@localhost:5432/codinger?schema=public"
BETTER_AUTH_SECRET=                     # Generate a random secret for BetterAuth, e.g., using `openssl rand -base64 32`
BETTER_AUTH_URL=http://localhost:3000   # Base URL of your app, change for production deployment
HACK_CLUB_AI_API_KEY=                   # Generate a Hack Club AI API key at https://ai.hackclub.com/
SMTP_HOST=mail.example.com              # Replace with your SMTP server host
SMTP_PORT=587                           # Replace with your SMTP server port
SMTP_SECURE=true                        # Set to true if your SMTP server requires a secure connection (TLS/SSL)
SMTP_USER=your_smtp_username            # Replace with your SMTP username
SMTP_PASSWORD=your_smtp_password        # Replace with your SMTP password
SMTP_FROM_ADDRESS=your_email_address    # Replace with your email address
SMTP_FROM_NAME=Your Name                # Replace with your name
```

4. Initialize the database:

```bash
pnpm run db-migrate
pnpm run db-apply-lessons
pnpm prisma migrate dev --name init
```

5. Build and run the application:

```bash
pnpm run build
pnpm run start
```

## (Demo) Usage of the app

* Create an account
* Verify your email address and log in
* Look at the user settings and change your password, name, or create a passkey.
* Start learning the first pathway (HTML) and complete the exercises. You can also see your progress in the dashboard.

## Tech Stack

* Next.js (React)
* TypeScript
* Tailwind CSS
* Shadcn/ui
* Prisma ORM
* PostgreSQL (sqlite for development)

## Motivation

I see my peers struggle to keep up with the fast-paced programming lessions at school. I want to create a web app to help them with learn to code web programming languages (Planend are: HTML, CSS, JavaScript, TypeScript, React).

Apart from that, I need hours for Hack Club Horizons AND I aways wanted to try Tailwind CSS and Shadcn/ui, so this is a perfect opportunity to do so.

## License Attribution

* Monaco Visual Studio 2026 Theme licenced under the MIT license by Microsoft Corporation.
* All the amazing contributors to the open source libraries used in this project are licensed under their respective licenses. Please refer to their documentation for more information. For a list of the libraries used, please refer to the `package.json` file.

## AI use

* I am using models from OpenAI and Claude to aid in repetetive tasks during coding. This includes generating small portions of code, like the Visual Studio Code to prism (Markdown code snippets) converter.
* The README is fully self-written
