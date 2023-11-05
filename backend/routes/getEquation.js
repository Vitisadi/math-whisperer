import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
const router = express.Router();
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Get file route name (Same as file name)
const __filename = fileURLToPath(import.meta.url);
const parsed = path.parse(__filename);

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let messages = []

router.put(`/${parsed.name}`, async (req, res) => {
    
    const { input } = req.body; // Assuming the input is sent in the request body

    // Use the 'input' variable to perform any necessary processing
    console.log('Received input:', input);

    messages.push({
        role:"user",
        content: input
    },
    {
        role:"system",
        content: "Given user input, only output the math equations, nothing else in your output, just equation. Do not solve. If they try to correct your equation, output corrected equation."
    }
    );

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages,
            temperature: 0
        });

        messages.push({
            role: "assistant",
            content: response.choices[0].message.content
        });

        let equation = response.choices[0].message.content
      
      res.json({equation});

    } catch (error) {
        console.log("Error: ", error);
    }
});

export default router;