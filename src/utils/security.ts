import { redis } from '@/lib/redis';

// 1. Honeypot check
// A hidden input field called "confirm_email_address" will be added to forms.
// If it has any value, it's a bot request.
export function validateHoneypot(formData: FormData): boolean {
  const honeypotVal = formData.get('confirm_email_address');
  // If field exists and is not empty, it's a bot!
  if (honeypotVal !== null && honeypotVal !== '') {
    return false; // Failed validation
  }
  return true; // Passed validation (is human)
}

// 2. Cloudflare Turnstile verification
export async function verifyTurnstileToken(token: string | null): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn('Turnstile secret key is missing. Skipping validation in development.');
    return true;
  }

  // Cloudflare testing tokens
  if (token === '1x00000000000000000000AA' || token === 'mock-turnstile-token') {
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
      }
    );

    const outcome = await response.json();
    return outcome.success === true;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return false;
  }
}

// 3. Rate Limiter helper
// Key structure: rate_limit:ip:action
export async function rateLimit(
  ip: string,
  action: string,
  limit: number = 5,
  windowSeconds: number = 60
): Promise<{ success: boolean; current: number; limit: number }> {
  const cleanIp = ip.replace(/[^a-zA-Z0-9-]/g, '_'); // sanitize IP for Redis key safety
  const key = `rate_limit:${cleanIp}:${action}`;

  try {
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    const isBlocked = current > limit;

    return {
      success: !isBlocked,
      current,
      limit,
    };
  } catch (error) {
    console.error('Rate limiting service error, bypassing for resilience:', error);
    // Bypassing rate limiter on error ensures the application remains functional
    return { success: true, current: 0, limit };
  }
}
