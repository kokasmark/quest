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
  const [showResult,setshowResult] = useState(false)
  const [questionNum, setquestionNum] = useState(30);

  const parseQuestions = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
  
          const randomizedQuestions = Object.values(parsedData.questions)
          .sort(() => Math.random() - 0.5) 
          .slice(0, Math.min(questionNum,Object.values(parsedData.questions).length));
      
          setQLength(randomizedQuestions.length);
          setFile({
            ...parsedData,
            questions: randomizedQuestions,
          });
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
      setQuestionRight("");
      setrotation(0);
      setShowReason(false);

      if (current < Object.keys(file.questions).length-1){
        setCurrent(current+1);
      }else{
        setFile(null);
        setshowResult(true);
        setTimeout(() => {
          setshowResult(false);
        }, 3000);
      }
    }, 2000);
   
  };
  

  return (
    <div className={`App ${questionRight}`}>
      <h1>Quest</h1>
      <h3>See if you get all the questions</h3>
      {!file &&<pre>
        {`
          {
            "title": "Questionaire title",
            "questions": [
                {
                "question": "The grass is green?",
                "answer": "Igaz",
                "reason": "Cuz it is"
                }
            ]
          }`}
      </pre>}
      <br />
      {!file &&<div style={{display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center',justifyContent: 'center'}}>
        <h1 className='btn' onClick={()=>setquestionNum(questionNum+1)}>+</h1>
        <h2>{questionNum} questions</h2>
        <h1 className='btn' onClick={()=>setquestionNum(questionNum-1)}>-</h1>
      </div>}
      {!file &&<input type="file" onChange={parseQuestions} />}
      
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
      {showResult && 
        <div style={{position: "absolute", width:"100%",height: "100%", backgroundColor: rightAnswers/QLength > 0.5 ? "greenyellow" : "red",
          display: "flex",alignItems: "center", justifyContent: "center"
        }}>
          <h1>{rightAnswers} / {QLength}</h1>
        </div>}
    </div>
  );
}

export default App;

