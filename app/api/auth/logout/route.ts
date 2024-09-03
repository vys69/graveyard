import { NextResponse } from 'next/server';
import { signOut } from 'next-auth/react';

export async function GET() {
  await signOut({ redirect: false, callbackUrl: '/' });
  return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL));
}