// server.js

// Import necessary libraries
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001; // Port for your backend server

// Middlewares
const corsOptions = {
  origin: 'https://plotfor.me', // Explicitly allow your production domain
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS with options to handle preflight requests
app.use(cors(corsOptions)); 
app.use(bodyParser.json());

// Define the API endpoints using Environment Variables for Production
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434/api/generate';
const SD_API_URL = process.env.SD_API_URL || 'http://127.0.0.1:7860/sdapi/v1/txt2img';

// Main endpoint to generate the storybook
app.post('/generate-storybook', async (req, res) => {
    console.log('Received request to generate storybook...');
    const { userPrompt } = req.body;

    if (!userPrompt) {
        return res.status(400).json({ error: 'User prompt is required.' });
    }

    try {
        // Step 1: Generate the story with OPTIMIZED settings for 10-15s consistency
        console.log(`Using Ollama at: ${OLLAMA_API_URL}`);
        const llamaResponse = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen2.5:1.5b', 
                prompt: `Generate a 5-page children's book story based on the theme: "${userPrompt}".
                         The output MUST be a JSON array named "pages" with EXACTLY 5 objects.
                         Each "text" field should be exactly 2 short sentences (approx 25 words).

                         CRITICAL IMAGE INSTRUCTION: Each "imagePrompt" must be a descriptive visual scene
                         and MUST start exactly with the phrase: "A vibrant kids crayon drawing style illustration of...".
                         Conclude the description with these stylistic tokens: "naive art, textured wax crayon strokes, bold primary colors, simple thick outlines, clean blank white background, storybook aesthetic".`,
                stream: false,
                format: 'json',
                options: {
                    num_ctx: 1024,      // Fast startup
                    num_predict: 400,   // Prevents over-generation
                    temperature: 0.7,   // Balance of creativity and speed
                    num_gpu: 29         // Uses all 29 layers on your RTX 3050
                }
            }),
        });

        if (!llamaResponse.ok) {
            throw new Error(`Ollama API error: ${llamaResponse.statusText}`);
        }

        const data = await llamaResponse.json();
        const storyData = JSON.parse(data.response); 
        const storyPages = storyData.pages;

        // Step 2: Generate an image for each page using Stable Diffusion
        console.log(`Using Stable Diffusion at: ${SD_API_URL}`);
        const fullStorybook = [];

        for (const page of storyPages) {
            const sdResponse = await fetch(SD_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: page.imagePrompt,
                    steps: 8,           // Kept at 8 for 5-second image speed
                    width: 512,
                    height: 512,
                }),
            });

            if (!sdResponse.ok) {
                throw new Error(`Stable Diffusion API error: ${sdResponse.statusText}`);
            }

            const sdData = await sdResponse.json();
            const imageUrl = `data:image/png;base64,${sdData.images[0]}`;

            fullStorybook.push({
                text: page.text,
                imageUrl: imageUrl,
            });
        }

        // Step 3: Send back to frontend
        res.status(200).json({ success: true, storybook: fullStorybook });
        console.log('Storybook successfully generated!');

    } catch (error) {
        console.error('Error generating storybook:', error);
        res.status(500).json({ error: `Failed to generate storybook: ${error.message}` });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});