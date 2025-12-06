const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Manually parse .env to avoid dependency issues in this script
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
    console.error('Error: GEMINI_API_KEY not found in .env');
    process.exit(1);
}

const TEST_MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

async function validateKey() {
    console.log(`Testing Model: gemini-2.0-flash-lite...`);
    try {
        const response = await axios.post(`${TEST_MODEL_URL}?key=${apiKey}`, {
            contents: [{ parts: [{ text: "Hello" }] }]
        });
        console.log('Success! gemini-2.0-flash-lite is functional.');
        console.log('Response:', response.data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error('Error validating API key:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

validateKey();
