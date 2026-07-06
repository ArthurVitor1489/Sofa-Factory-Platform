import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Local in-memory mock client fallback
class MockRedis {
  private store: Map<string, { value: number; expires: number }> = new Map();

  async incr(key: string): Promise<number> {
    const now = Date.now();
    const item = this.store.get(key);

    if (!item || item.expires < now) {
      this.store.set(key, { value: 1, expires: now + 60000 }); // Default 1 min window
      return 1;
    }

    item.value += 1;
    return item.value;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (item) {
      item.expires = Date.now() + seconds * 1000;
      return 1;
    }
    return 0;
  }

  async get(key: string): Promise<string | null> {
    const now = Date.now();
    const item = this.store.get(key);
    if (item && item.expires > now) {
      return String(item.value);
    }
    return null;
  }

  async set(key: string, value: any, options?: { ex?: number }): Promise<'OK' | null> {
    const expires = options?.ex ? Date.now() + options.ex * 1000 : Date.now() + 86400 * 1000;
    this.store.set(key, { value: Number(value) || 0, expires });
    return 'OK';
  }
}

let redisClient: Redis | MockRedis;

if (redisUrl && redisToken) {
  redisClient = new Redis({
    url: redisUrl,
    token: redisToken,
  });
} else {
  console.warn(
    'Warning: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not configured. Using MockRedis in-memory fallback.'
  );
  redisClient = new MockRedis();
}

export const redis = redisClient;
