# Installation Guide

This template sets up a Next.js app with Prisma, Auth.js, TypeScript, Tailwind CSS, and Neon PostgreSQL. Follow these steps to install and run it locally.

## Prerequisites

- **Node.js**: Version 18.x or higher (`node --version` to check).
- **Git**: Installed for cloning (`git --version`).
- **Neon Account**: For PostgreSQL database (sign up at https://neon.tech).
- **Google/GitHub OAuth**: For authentication (optional for email-only auth).

## Setup Steps

1. **Clone or Create Repository**:

   - **From Template**:
     - Go to `https://github.com/ndeedev/nextjstemplate`.
     - Click **Use this template** > **Create a new repository**.
     - Name it (e.g., `my-app`), set visibility, and create.
     - Clone:
       ```bash
       git clone https://github.com/ndeedev/my-app.git
       cd my-app
       ```
   - **Direct Clone**:
     ```bash
     git clone https://github.com/ndeedev/nextjstemplate.git my-app
     cd my-app
     rm -rf .git
     git init
     ```

2. **Install Dependencies**:

   - Run:
     ```bash
     npm install
     ```
   - This installs all required packages (`next`, `prisma`, `zod`, `next-auth`, etc.) listed in `package.json`.

3. **Create `.env` File**:

   - Create a `.env` file in the project root:
     ```bash
     touch .env
     ```
   - Add the following, replacing placeholders with your credentials:
     ```env
     DATABASE_URL="postgresql://user:password@host/dbname"
     NEXTAUTH_URL="http://localhost:3000"
     NEXTAUTH_SECRET="your-secret"
     AUTH_GOOGLE_ID="your-google-client-id"
     AUTH_GOOGLE_SECRET="your-google-client-secret"
     AUTH_GITHUB_ID="your-github-client-id"
     AUTH_GITHUB_SECRET="your-github-client-secret"
     ```
   - **Get Credentials**:
     - **Neon PostgreSQL**:
       - Sign in at `https://console.neon.tech`.
       - Create a project (e.g., `my-app-db`).
       - Copy the connection string (e.g., `postgresql://user:password@ep-cool-123.neon.tech/my-app-db?sslmode=require`) as `DATABASE_URL`.
     - **NextAuth Secret**:
       - Generate a random secret:
         ```bash
         node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
         ```
       - Paste as `NEXTAUTH_SECRET`.
     - **Google OAuth** (Optional):
       - Go to `https://console.developers.google.com`.
       - Create a project, enable APIs (e.g., Google+ API).
       - Create OAuth 2.0 Client ID:
         - Authorized origins: `http://localhost:3000`.
         - Redirect URI: `http://localhost:3000/api/auth/callback/google`.
       - Copy `Client ID` and `Client Secret`.
     - **GitHub OAuth** (Optional):
       - Go to `https://github.com/settings/developers`.
       - Create an OAuth App:
         - Homepage URL: `http://localhost:3000`.
         - Callback URL: `http://localhost:3000/api/auth/callback/github`.
       - Copy `Client ID` and `Client Secret`.
   - **Note**: If skipping OAuth, email auth works without `AUTH_GOOGLE_*` or `AUTH_GITHUB_*`.

4. **Run the Application**:
   - Start the development server:
     ```bash
     npm run dev
     ```
   - Open `http://localhost:3000` in your browser.
   - Sign in (via email or OAuth), create organizations, and test features.

## Troubleshooting

- **Dependency Errors**:
  - Run `npm install` again.
  - Ensure Node.js is up to date.
- **Database Connection**:
  - Verify `DATABASE_URL` in `.env`.
  - Check Neon project status.
- **Auth Issues**:
  - Confirm OAuth credentials and callback URLs.
  - Regenerate `NEXTAUTH_SECRET` if needed.
- **Prisma Schema Changes**:
  - Run:
    ```bash
    npx prisma generate
    ```

## Notes

- **Never commit `.env`**: It’s in `.gitignore` for security.
- **Production**:
  - Update `NEXTAUTH_URL` to your domain (e.g., `https://my-app.com`).
  - Adjust OAuth redirect URIs.
- **Questions?** Check the repo at `https://github.com/ndeedev/nextjstemplate`.

Happy coding!
