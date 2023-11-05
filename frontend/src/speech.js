let speachData = []
let current_index = 0;

let speed = 1;

function speak(text){
   const utterance = new SpeechSynthesisUtterance(text);
   utterance.rate = speed; 
   window.speechSynthesis.speak(utterance);
}

export const speakNext = () => {
   let toSpeak = ""
   if(!Array.isArray(speachData) || speachData.length === 0){
      return;
      //toSpeak = "Solution not found yet."
   }
   else if(current_index >= speachData.length){
      toSpeak = "Can not go past last step."
   }
   else {
      toSpeak = speachData[current_index];
      current_index ++;
   }

   speak(toSpeak)
}

export const setData = (dataArray) => {
   if (!Array.isArray(dataArray) || dataArray.length === 0) {
      console.error('Invalid or empty data array.');
      return;
   }
      
   speachData = dataArray
   current_index = 0;
}


// export const speakData = (dataArray) => {
//    if (!Array.isArray(dataArray) || dataArray.length === 0) {
//      console.error('Invalid or empty data array.');
//      return;
//    }
 
//    if ('speechSynthesis' in window) {
//      let currentIndex = 0;
 
//      const speakNext = () => {
//      if (currentIndex < dataArray.length) {
//        const utterance = new SpeechSynthesisUtterance(dataArray[currentIndex]);
//        utterance.rate = 1; // Adjust the speech rate as needed
//        utterance.onend = () => {
//          currentIndex++;
//          speakNext();
//        };
 
//        window.speechSynthesis.speak(utterance);
//      }
//    };
 
//      speakNext();
//    } else {
//      console.error('Speech synthesis not supported in this browser.');
//    }
//  };