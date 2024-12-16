import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [rotation, setrotation] = useState(0);
  const [questionRight, setQuestionRight] = useState("");
  const [rightAnswers, setrightAnswers] = useState(0)
  const [QLength, setQLength] = useState(0)
  const [showReason,setShowReason] = useState(false)

  const parseQuestions = (event) => {
    const file = event.target.files[0]; // Get the file from the input

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          setQLength(Object.keys(parsedData.questions).length);
          setFile(parsedData); // Load the parsed JSON into the state
        } catch (error) {
          console.error('Error parsing the JSON file:', error);
        }
      };

      reader.readAsText(file); // Read the file as text
    }
  };

  const Answer = (answer, question) => {
    if (answer === question.answer) {
      setQuestionRight("success");
      setrightAnswers(rightAnswers + 1);
    } else {
      setQuestionRight("fail");
    }
    setShowReason(true);
    setTimeout(() => {
      setFile((prevFile) => ({
        ...prevFile,
        questions: prevFile.questions.filter((q) => q !== question) // Remove the answered question
      }));
      setQuestionRight("");
      setrotation(0);
      setShowReason(false);
    }, 2000);
   
  };
  

  return (
    <div className="App">
      <h1>Quest</h1>
      <h3>See if you get all the questions</h3>

      <input type="file" onChange={parseQuestions} />
      
      {/* Display the parsed file data */}
      {file && (
        <div className='file'>
          <h2>{file.title}</h2>
          <h3>{rightAnswers} / {QLength}</h3>
          <div className='questions'>
            {file.questions.map((question,index) => (
              <div key={index} className={`question ${rotation == 45?"rot-true":""} ${rotation == -45?"rot-false":""} ${questionRight}`}>
                <p>{question.question}</p>
                <div className='answers'>
                  <div className='answer' style={{backgroundColor:"#f008"}} 
                  onMouseEnter={()=>setrotation(-45)} onMouseLeave={()=>setrotation(0)}
                  onClick={()=>Answer("Hamis",question)}></div>

                  <div className='answer' style={{backgroundColor:"#0f08"}} 
                  onMouseEnter={()=>setrotation(45)} onMouseLeave={()=>setrotation(0)}
                  onClick={()=>Answer("Igaz",question)}></div>
                </div>
                {question.reason && showReason && 
                  <p>Indoklás: {question.reason}</p>}
              </div>
            ))

            }
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

