import express from 'express';
import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';
const router = express.Router();

import wolframFunction from '../scripts/wolfram.js';
import toReadable from '../scripts/toReadable.js';

// Get file route name (Same as file name)
const __filename = fileURLToPath(import.meta.url);
const parsed = path.parse(__filename);

router.put(`/${parsed.name}`, async (req, res) => {
  try {
    const { equation, showSteps } = req.body;

    if (!equation) {
      return res.status(400).json({ error: 'Equation is required' });
    }

    // Get steps from wolfram
    const { equation: impliedEquation, solution, steps } = await wolframFunction(equation);

    // Could not find the solution
    if(solution === ""){
      res.json(["Sorry, we do not current support this functionality. Please try another equation."])
      return
    }

    else if (showSteps.toLowerCase() == "false"){
      res.json([solution]);
      return;
    }

    // Convert to readable
    let readable = await toReadable(equation, steps);
        
    res.json(readable);

    // res.json({steps});
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

export default router;