import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
const router = express.Router();

// Import any other required modules here
// import wolframFunction from '../scripts/wolfram.js';
// import toReadable from '../scripts/toReadable.js';

// Get file route name (Same as file name)
const __filename = fileURLToPath(import.meta.url);
const parsed = path.parse(__filename);

router.put(`/${parsed.name}`, async (req, res) => {
  try {
    const { input } = req.body; // Use the correct key (input) from the request body

    // Implement your logic to process the input and return an equation
    // For now, I'm returning a sample equation
    const equation = "x^2-5x+6=0";

    res.status(200).json({ equation }); // Respond with the equation as JSON
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;