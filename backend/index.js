// Listen for space pressed
document.addEventListener('keydown', function(event) {
   /* PASS IN VALUE FOR EQUATION FROM FRONTEND */
   equation = "x^2-5x+6=0" 

   // Skip any key except space
   if (event.code !== 'Space') {
      return
   }

   event.preventDefault();

   // Get steps from wolfram
   let steps = wolframFunction(equation);

   // Convert to readable
   let readable = toReadable(equation, steps);

   console.log(readable)
   // PERFORM SOMETHING ON FRONTEND WITH IT
});

