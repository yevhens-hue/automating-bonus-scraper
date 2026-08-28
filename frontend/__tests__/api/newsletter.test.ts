import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../app/api/newsletter/route';
import { NextRequest } from 'next/server';

// Create a mock NextRequest
function createMockRequest(body: Record<string, unknown>) {
    return {
        json: async () => Promise.resolve(body)
    } as unknown as NextRequest;
}

describe('Newsletter API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return success for valid email', async () => {
        const request = createMockRequest({ email: 'test@example.com' });

        const response = await POST(request as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.message).toBe('Subscribed successfully');
    });

    it('should reject invalid email', async () => {
        const request = createMockRequest({ email: 'invalid-email' });

        const response = await POST(request as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Valid email is required');
    });

    it('should reject missing email', async () => {
        const request = createMockRequest({});

        const response = await POST(request as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Valid email is required');
    });

    it('should reject empty email', async () => {
        const request = createMockRequest({ email: '' });

        const response = await POST(request as NextRequest);
        const data = await response.json();

        expect(response.status).toBe(400);
    });
});