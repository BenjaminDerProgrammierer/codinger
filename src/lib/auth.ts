import 'dotenv/config';
import { betterAuth } from 'better-auth/minimal';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { nextCookies } from 'better-auth/next-js';
import { passkey } from '@better-auth/passkey';
import { sendEmail } from './email';
import { after } from 'next/server';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }, request) => {
      after(async () =>
        await sendEmail({
          to: user.email,
          subject: 'Codinger: Reset your password',
          body: `Click this link to reset your password: ${url}`,
        })
      );
    },
  },
  plugins: [nextCookies(), passkey()],
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      after(async () =>
      await sendEmail({
        to: user.email,
        subject: 'Codinger: Verify your email address',
        body: `Click this link to verify your email: ${url}login%3FemailVerified=true`,
      }));
    },
  },
});
