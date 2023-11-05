import React, { useEffect, useState } from 'react';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {speakData, getEquations, getSteps} from './function.js';

function App() {
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition();
  const [stepsData, setStepsData] = useState(null);

  async function getSteps(eqResult) {
    try {
      let equation = eqResult.equation;
      let showSteps = eqResult.showSteps;
      const response = await fetch('http://localhost:8080/steps', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ equation: equation, showSteps: showSteps}),
      });
  
      if (!response.ok) {
        console.error('Error Response:', response);
        throw new Error('Request failed');
      }
  
      const data = await response.json();
      console.log(data);
      setStepsData(data);
  
      // Assuming you have a function defined to speak the data
      speakData(data);
  
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // HANDLES SPACE PRESS
  const handleSpacebarPress = (event) => {
    if (event.code === 'Space') {
      if (listening) {
        SpeechRecognition.stopListening(); // Stop listening
      } else {
        SpeechRecognition.startListening(); // Start listening
      }
    }
  };

  // HANDLES ESCAPE PRESS
  const handleEscapePress = (event) => {
    if (event.code === 'Escape') {
      sayInstructions();
    }
  };

  // READS OUT THE INSTRUCTIONS
  const sayInstructions = () => {
    const speechSynthesis = window.speechSynthesis;
    const instructions = new SpeechSynthesisUtterance('Hi, this is how you use it. Press the ESC key if you want to repeat the instructions. Please press the spacebar to use our application.');
    speechSynthesis.speak(instructions);
  };
  
  useEffect(() => {
    // Attach the spacebar press event listener when the component mounts
    window.addEventListener('keydown', handleSpacebarPress);
    window.addEventListener('keydown', handleEscapePress);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleSpacebarPress);
      window.removeEventListener('keydown', handleEscapePress);
    };
  }, []);

  // RUNS ALL THE FUNCTIONS
  useEffect(() => {
    if (!listening && transcript) {
      // Log the transcript when not listening (microphone turned off)
      console.log(transcript);
      getEquations(transcript).then((eqResult) => {
        getSteps(eqResult);
      });
    }
  }, [listening, transcript]);

  return (
    <div>
      {listening ? <p>Listening...</p> : <p>Not listening</p>}

      {listening ? 'Stop Listening' : 'Start Listening'}
  
      <div>
        <p>Transcript: {transcript}</p>
      </div>

      {stepsData && (
      <div>
        <p>Steps Result:</p>
        <ul>
          {stepsData.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>
    )}
  
      
    </div>
  );
}  

export default App;