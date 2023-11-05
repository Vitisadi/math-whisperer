import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function Display_Navbar() {
  const navbarStyle = {
    backgroundColor: 'red',
    color: 'white',
    fontFamily: 'monospace', // Set the font-family to monospace
    fontSize: '20px', // Increase the font size
  };

  const nameStyle = {
    marginLeft: '0px',
  };

  const quoteStyle = {
    marginLeft: '325px', // Set the left margin to 0
  };

  const quoteTextStyle = {
    fontWeight: 'bold', // Make the text bold
  };

  const instructionsStyle = {
    fontSize: '24px', // Adjust font size for instructions
    marginTop: '20px', // Add some top margin for spacing
  };

  return (
    <div>
      <Navbar style={navbarStyle} variant="dark">
        <Container>
          <div className="d-flex justify-content-between">
            <div style={nameStyle}>
              <span className="quote-text" style={quoteTextStyle}>
                API MATH
              </span>
            </div>
            <div style={quoteStyle}>
              <div className="text-center">
                <span className="quote-text" style={quoteTextStyle}>
                  Why not change the world!
                </span>
              </div>
            </div>
          </div>
        </Container>
      </Navbar>
      <h1 style={instructionsStyle}>
        Hit the SPACE BUTTON to ask a question and start mic recording
      </h1>
      <h1 style={instructionsStyle}>
        Hit the ESCAPE BUTTON to REPEAT instructions
      </h1>
    </div>
  );
}

export default Display_Navbar;