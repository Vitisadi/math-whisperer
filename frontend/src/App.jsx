import React, { useEffect, useState } from 'react';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {getEquations } from './function.js';
import {speakNext, setData} from './speech.js';

function App() {
  const { transcript, listening } = useSpeechRecognition();//startListening, stopListening
  const [stepsData, setStepsData] = useState(null);
  const [spokenValue, setSpokenValue] = useState(0); // Define spokenValue state

  async function getSteps(equation) {
    try {
      const response = await fetch('http://localhost:8080/steps', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ equation: equation }),
      });
  
      if (!response.ok) {
        console.error('Error Response:', response);
        throw new Error('Request failed');
      }
  
      const data = await response.json();
      console.log(data);
      setStepsData(data);
  
      // Assuming you have a function defined to speak the data
      setData(data);
      speakNext();
  
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
    else if (event.code !== 'Escape'){
      let x = speakNext();
      setSpokenValue(x);
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
  // eslint-disable-next-line
  }, []);

  // RUNS ALL THE FUNCTIONS
  useEffect(() => {
    if (!listening && transcript) {
      // Log the transcript when not listening (microphone turned off)
      console.log(transcript);
      getEquations(transcript).then((equation) => {
        getSteps(equation);
      });
    }
  }, [listening, transcript]);

  const myComponentStyles = {
    // Other styles here
  };
  

  return (
    <div style={myComponentStyles}>

      <h1>MathWhisperer: Hear the Solution</h1>
      <h2>Why not change the world!</h2>


      <div>
        <h3>Transcript: {transcript}</h3>
      </div>

    {stepsData && (
  <div>
    <ul>
      {stepsData.map((step, index) => (
        <h4 key={index} className={spokenValue === index ? 'highlighted-step' : ''}>
          {index+1}) {step}
        </h4>
      ))}
    </ul>
  </div>
)}
      
    </div>
  );
}  

export default App;