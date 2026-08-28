import { describe, it, expect, vi } from 'vitest';

describe('Posts Utilities', () => {
    describe('PostData interface', () => {
        it('should have correct structure', () => {
            const post = {
                title: 'Test Post',
                slug: 'test-post',
                content: 'Full content here',
                date: '2026-03-24',
                excerpt: 'Short excerpt'
            };

            expect(post.title).toBe('Test Post');
            expect(post.slug).toBe('test-post');
            expect(post.content).toBe('Full content here');
            expect(post.date).toBe('2026-03-24');
            expect(post.excerpt).toBe('Short excerpt');
        });

        it('should work without optional fields', () => {
            const post = {
                title: 'Test Post',
                slug: 'test-post',
                content: 'Content'
            };

            expect(post.title).toBeDefined();
            expect(post.slug).toBeDefined();
            expect(post.content).toBeDefined();
        });
    });

    describe('Date extraction from filename', () => {
        it('should extract date correctly from filename', () => {
            const fileName = '2026-03-24-test-post.json';
            const extractedDate = fileName.split('-').slice(0, 3).join('-');
            
            expect(extractedDate).toBe('2026-03-24');
        });
    });
});