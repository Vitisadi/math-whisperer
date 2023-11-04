import React, { useEffect } from 'react';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function App() {
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition();

  // Define the sendText function before using it in the useEffect
  const sendText = async (text) => {
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
      console.log(data);
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
    if (!listening && transcript) {
      // Log the transcript when not listening (microphone turned off)
      console.log(transcript);
      sendText(transcript).then((equation) => {
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

  // // This function will be triggered when the spacebar is pressed
  // const handleSpacebarPress = async (event) => {
  //   if (event.code === 'Space') {
  //     let equation = "x^2-5x+6=0";
  //     try {
  //       const response = await fetch('http://localhost:8080/steps', {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ equation: equation }),
  //       });

  //       // Check if the request was successful
  //       if (!response.ok) {
  //         console.error('Error Response:', response);
  //         return
  //       } 

  //       const data = await response.json();
  //       console.log(data);

  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   // Attach the event listener
  //   window.addEventListener('keydown', handleSpacebarPress);

  //   // Remove the event listener on cleanup
  //   return () => {
  //     window.removeEventListener('keydown', handleSpacebarPress);
  //   };
  // }, []); // The empty array ensures this effect is only run on mount and unmount