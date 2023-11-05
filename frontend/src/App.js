import React, { useEffect } from 'react';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {getEquations, getSteps} from './function.js';

function App() {
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition();
  
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
    if (!listening && transcript) {
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