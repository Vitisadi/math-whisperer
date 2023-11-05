let speachData = []
let current_index = 0;

let speed = 1;

function speak(text){
   const utterance = new SpeechSynthesisUtterance(text);
   utterance.rate = speed; 
   window.speechSynthesis.speak(utterance);
}

export const speakNext = () => {
   let toSpeak = "";
   let x = 0;
      if(!Array.isArray(speachData) || speachData.length === 0){
      return;
      //toSpeak = "Solution not found yet."
   }
   else if(current_index >= speachData.length){
      toSpeak = "Can not go past last step."
   }
   else {
      toSpeak = speachData[current_index];
      x = current_index;
      current_index ++;
   }

   speak(toSpeak)

   return x;
}

export const setData = (dataArray) => {
   if (!Array.isArray(dataArray) || dataArray.length === 0) {
      console.error('Invalid or empty data array.');
      return;
   }
   speachData = dataArray
   current_index = 0;
}
