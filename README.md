# GRAVEYARD

Client management tool for GRIM's LAB.

## Tech Stack

- Next.js
- Prisma
- NextAuth.js
- shadcn/ui

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/vys69/graveyard.git
   cd graveyard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL="your_database_url_here"
   NEXTAUTH_SECRET="your_nextauth_secret_here"
   DISCORD_CLIENT_ID="your_discord_client_id_here"
   DISCORD_CLIENT_SECRET="your_discord_client_secret_here"
   ```

4. Set up the database:
   ```
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Prisma Setup

1. Install Prisma CLI:
   ```
   npm install -g prisma
   ```

2. Generate Prisma client:
   ```
   npx prisma generate
   ```

3. Push schema to database:
   ```
   npx prisma db push
   ```

4. (Optional) Seed the database:
   ```
   npx prisma db seed
   ```

## NextAuth Configuration

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)

2. Add the callback URL to your Discord app:
   ```
   http://localhost:3000/api/auth/callback/discord
   ```

3. Copy Client ID and Client Secret to the `.env` file

4. Configure NextAuth in `pages/api/auth/[...nextauth].ts`

## API Endpoints

### Tickets

#### GET /api/tickets
- Description: Fetches all tickets
- Query Parameters:
  - userFilter (optional): Filter tickets by user ID
  - statusFilter (optional): Filter tickets by status (OPEN or CLOSED)
  - titleFilter (optional): Filter tickets by title (case-insensitive)
- Response: JSON object containing an array of tickets

#### POST /api/tickets
- Description: Creates a new ticket
- Request Body:
  - title: String
  - status: String (OPEN or CLOSED)
  - userId: String
- Response: JSON object containing the created ticket

#### DELETE /api/tickets
- Description: Deletes a ticket
- Query Parameters:
  - ticketId: ID of the ticket to delete
- Response: JSON object with a success message

### Users

#### GET /api/users
- Description: Fetches all users
- Response: JSON object containing an array of users with id, name, and email

### Auth

#### GET /api/auth/[...nextauth]
- Description: Handles authentication routes for NextAuth.js
- Providers: Discord

Note: All endpoints require authentication except for the auth routes.

## Deployment

1. Push code to GitHub

2. Set up a new project on Vercel

3. Connect GitHub repository to Vercel

4. Add environment variables in Vercel's project settings

5. Deploy

## Contact

- Twitter: [@fuckgrimlabs](https://twitter.com/fuckgrimlabs)
- Discord: [@usbank](https://discord.com/users/913656519847981067)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request