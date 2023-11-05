import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import dotenv from 'dotenv';
dotenv.config();

// Step-by-step solution from an equation using Wolfram Alpha Steps API
async function wolframFunction(equation) {
   const app_id = process.env.WOLFRAM_STEPS_APP_ID;
   const query = "solve " + equation;
   const encodedInput = encodeURIComponent(query);
   const url = `https://api.wolframalpha.com/v2/query?appid=${app_id}&input=${encodedInput}&podstate=Result__Step-by-step+solution&format=plaintext`;
   try {
      const res = await axios.get(url);
      const xml_data = res.data;

      // Convert XML to JSON
      const result = await parseStringPromise(xml_data, { explicitArray: false, ignoreAttrs: true });

      let impliedEquation = "";
      let solution = "";
      let steps = "";

      const pods = result.queryresult.pod;

      if (Array.isArray(pods)) {
         impliedEquation = pods[0].subpod.plaintext

         if(!Array.isArray(pods[1].subpod) && pods[1].subpod !== ""){
            solution = pods[1].subpod.plaintext
         }
         else {
            let number_subpods = pods[1].subpod.length;
            for(let i = 0; i < number_subpods; i++){
               // Last subpod -> steps to solution
               if(i + 1 >= pods[1].subpod.length && i != 0){
                  steps = pods[1].subpod[i].plaintext
               }
               else{
                  // All others -> solutions
                  solution += pods[1].subpod[i].plaintext
               }
            }
         }
      }

      // Returning the results
      return { equation: impliedEquation, solution, steps };

   } catch (error) {
      console.error('Error in wolframFunction:', error);
      throw error;
   }
}

export default wolframFunction;