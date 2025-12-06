import axios from 'axios';
import { DatabaseService } from './DatabaseService';
import { GEMINI_API_KEY } from '@env';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

export class LLMService {
    static async logEvent(userInput) {
        if (!userInput) return null;

        const now = new Date();
        const prompt = `
        User Input: "${userInput}"
        Current Time: ${now.toISOString()}
        
        Extract the event description and the implied timestamp.
        Return ONLY a JSON object with keys: "event" (string), "timestamp" (ISO string).
        Do not allow any markdown code blocks in the response.
        `;

        try {
            const response = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
                contents: [{ parts: [{ text: prompt }] }]
            });
            const text = response.data.candidates[0].content.parts[0].text;
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const { event, timestamp } = JSON.parse(cleanText);

            // Save directly to DB
            await DatabaseService.addEvent(event, timestamp);

            return { event, timestamp };
        } catch (error) {
            console.error('LLM Log Error:', error);
            throw error;
        }
    }

    static async parseSearchQuery(userInput) {
        const currentTimestamp = new Date().toISOString();
        const prompt = `
      You are a helpful assistant for a personal logging app.
      The user will ask a question to search their logs.
      Your task is to extract search parameters: "keywords" (for text search) and "dateRange" (start and end timestamps).
      
      Current Time: ${currentTimestamp}
      
      Rules:
      1. "keywords": Extract the main topic or action to search for. If the user asks "what did I do...", keywords might be empty or generic.
      2. "dateRange": Calculate start and end timestamps in ISO 8601 format (UTC) if the user specifies a time range (e.g., "yesterday", "last week"). If no time is specified, return null for dateRange.
      3. Return ONLY a valid JSON object. Do not include markdown formatting.
      
      Example Input: "When did I run?"
      Example Output: { "keywords": "run", "dateRange": null }
      
      Example Input: "What did I eat yesterday?" (Assuming Current Time is 2023-10-27T12:00:00Z)
      Example Output: { "keywords": "eat", "dateRange": { "start": "2023-10-26T00:00:00.000Z", "end": "2023-10-26T23:59:59.999Z" } }
      
      User Input: "${userInput}"
    `;

        try {
            const response = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
                contents: [{ parts: [{ text: prompt }] }]
            });

            const text = response.data.candidates[0].content.parts[0].text;
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const { keywords, dateRange } = JSON.parse(cleanText);

            return await DatabaseService.searchEvents(
                keywords,
                dateRange?.start,
                dateRange?.end
            );
        } catch (error) {
            console.error('LLM Search Error:', error);
            throw error;
        }
    }
}
