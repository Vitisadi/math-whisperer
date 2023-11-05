// export const speakData = (dataArray) => {
//   if (!Array.isArray(dataArray) || dataArray.length === 0) {
//     console.error('Invalid or empty data array.');
//     return;
//   }

//   if ('speechSynthesis' in window) {
//     let currentIndex = 0;

//     const speakNext = () => {
//     if (currentIndex < dataArray.length) {
//       const utterance = new SpeechSynthesisUtterance(dataArray[currentIndex]);
//       utterance.rate = 1; // Adjust the speech rate as needed
//       utterance.onend = () => {
//         currentIndex++;
//         speakNext();
//       };

//       window.speechSynthesis.speak(utterance);
//     }
//   };

//     speakNext();
//   } else {
//     console.error('Speech synthesis not supported in this browser.');
//   }
// };

// Define the getEquations function before using it in the useEffect
export const getEquations = async (text) => {
  try {
    const response = await fetch('http://localhost:8080/getEquation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: text }),
    });

    if (!response.ok) {
      // Handle the error here
      console.error('Error Response:', response);
      throw Error('Request failed');
    }
      // Handle the response here (e.g., parse JSON if the server responds with JSON)
      const data = await response.json();
      console.log(data.equation);
      return data; // Return the equation from the response
    } catch (error) {
      console.error('Error:', error);

};