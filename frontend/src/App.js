import React, { useEffect, useState } from 'react';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function App() {
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition();

  const [stepsData, setStepsData] = useState(null); // Initialize as null

  const speakData = (data) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(data);
      utterance.rate = 1; // Adjust the speech rate as needed
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported in this browser.');
    }
  };


  // Define the getEquations function before using it in the useEffect
  const getEquations = async (text) => {
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
      return data.equation; // Return the equation from the response
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getSteps = async (equation) => { // Pass the equation as an argument
    try {
      const response = await fetch('http://localhost:8080/steps', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ equation: equation }), // Use the passed equation
      });

      if (!response.ok) {
        // Handle the error here
        console.error('Error Response:', response);
        throw new Error('Request failed');
      }

      // Handle the response here (e.g., parse JSON if the server responds with JSON)
      const data = await response.json();
      setStepsData(data);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSpacebarPress = (event) => {
    if (event.code === 'Space') {
      if (listening) {
        SpeechRecognition.stopListening(); // Stop listening
      } else {
        SpeechRecognition.startListening(); // Start listening
      }
    }
  };

  useEffect(() => {
    // Attach the spacebar press event listener when the component mounts
    window.addEventListener('keydown', handleSpacebarPress);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleSpacebarPress);
    };
  }, []);

  useEffect(() => {
    if (!listening && transcript && setStepsData != null) {
      // Log the transcript when not listening (microphone turned off)
      console.log(transcript);
      getEquations(transcript).then((equation) => {
        getSteps(equation); // Call the getSteps function with the obtained equation
      });
    }
  }, [listening, transcript]);

  return (
    <div className="App">
      <header className="App-header">
        This is our homepage
      </header>
      <div>
        {listening ? <p>Listening...</p> : <p>Not listening</p>}
        <button onClick={listening ? stopListening : startListening}>
          {listening ? 'Stop Listening' : 'Start Listening'}
        </button>
      </div>
      <div>
        <p>Transcript: {transcript}</p>
      </div>
    </div>
  );
}

export default App;