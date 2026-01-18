import { calculateConfidenceWithBreakdown } from '../search-api';
import { Citation } from '../citation-types';

// We need to export/expose calculateAuthorSimilarity for testing since it's not exported by default
// Alternatively, we can test it indirectly via calculateConfidenceWithBreakdown
// For this test file, let's test calculateConfidenceWithBreakdown which IS exported and uses the internal logic.

describe('Search API Logic', () => {

    describe('calculateConfidenceWithBreakdown', () => {

        const mockCitation: Citation = {
            id: '1',
            title: 'Deep Learning',
            authors: 'LeCun, Bengio, Hinton',
            year: '2015',
            venue: 'Nature',
            raw: 'LeCun, Y., Bengio, Y. & Hinton, G. Deep learning. Nature 521, 436–444 (2015).'
        };

        it('should return high score for perfect match', () => {
            const result = calculateConfidenceWithBreakdown(mockCitation, {
                title: 'Deep Learning',
                authors: ['Yann LeCun', 'Yoshua Bengio', 'Geoffrey Hinton'],
                year: 2015,
                url: 'http://example.com'
            });

            expect(result.score).toBeGreaterThan(0.9);
            expect(result.breakdown.title.matched).toBe(true);
            expect(result.breakdown.authors.matched).toBe(true);
            expect(result.breakdown.year.matched).toBe(true);
        });

        it('should penalize when author count differs significantly (Strict Mode)', () => {
            // Citation has 3 authors: LeCun, Bengio, Hinton
            // Match candidate has only 1 author: "Different Guy"
            const result = calculateConfidenceWithBreakdown(mockCitation, {
                title: 'Deep Learning',
                authors: ['Different Guy'],
                year: 2015,
                url: 'http://example.com'
            });

            // Even if title matches perfectly, author mismatch should prevent high score
            // Title (0.5) + Year (0.2) = 0.7 max. Author score should be 0.
            // With strict logic, the total score should be around 0.7 or less.
            expect(result.breakdown.authors.matched).toBe(false);
            expect(result.breakdown.authors.score).toBe(0);
            expect(result.score).toBeLessThan(0.8);
        });

        it('should penalize partial author match with large count mismatch', () => {
            // Citation has 3 authors
            // Match candidate has 1 author who IS one of the 3 (e.g. LeCun)
            // Strict logic: 1 match / max(3, 1) = 1/3 = 0.33 match ratio.
            // Author score max is 0.3 -> 0.3 * 0.33 = 0.1

            const result = calculateConfidenceWithBreakdown(mockCitation, {
                title: 'Deep Learning',
                authors: ['Yann LeCun'], // Only 1 out of 3
                year: 2015,
                url: 'http://example.com'
            });

            // Author score should be significantly lower than max (0.3)
            expect(result.score).toBeLessThan(0.9);
            // 0.5 (Title) + 0.2 (Year) + ~0.1 (Author) = ~0.8
        });

        it('should handle different year', () => {
            const result = calculateConfidenceWithBreakdown(mockCitation, {
                title: 'Deep Learning',
                authors: ['Yann LeCun', 'Yoshua Bengio', 'Geoffrey Hinton'],
                year: 2000, // Very different
                url: 'http://example.com'
            });

            expect(result.breakdown.year.matched).toBe(false);
            expect(result.breakdown.year.score).toBe(0);
            expect(result.score).toBeLessThanOrEqual(0.8);
        });
    });
});
