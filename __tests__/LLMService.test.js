import { LLMService } from '../src/services/LLMService';
import { DatabaseService } from '../src/services/DatabaseService';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
jest.mock('../src/services/DatabaseService', () => ({
    DatabaseService: {
        addEvent: jest.fn(),
        searchEvents: jest.fn(),
    },
}));

describe('LLMService', () => {
    const mockGeminiResponse = (responseText) => ({
        data: {
            candidates: [
                {
                    content: {
                        parts: [{ text: responseText }],
                    },
                },
            ],
        },
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('logEvent', () => {
        it('should parse input and save to database', async () => {
            const userInput = 'I drank coffee';
            const mockParsed = {
                event: 'drank coffee',
                timestamp: '2023-10-27T10:00:00.000Z',
            };

            // Mock Gemini response
            axios.post.mockResolvedValue(mockGeminiResponse(JSON.stringify(mockParsed)));

            const result = await LLMService.logEvent(userInput);

            // Verify parse result
            expect(result).toEqual(mockParsed);

            // Verify DB call
            expect(DatabaseService.addEvent).toHaveBeenCalledWith(
                mockParsed.event,
                mockParsed.timestamp
            );
        });

        it('should return null for empty input', async () => {
            const result = await LLMService.logEvent('');
            expect(result).toBeNull();
            expect(DatabaseService.addEvent).not.toHaveBeenCalled();
        });

        it('should handle API errors', async () => {
            axios.post.mockRejectedValue(new Error('API Error'));
            await expect(LLMService.logEvent('input')).rejects.toThrow('API Error');
        });
    });

    describe('parseSearchQuery', () => {
        it('should parse query and call searchEvents', async () => {
            const userInput = 'When did I drink coffee?';
            const mockParsed = {
                keywords: 'coffee',
                dateRange: null,
            };
            const mockSearchResults = [{
                id: 1,
                event_text: 'drank coffee',
                timestamp: '2023-10-27T10:00:00.000Z'
            }];

            // Mock Gemini response
            axios.post.mockResolvedValue(mockGeminiResponse(JSON.stringify(mockParsed)));
            // Mock DB search result
            DatabaseService.searchEvents.mockResolvedValue(mockSearchResults);

            const result = await LLMService.parseSearchQuery(userInput);

            // Verify DB call params
            expect(DatabaseService.searchEvents).toHaveBeenCalledWith(
                'coffee',
                undefined,
                undefined
            );

            // Verify return value
            // Verify return value matches expected data
            expect(result).toEqual(mockSearchResults);
            expect(result[0].event_text).toBe('drank coffee');
            expect(result[0].timestamp).toBe('2023-10-27T10:00:00.000Z');
        });
    });
});
