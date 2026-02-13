// server.js

// Import necessary libraries
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001; // Port for your backend server

// Middlewares
app.use(cors()); // Allows your React frontend to communicate with this server
app.use(bodyParser.json()); // Parses incoming JSON requests

// Define the API endpoints for your local models
const OLLAMA_API_URL = 'http://127.0.0.1:11434/api/generate';
const SD_API_URL = 'http://127.0.0.1:7860/sdapi/v1/txt2img'; // Ensure AUTOMATIC1111 is running with the --api flag

// Main endpoint to generate the storybook
app.post('/generate-storybook', async (req, res) => {
    console.log('Received request to generate storybook...');
    const { userPrompt } = req.body;

    if (!userPrompt) {
        return res.status(400).json({ error: 'User prompt is required.' });
    }

    try {
        // Step 1: Generate the story and image prompts with Llama 3
        console.log('Generating story and image prompts with Llama 3...');
        const llamaResponse = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3', // The model you pulled with Ollama
                prompt: `Generate a short, multi-page story for a children's book based on the following theme: "${userPrompt}". 
                         The output should be a single JSON array named "pages". Each object in the array must have two keys: 
                         "text" (for the story content) and "imagePrompt" (a detailed description for a text-to-image model).
                         Example format: {"pages":[{"text": "...", "imagePrompt": "..."}, {"text": "...", "imagePrompt": "..."}]}`,
                stream: false,
                format: 'json',
            }),
        });

        if (!llamaResponse.ok) {
            throw new Error(`Ollama API error: ${llamaResponse.statusText}`);
        }

        const data = await llamaResponse.json();
        const storyData = JSON.parse(data.response); // Parse the JSON string from Ollama's response
        const storyPages = storyData.pages;

        // Step 2: Generate an image for each page using Stable Diffusion
        console.log('Generating images for each page...');
        const fullStorybook = [];

        for (const page of storyPages) {
            const sdResponse = await fetch(SD_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: page.imagePrompt,
                    steps: 20, // Lower steps for faster generation
                    width: 512,
                    height: 512,
                }),
            });

            if (!sdResponse.ok) {
                throw new Error(`Stable Diffusion API error: ${sdResponse.statusText}`);
            }

            const sdData = await sdResponse.json();
            
            // The image is returned as a Base64 string in the 'images' array
            const imageUrl = `data:image/png;base64,${sdData.images[0]}`;

            fullStorybook.push({
                text: page.text,
                imageUrl: imageUrl,
            });
        }

        // Step 3: Send the complete storybook back to the frontend
        res.status(200).json({ success: true, storybook: fullStorybook });
        console.log('Storybook successfully generated and sent to frontend!');

    } catch (error) {
        console.error('Error generating storybook:', error);
        res.status(500).json({ error: `Failed to generate storybook: ${error.message}` });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});