import React, { useEffect, useState } from 'react';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {speakData, getEquations, getSteps} from './function.js';
import Display_Navbar from './Navbar.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

function App() {
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition();
  const [stepsData, setStepsData] = useState(null);

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
      getEquations(transcript).then((equation) => {
        getSteps(equation);
      });
    }
  }, [listening, transcript]);

  const cardStyle = {
    fontSize: '20px', // Increase the font size as desired
  };

  return (

    <div>
      <Display_Navbar /> 
  
      <div>
        <Card style={cardStyle}>
          <Card.Header>Transcript</Card.Header>
          <Card.Body>
            <Card.Text>{transcript}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <br></br>

      {stepsData && (
        <div>
          <Card style={cardStyle}>
            <Card.Header>Steps Result</Card.Header>
            <Card.Body>
              <ol start="1"> {/* Use <ol> for ordered list, start at 1 */}
                {stepsData.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </Card.Body>
          </Card>
        </div>
      )}

    </div>
  );
}  

export default App;