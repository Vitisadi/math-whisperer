import React, { useEffect, useState } from 'react';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {getEquations } from './function.js';
import {speakNext, setData} from './speech.js';
import ReactLoading from 'react-loading';

function App() {
  const { transcript, listening } = useSpeechRecognition();//startListening, stopListening
  const [stepsData, setStepsData] = useState(null);
  const [spokenValue, setSpokenValue] = useState(0); // Define spokenValue state

  const Example = ({ type, color }) => (
      <div style={{ marginTop: '-200px' }}>
      <ReactLoading type={type} color={color} height={'60%'} width={'600px'} />
    </div>
  );

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

    else if (event.code !== 'Escape' && event.code !== 'Alt' && event.code !== 'Tab' && event.code !== 'Meta' && event.code !== 'KeyR'){
      let x = speakNext();
      setSpokenValue(x);
    }
  };

  // HANDLES ESCAPE PRESS
  const handleEscapePress = (event) => {
    if (event.code === 'Escape') {
      window.speechSynthesis.cancel();
      sayInstructions();
    }
  };

  // READS OUT THE INSTRUCTIONS
  const sayInstructions = () => {
    const speechSynthesis = window.speechSynthesis;
    const instructions = new SpeechSynthesisUtterance('Press the space bar to begin. The program will be listening for your math question and if you are looking for just the answer or the answer and explanation. After you finish speaking, our system will process your words into an equation and play the result. Press any key on your keyboard to hear the next step. If you want these instructions repeated, please press escape.');
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
      getEquations(transcript).then((eqResult) => {
        getSteps(eqResult);
      });
    }
  }, [listening, transcript]);


  return (
    <div>

      <h1>MathWhisperer: Hear the Solution</h1>
      <h2>Why not change the world!</h2>

      
      <div className='mic'>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
          {listening && (
          <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">
          <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
          <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
          </svg>)}
        </div>
      </div>
      
      <div>
        <h3>Transcript: {transcript}</h3>
      </div>

      {!stepsData && transcript && (
        <div>
          <h3>Answer:</h3>
          <Example></Example>
        </div>
      )}
    
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