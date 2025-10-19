import { NextResponse } from 'next/server';

export function validateOrigin(request) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');


    const allowedOrigins = [
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ].filter(Boolean);


    if (origin) {
        const isAllowed = allowedOrigins.some(allowed =>
            origin === allowed || origin.startsWith(allowed)
        );
        if (!isAllowed) {
            console.warn('Invalid origin:', origin);
            return false;
        }
        return true;
    }


    if (referer) {
        const isAllowed = allowedOrigins.some(allowed =>
            referer.startsWith(allowed)
        );
        if (!isAllowed) {
            console.warn('Invalid referer:', referer);
            return false;
        }
        return true;
    }



    return false;
}

export function withCSRFProtection(handler) {
    return async (request, ...args) => {

        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
            if (!validateOrigin(request)) {
                return NextResponse.json(
                    { error: 'Invalid origin. Request blocked for security.' },
                    { status: 403 }
                );
            }
        }

        return handler(request, ...args);
    };
}

export function isSameOrigin(request) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    if (!origin || !host) {
        return false;
    }

    try {
        const originHost = new URL(origin).host;
        return originHost === host;
    } catch {
        return false;
    }
}
