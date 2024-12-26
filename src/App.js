import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import logo from './assets/logo.png';
import code from './assets/code.png';
import EmojiParticle from './Particles';

//Static Questionaires
import ArchVizsga from './static/ArchVizsga.json';
import ArchVizsgaZh1 from './static/ArchVizsgaZh1.json';
import ArchVizsgaZh2 from './static/ArchVizsgaZh2.json';
import DLRVizsga from './static/DLRVizsga.json';

function App() {
  const [file, setFile] = useState(null);
  const [rotation, setrotation] = useState(0);
  const [questionRight, setQuestionRight] = useState("");
  const [rightAnswers, setrightAnswers] = useState(0)
  const [QLength, setQLength] = useState(0)
  const [showReason, setShowReason] = useState(false)
  const [current, setCurrent] = useState(0)
  const [showResult, setshowResult] = useState(false)
  const [questionNum, setquestionNum] = useState(30);
  const [particles, setParticles] = useState([]);
  const timeoutRef = useRef(null); // Store the timeout ID
  const [staticQuestionaires, setStaticQuestionaires] = useState([])

  const spawnParticles = (emoji, count = 10) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newParticles = Array.from({ length: count }, (_, index) => {
      const randomX = (index * window.innerWidth / count);
      const randomY = (Math.random() * window.innerHeight - 200);
      return (
        <EmojiParticle
          key={Date.now() + index}
          emoji={emoji}
          startX={randomX}
          startY={randomY}
          delay={Math.max(0, Math.random())}
        />
      );
    });

    setParticles(newParticles);

    timeoutRef.current = setTimeout(() => {
      setParticles([]);
    }, 3000);
  };

  useEffect(() => {
    spawnParticles("👋", 20);

    loadStaticFile(DLRVizsga);
    loadStaticFile(ArchVizsga);
    loadStaticFile(ArchVizsgaZh1);
    loadStaticFile(ArchVizsgaZh2);
  }, [])

  const loadStaticFile = (file) => {
    try {
      if (file) {
        setStaticQuestionaires((prev) => [...prev, file]);
      }
    } catch (error) {
      console.error('Error loading the static file:', error);
    }
  };

  const shuffle = (array) => {
    let currentIndex = array.length;

    while (currentIndex != 0) {

      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

  }
  const parseQuestions = (event, staticFile = null) => {
    if (staticFile) {
      let randomizedQuestions = Object.values(staticFile.questions)

      shuffle(randomizedQuestions);

      randomizedQuestions = randomizedQuestions.slice(0, Math.min(questionNum, Object.values(staticFile.questions).length));

      setQLength(randomizedQuestions.length);
      setFile({
        ...staticFile,
        questions: randomizedQuestions,
      });
      setQuestionRight("");
      setrotation(0);
      setShowReason(false);
      setrightAnswers(0);
      setCurrent(0);
    } else {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const parsedData = JSON.parse(e.target.result);

            let randomizedQuestions = Object.values(parsedData.questions)

            shuffle(randomizedQuestions);

            randomizedQuestions = randomizedQuestions.slice(0, Math.min(questionNum, Object.values(parsedData.questions).length));

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
    }
  };


  const Answer = (answer, question) => {
    let ra = rightAnswers;
    if (answer === question.answer.toLowerCase()) {
      setQuestionRight("success");
      setrightAnswers(rightAnswers + 1);
      spawnParticles("👍", 20)

      ra += 1;
    } else {
      setQuestionRight("fail");
      spawnParticles("👎", 20)
    }
    setShowReason(true);
    setTimeout(() => {
      setQuestionRight("");
      setrotation(0);
      setShowReason(false);

      if (current < Object.keys(file.questions).length - 1) {
        setCurrent(current + 1);
      } else {
        setFile(null);
        setshowResult(true);
        spawnParticles((ra / QLength) >= 0.5 ? "✅" : "❌", 20)
        setTimeout(() => {
          setshowResult(false);
        }, 3000);
      }
    }, 2000);

  };


  return (
    <div className={`App ${questionRight}`}>
      <img style={{ width: 200, height: 200 }} src={logo} />
      {/* {!file &&<div className='code'><img src={code} /></div>} */}
      {!file && <div className='static-files'>
        {staticQuestionaires.map((staticFile, index) => (
          <div className='static-file' onClick={() => parseQuestions(null, staticFile)}>
            <h3>{staticFile.title}</h3>
            <p>{Object.values(staticFile.questions).length} questions</p>
          </div>
        ))}
      </div>}
      <br />
      {!file && <div style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
        <h1 className='btn' onClick={() => setquestionNum(questionNum + 1)}>+</h1>
        <h2>{questionNum} questions</h2>
        <h1 className='btn' onClick={() => setquestionNum(questionNum - 1)}>-</h1>
      </div>}
      {!file && <input type="file" onChange={parseQuestions} />}

      {/* Display the parsed file data */}
      {file && (
        <div className='file'>
          <h2>{file.title}</h2>
          <div className='questions'>
            <div className={`question ${rotation == 45 ? "rot-true" : ""} ${rotation == -45 ? "rot-false" : ""} ${questionRight}`}
              style={{
                borderRightWidth: rotation == 45 ? 40 : 20,
                borderLeftWidth: rotation == -45 ? 40 : 20,
              }}>
              <div className='answers'>
                <div className='answer' style={{ backgroundColor: "var(--false)" }}
                  onPointerEnter={() => setrotation(-45)}
                  onClick={() => Answer("Hamis", file.questions[current])}></div>

                <div className='answer' style={{ backgroundColor: "var(--true)" }}
                  onPointerEnter={() => setrotation(45)}
                  onClick={() => Answer("Igaz", file.questions[current])}></div>
              </div>

              <p style={{ color: "#1aa2dc" }}>#{current+1}</p>
              <p style={{ color: "#1aa2dc" }}>{file.questions[current].question}</p>

              {file.questions[current].reason && showReason &&
                <p style={{ color: "#1aa2dc" }}>Indoklás: {file.questions[current].reason}</p>}
            </div>
          </div>
        </div>
      )}
      {showResult &&
        <div style={{
          position: "absolute", width: "100%", height: "100%", backgroundColor: rightAnswers / QLength >= 0.5 ? "var(--true)" : "var(--false)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <h1>{rightAnswers} / {QLength}</h1>
        </div>}

      <div className="particle-container" style={{ position: "absolute", top: 0, left: 0 }}>
        {particles}
      </div>

      <footer>
        <a href='https://github.com/kokasmark/quest' target='blank' style={{ color: "#1aa2dc", textDecoration: 'none' }}>Quest Github</a>
        <a href='https://github.com/kokasmark' target='blank' style={{ color: "#1aa2dc", textDecoration: 'none' }}>Kokas Márk</a>
      </footer>
    </div>
  );
}

export default App;

