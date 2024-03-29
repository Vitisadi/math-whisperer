import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

async function toReadable(equation, steps) {
   const input = `equation: ${equation}\nsteps: ${steps}`;
   
   try {
      const response = await openai.chat.completions.create({
         model: "gpt-4",
         messages: [
            {
               role: "system",
               content: "Your task is to go step by step and convert a math solution to words. Do not use mathematical symbols in the output. Write out all terms and operations in words. Preface each step of the solution with the word 'STEP:', and make sure to start a new step at each logical point in the solution process where a new operation is performed or a new conclusion is reached. Be brief. Do not include redundant steps. Do not restate the problem or unnecessary steps. Ignore restating the equation. Ignore unnecessary steps. The answer will be its own steps."
            },
            {
               role:"user",
               content: input
            }
         ],
         temperature: 0.25
      })
      let steps = response.choices[0].message.content.split('STEP: ').filter(step => step.trim() !== '');
      return steps;
   } catch (error) {
      console.log("Error: ", error);
      return ""
   }
} 

export default toReadable;