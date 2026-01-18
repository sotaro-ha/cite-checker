import { render, screen } from '@testing-library/react';
import { CitationCardList } from '../citation-card-list';
import { Citation } from '@/lib/citation-types';
import { SearchResult } from '@/lib/search-api';

// Mocks
jest.mock('next/link', () => {
    return ({ children }: { children: React.ReactNode }) => {
        return children;
    };
});

describe('CitationCardList', () => {
    const mockCitations: Citation[] = [
        {
            id: '1',
            title: 'Test Title',
            authors: 'Test Author',
            year: '2020',
            venue: 'Test Venue',
            raw: 'Raw citation text'
        }
    ];

    const mockResults: Record<string, SearchResult> = {
        '1': {
            citation: mockCitations[0],
            found: true,
            source: 'crossref',
            confidence: 0.95,
            paper: {
                title: 'Test Title',
                authors: ['Test Author'],
                year: 2020,
                url: 'http://example.com',
                doi: '10.1234/test'
            }
        }
    };

    it('renders citations correctly', () => {
        render(<CitationCardList citations={mockCitations} results={mockResults} detectedStyle="APA" lang="en" />);

        // Title appears in both the "Extracted" section and the "Result" link, so we expect multiple
        expect(screen.getAllByText('Test Title').length).toBeGreaterThan(0);
        // Same for author
        expect(screen.getAllByText('Test Author').length).toBeGreaterThan(0);
        expect(screen.getByText('via Crossref')).toBeInTheDocument();
        // Raw text was removed from UI, so we shouldn't expect it
        // expect(screen.getByText('Raw citation text')).toBeInTheDocument();
    });

    it('shows warning triangle for low confidence match', () => {
        const lowConfResults = {
            '1': {
                ...mockResults['1'],
                confidence: 0.8 // Low confidence
            }
        };

        const { container } = render(<CitationCardList citations={mockCitations} results={lowConfResults} detectedStyle="APA" lang="en" />);

        // We expect an AlertTriangle (which usually is an svg)
        // In testing-library we often search by accessible name (if available) or class
        // Since we are using lucide-react, let's verify if the "amber-500" class (part of warning styling) is applied
        const warningIcon = container.querySelector('.text-amber-500');
        expect(warningIcon).toBeInTheDocument();
    });
});
