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
        try {
            // 1. Fetch all events (Context)
            const allEvents = await DatabaseService.getAllEvents();

            // 2. Prepare context for LLM
            const currentTimestamp = new Date().toISOString();
            const eventsContext = JSON.stringify(allEvents, null, 2);

            const prompt = `
            You are a smart Personal Log Assistant.
            
            Current Time: ${currentTimestamp}
            User Query: "${userInput}"
            
            Here is the full log of events:
            ${eventsContext}
            
            Task:
            1. Search the logs for any events relevant to the User Query.
            2. Match events regardless of tense (e.g., "make tea" matches "made tea") or slight phrasing differences.
            3. Return ONLY a valid JSON array of the matching event objects from the list above. 
            4. If no events match, return an empty array [].
            5. Do NOT include markdown formatting.
            `;

            // 3. Call LLM
            const response = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
                contents: [{ parts: [{ text: prompt }] }]
            });

            const text = response.data.candidates[0].content.parts[0].text;
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            // 4. Return results directly (already correct structure)
            const matchedEvents = JSON.parse(cleanText);

            return matchedEvents;

        } catch (error) {
            console.error('LLM Search Error:', error);
            throw error;
        }
    }
}
