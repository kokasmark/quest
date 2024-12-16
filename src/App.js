import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [rotation, setrotation] = useState(0);
  const [questionRight, setQuestionRight] = useState("");
  const [rightAnswers, setrightAnswers] = useState(0)
  const [QLength, setQLength] = useState(0)
  const [showReason,setShowReason] = useState(false)
  const [current,setCurrent] = useState(0)

  const parseQuestions = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          setQLength(Object.keys(parsedData.questions).length);
          setFile(parsedData); 
          setQuestionRight("");
          setrotation(0);
          setShowReason(false);
          setrightAnswers(0);
          setCurrent(0);
        } catch (error) {
          console.error('Error parsing the JSON file:', error);
        }
      };

      reader.readAsText(file);
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
        questions: prevFile.questions.filter((q) => q !== question)
      }));
      setQuestionRight("");
      setrotation(0);
      setShowReason(false);
      setCurrent(current+1);
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
            <div className={`question ${rotation == 45?"rot-true":""} ${rotation == -45?"rot-false":""} ${questionRight}`}>
                <p>{file.questions[current].question}</p>
                <div className='answers'>
                  <div className='answer' style={{backgroundColor:"#f008"}} 
                  onMouseEnter={()=>setrotation(-45)} onMouseLeave={()=>setrotation(0)}
                  onClick={()=>Answer("Hamis",file.questions[current])}></div>

                  <div className='answer' style={{backgroundColor:"#0f08"}} 
                  onMouseEnter={()=>setrotation(45)} onMouseLeave={()=>setrotation(0)}
                  onClick={()=>Answer("Igaz",file.questions[current])}></div>
                </div>
                {file.questions[current].reason && showReason && 
                  <p>Indoklás: {file.questions[current].reason}</p>}
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

