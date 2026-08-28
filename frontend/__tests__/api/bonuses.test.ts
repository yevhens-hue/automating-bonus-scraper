import { describe, it, expect, vi } from 'vitest';
import { GET } from '../../app/api/bonuses/route';
import { NextRequest } from 'next/server';

// Create a mock NextRequest
function createMockRequest(url: string) {
    return {
        url
    } as unknown as NextRequest;
}

// Mock STATIC_BONUSES
vi.mock('@/lib/bonuses', () => ({
    STATIC_BONUSES: [
        { id: 1, geo: 'IN', type: 'casino', brand_name: 'Brand 1' },
        { id: 2, geo: 'IN', type: 'betting', brand_name: 'Brand 2' },
        { id: 3, geo: 'TR', type: 'casino', brand_name: 'Brand 3' }
    ]
}));

describe('Bonuses API', () => {
    it('should return all bonuses for default geo (IN)', async () => {
        const request = createMockRequest('http://localhost/api/bonuses');
        
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.geo).toBe('IN');
        expect(data.type).toBe('all');
        // Should return 2 IN bonuses
        expect(data.count).toBe(2);
        expect(data.bonuses).toHaveLength(2);
    });

    it('should filter by geo parameter', async () => {
        const request = createMockRequest('http://localhost/api/bonuses?geo=TR');
        
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.geo).toBe('TR');
        expect(data.count).toBe(1);
    });

    it('should filter by type parameter', async () => {
        const request = createMockRequest('http://localhost/api/bonuses?type=casino');
        
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.type).toBe('casino');
        // Should return only casino type for IN
        expect(data.count).toBe(1);
    });

    it('should filter by both geo and type', async () => {
        const request = createMockRequest('http://localhost/api/bonuses?geo=TR&type=casino');
        
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.geo).toBe('TR');
        expect(data.type).toBe('casino');
        expect(data.count).toBe(1);
    });

    it('should return updated_at timestamp', async () => {
        const request = createMockRequest('http://localhost/api/bonuses');
        
        const response = await GET(request);
        const data = await response.json();

        expect(data.updated_at).toBeDefined();
        expect(new Date(data.updated_at).getTime()).toBeGreaterThan(0);
    });
});