/*
Sample input:
Equation: x^2-5x+6=0
Steps:
x^2 - 5 6 x = 0
x^2 - 5 x 6 = x^2 - 30 x:
x^2 - 30 x = 0
Factor x from the left hand side:
x (x - 30) = 0
Split into two equations:
x - 30 = 0 or x = 0
Add 30 to both sides:
Answer: |
 | x = 30 or x = 0
*/

async function toReadable(equation, steps) {
   console.log(`Equation: ${equation}`);
   console.log(`Steps: ${steps}`);

   return "First we... then...";
} 

export default toReadable;

