import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth';

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  return response;
}
