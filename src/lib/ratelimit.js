import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';


const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const loginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
    prefix: '@ratelimit/login',
});

export const apiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: '@ratelimit/api',
});

export function getClientIP(request) {

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded
        ? forwarded.split(',')[0].trim()
        : request.headers.get('x-real-ip') || 'unknown';

    return ip;
}

export async function checkRateLimit(identifier, rateLimit) {
    const { success, limit, reset, remaining } = await rateLimit.limit(identifier);

    return {
        success,
        limit,
        reset,
        remaining,
        resetDate: new Date(reset),
        retryAfterMinutes: Math.ceil((reset - Date.now()) / 1000 / 60)
    };
}

export function createRateLimitResponse(rateLimitResult) {
    const { NextResponse } = require('next/server');

    return NextResponse.json(
        {
            error: 'Too many requests. Please try again later.',
            retryAfter: rateLimitResult.retryAfterMinutes,
            resetAt: rateLimitResult.resetDate.toISOString()
        },
        {
            status: 429,
            headers: {
                'Retry-After': rateLimitResult.retryAfterMinutes.toString(),
                'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.reset.toString()
            }
        }
    );
}
