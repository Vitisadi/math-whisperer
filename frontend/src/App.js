import React, { useEffect } from 'react';
import './App.css';

// import wolframFunction from './scripts/wolfram';
// import toReadable from './scripts/gpt';

function App() {
  // This function will be triggered when the spacebar is pressed
  const handleSpacebarPress = async (event) => {
    if (event.code === 'Space') {
      let equation = "x^2-5x+6=0";
      try {
        const response = await fetch('http://localhost:8080/steps', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ equation: equation }),
        });

        // Check if the request was successful
        if (!response.ok) {
          console.error('Error Response:', response);
          return
        } 

        const data = await response.json();
        console.log(data);

      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    // Attach the event listener
    window.addEventListener('keydown', handleSpacebarPress);

    // Remove the event listener on cleanup
    return () => {
      window.removeEventListener('keydown', handleSpacebarPress);
    };
  }, []); // The empty array ensures this effect is only run on mount and unmount

  return (
    <div className="App">
      <header className="App-header">
        This is our homepage
      </header>
    </div>
  );
}

export default App;
