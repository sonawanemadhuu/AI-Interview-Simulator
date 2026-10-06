import { useState, useRef } from "react";
import "./App.css";

const BACKEND_URL = "http://127.0.0.1:8000";

const questionSets = {
  Technical: [
    "What is Python?",
    "What is SQL?",
    "What is a Decision Tree?",
    "What is the difference between classification and regression?",
    "What is Object-Oriented Programming?",
  ],

  "AI / ML": [
    "What is Machine Learning?",
    "What is Artificial Intelligence?",
    "What is supervised learning?",
    "What is overfitting in Machine Learning?",
    "What is the difference between AI and Machine Learning?",
  ],

  HR: [
    "Tell me about yourself.",
    "What are your strengths?",
    "What is your biggest weakness?",
    "Why should we hire you?",
    "Where do you see yourself in five years?",
  ],
};


/* ==================================================
   HEADER
================================================== */

function Header() {
  return (
    <header className="navbar">

      <div className="brand">
        <div className="brand-icon">AI</div>

        <div className="brand-name">
          <span>AI</span> Interview Simulator
        </div>
      </div>

      <div className="nav-right">

        <div className="nav-badge">
          AI Powered
        </div>

        <div className="nav-message">
          Stay Ready, Build Your Future
          <span>↗</span>
        </div>

      </div>

    </header>
  );
}


/* ==================================================
   FEATURE BAR
================================================== */

function FeatureBar() {
  return (
    <div className="feature-bar">

      <div className="feature-item">
        <span className="feature-icon">⚡</span>
        <span>Real-time Feedback</span>
      </div>

      <div className="feature-divider"></div>

      <div className="feature-item">
        <span className="feature-icon">📊</span>
        <span>Track Your Progress</span>
      </div>

      <div className="feature-divider"></div>

      <div className="feature-item">
        <span className="feature-icon">🛡️</span>
        <span>Build Confidence</span>
      </div>

    </div>
  );
}


/* ==================================================
   GET RESULT VALUE
================================================== */

function getScore(result, key) {
  const value = Number(result?.[key]);

  return Number.isFinite(value)
    ? Math.max(0, Math.min(100, Math.round(value)))
    : 0;
}


/* ==================================================
   PERFORMANCE LABEL
================================================== */

function getPerformanceLabel(score) {
  if (score >= 80) {
    return {
      label: "Strong",
      className: "strong",
      icon: "🟢",
    };
  }

  if (score >= 60) {
    return {
      label: "Good",
      className: "good",
      icon: "🟡",
    };
  }

  return {
    label: "Needs Improvement",
    className: "needs-improvement",
    icon: "🔴",
  };
}


/* ==================================================
   MAIN APP
================================================== */

function App() {

  const [started, setStarted] = useState(false);

  const [interviewType, setInterviewType] =
    useState("Technical");

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] =
    useState("");

  const [answers, setAnswers] =
    useState([]);

  const [results, setResults] =
    useState([]);

  const [finished, setFinished] =
    useState(false);

  const [backendStatus, setBackendStatus] =
    useState("");

  const [recording, setRecording] =
    useState(false);

  const [recordingSupported, setRecordingSupported] =
    useState(true);

  const recognitionRef =
    useRef(null);

  const transcriptRef =
    useRef("");

  const questions =
    questionSets[interviewType];


  /* ==================================================
     START INTERVIEW
  ================================================== */

  const startInterview = async () => {

    try {

      const response =
        await fetch(`${BACKEND_URL}/`);

      if (response.ok) {
        setBackendStatus(
          "Backend connected successfully!"
        );
      }

    } catch {

      setBackendStatus(
        "Backend connection failed."
      );

    }

    setStarted(true);
  };


  /* ==================================================
     VOICE RECORDING
  ================================================== */

  const startRecording = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      setRecordingSupported(false);

      return;
    }

    transcriptRef.current = answer;

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setRecording(true);
    };

    recognition.onresult = (event) => {

      let newFinalText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        if (event.results[i].isFinal) {

          newFinalText +=
            event.results[i][0].transcript;
        }
      }

      if (newFinalText.trim()) {

        transcriptRef.current =
          transcriptRef.current
            ? `${transcriptRef.current} ${newFinalText.trim()}`
            : newFinalText.trim();

        setAnswer(
          transcriptRef.current
        );
      }
    };

    recognition.onerror = (event) => {

      console.log(
        "Speech recognition error:",
        event.error
      );

      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognitionRef.current =
      recognition;

    recognition.start();
  };


  const stopRecording = () => {

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setRecording(false);
  };


  /* ==================================================
     SUBMIT ANSWER
  ================================================== */

  const submitAnswer = async () => {

    if (!answer.trim()) {
      return;
    }

    if (recording) {
      stopRecording();
    }

    const answerText =
      answer.trim();

    const newAnswers = [
      ...answers,
      answerText,
    ];

    setAnswers(newAnswers);

    let evaluation = {
      technical: 0,
      communication: 0,
      confidence: 0,
      feedback: "",
      strengths: "",
      improvement: "",
    };


    /* ----------------------------------------------
       SEND ANSWER TO BACKEND
    ---------------------------------------------- */

    try {

      const response =
        await fetch(
          `${BACKEND_URL}/analyze`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              answer: answerText,
            }),
          }
        );

      const data =
        await response.json();

      if (data.success) {

        evaluation = {
          ...evaluation,
          ...data,
        };
      }

    } catch (error) {

      console.log(
        "Backend error:",
        error
      );

    }


    /* ----------------------------------------------
       SAVE QUESTION + ANSWER + EVALUATION
    ---------------------------------------------- */

    const questionResult = {

      question:
        questions[currentQuestion],

      answer:
        answerText,

      ...evaluation,
    };

    setResults((previous) => [
      ...previous,
      questionResult,
    ]);


    /* ----------------------------------------------
       NEXT QUESTION
    ---------------------------------------------- */

    setAnswer("");

    transcriptRef.current = "";

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        currentQuestion + 1
      );

    } else {

      setFinished(true);
    }
  };


  /* ==================================================
     RESTART
  ================================================== */

  const restartInterview = () => {

    if (recording) {
      stopRecording();
    }

    setStarted(false);
    setFinished(false);

    setCurrentQuestion(0);

    setAnswer("");

    setAnswers([]);

    setResults([]);

    setBackendStatus("");

    setRecordingSupported(true);

    transcriptRef.current = "";
  };


  /* ==================================================
     AVERAGE SCORE
  ================================================== */

  const average = (key) => {

    if (!results.length) {
      return 0;
    }

    return Math.round(
      results.reduce(
        (sum, item) =>
          sum + getScore(item, key),
        0
      ) / results.length
    );
  };


  /* ==================================================
     OVERALL SCORE
  ================================================== */

  const overallScore = () => {

    if (!results.length) {
      return 0;
    }

    return Math.round(
      (
        average("technical") +
        average("communication") +
        average("confidence")
      ) / 3
    );
  };


  /* ==================================================
     HOME PAGE
  ================================================== */

  if (!started) {

    return (

      <div className="app">

        <Header />

        <main className="home">

          <div className="hero-glow"></div>

          <div className="eyebrow">
            ✦ AI-POWERED INTERVIEW PRACTICE
          </div>

          <h1>
            AI Interview
            <br />

            <span className="gradient-text">
              Simulator
            </span>
          </h1>

          <p className="hero-description">

            Practice real interview questions,
            improve your confidence,
            and get instant

            <br className="desktop-break" />

            AI-powered feedback.

          </p>


          <div className="type-section">

            <h3>

              <span></span>

              Choose Interview Type

              <span></span>

            </h3>


            <div className="type-buttons">

              <button
                className={
                  interviewType === "Technical"
                    ? "type-btn active"
                    : "type-btn"
                }

                onClick={() =>
                  setInterviewType(
                    "Technical"
                  )
                }
              >

                <div className="card-icon blue-icon">
                  💻
                </div>

                <div className="card-title">
                  Technical
                  <span>→</span>
                </div>

                <div className="card-description">
                  Practice coding, problem solving
                  and technical concepts.
                </div>

              </button>


              <button
                className={
                  interviewType === "AI / ML"
                    ? "type-btn active"
                    : "type-btn"
                }

                onClick={() =>
                  setInterviewType(
                    "AI / ML"
                  )
                }
              >

                <div className="card-icon purple-icon">
                  🤖
                </div>

                <div className="card-title">
                  AI / ML
                  <span>→</span>
                </div>

                <div className="card-description">
                  Solve ML problems, understand
                  concepts and build your skills.
                </div>

              </button>


              <button
                className={
                  interviewType === "HR"
                    ? "type-btn active"
                    : "type-btn"
                }

                onClick={() =>
                  setInterviewType("HR")
                }
              >

                <div className="card-icon green-icon">
                  👔
                </div>

                <div className="card-title">
                  HR
                  <span>→</span>
                </div>

                <div className="card-description">
                  Get ready for behavioral questions
                  and ace your interviews.
                </div>

              </button>

            </div>

          </div>


          <button
            className="start-btn"
            onClick={startInterview}
          >

            <span className="play-icon">
              ▶
            </span>

            Start Interview

          </button>


          <FeatureBar />

        </main>

      </div>
    );
  }


  /* ==================================================
     RESULTS PAGE
  ================================================== */

  if (finished) {

    const overall =
      overallScore();

    const performance =
      getPerformanceLabel(
        overall
      );


    return (

      <div className="app">

        <Header />

        <main className="dashboard">


          {/* ------------------------------------------
             RESULT HEADER
          ------------------------------------------ */}

          <div className="dashboard-top">

            <div>

              <div className="eyebrow">
                INTERVIEW COMPLETE
              </div>

              <h2>
                Your Performance
              </h2>

              <p>
                Here's your detailed
                interview performance report.
              </p>

            </div>


            <button
              className="secondary-btn"
              onClick={restartInterview}
            >
              🔄 Retake Interview
            </button>

          </div>


          {/* ------------------------------------------
             OVERALL SCORE
          ------------------------------------------ */}

          <div className="score-card">

            <div className="score-circle">

              <span>
                {overall}
              </span>

              <small>
                /100
              </small>

            </div>


            <div className="score-content">

              <div
                className={`result-badge ${performance.className}`}
              >
                {performance.icon}{" "}
                {performance.label}
              </div>

              <h3>
                Overall Score
              </h3>

              <p>

                {overall >= 80
                  ? "Excellent performance! You demonstrated strong interview skills."
                  : overall >= 60
                  ? "Good performance. A little more practice can make your answers stronger."
                  : "Keep practicing. Focus on giving clearer and more detailed answers."
                }

              </p>

            </div>

          </div>


          {/* ------------------------------------------
             SCORE BREAKDOWN
          ------------------------------------------ */}

          <h3 className="section-heading">
            Performance Breakdown
          </h3>


          <div className="stats">

            <div className="stat-card">

              <span>💻</span>

              <h3>
                {average("technical")}/100
              </h3>

              <p>
                Technical
              </p>

            </div>


            <div className="stat-card">

              <span>💬</span>

              <h3>
                {average("communication")}/100
              </h3>

              <p>
                Communication
              </p>

            </div>


            <div className="stat-card">

              <span>🎯</span>

              <h3>
                {average("confidence")}/100
              </h3>

              <p>
                Confidence
              </p>

            </div>

          </div>


          {/* ------------------------------------------
             QUESTION-BY-QUESTION FEEDBACK
          ------------------------------------------ */}

          <h3 className="section-heading">
            Question-by-Question Feedback
          </h3>


          <div className="question-results">

            {results.map(
              (item, index) => {

                const questionScore =
                  Math.round(
                    (
                      getScore(
                        item,
                        "technical"
                      ) +

                      getScore(
                        item,
                        "communication"
                      ) +

                      getScore(
                        item,
                        "confidence"
                      )
                    ) / 3
                  );

                const itemPerformance =
                  getPerformanceLabel(
                    questionScore
                  );


                return (

                  <div
                    className="result-question-card"
                    key={index}
                  >


                    <div className="result-question-top">

                      <div>

                        <div className="question-label">
                          QUESTION {index + 1}
                        </div>

                        <h3>
                          {item.question}
                        </h3>

                      </div>


                      <div
                        className={`question-score ${itemPerformance.className}`}
                      >
                        <strong>
                          {questionScore}
                        </strong>

                        <span>
                          /100
                        </span>
                      </div>

                    </div>


                    <div
                      className={`performance-pill ${itemPerformance.className}`}
                    >
                      {itemPerformance.icon}{" "}
                      {itemPerformance.label}
                    </div>


                    <div className="your-answer">

                      <h4>
                        Your Answer
                      </h4>

                      <p>
                        {item.answer}
                      </p>

                    </div>


                    <div className="mini-scores">

                      <div>
                        <span>
                          Technical
                        </span>

                        <strong>
                          {getScore(
                            item,
                            "technical"
                          )}/100
                        </strong>
                      </div>


                      <div>
                        <span>
                          Communication
                        </span>

                        <strong>
                          {getScore(
                            item,
                            "communication"
                          )}/100
                        </strong>
                      </div>


                      <div>
                        <span>
                          Confidence
                        </span>

                        <strong>
                          {getScore(
                            item,
                            "confidence"
                          )}/100
                        </strong>
                      </div>

                    </div>


                    <div className="feedback-grid">

                      <div className="feedback-box positive">

                        <h4>
                          ✅ What You Did Well
                        </h4>

                        <p>

                          {item.strengths ||
                            item.feedback ||
                            (
                              questionScore >= 70
                                ? "Your answer showed a good understanding of the topic."
                                : "You attempted the question and provided a relevant response."
                            )
                          }

                        </p>

                      </div>


                      <div className="feedback-box improvement">

                        <h4>
                          💡 How to Improve
                        </h4>

                        <p>

                          {item.improvement ||
                            (
                              questionScore >= 80
                                ? "Keep your answers structured and support your points with examples."
                                : questionScore >= 60
                                ? "Try adding more explanation, technical details, or examples."
                                : "Try giving a clearer and more detailed answer with relevant concepts and examples."
                            )
                          }

                        </p>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>


          {/* ------------------------------------------
             GENERAL IMPROVEMENT TIPS
          ------------------------------------------ */}

          <div className="content-grid">

            <div className="panel">

              <h3>
                💡 Improvement Tips
              </h3>

              <div className="tip">

                <strong>
                  Give detailed answers
                </strong>

                <p>
                  Explain your ideas with
                  relevant examples.
                </p>

              </div>


              <div className="tip">

                <strong>
                  Improve communication
                </strong>

                <p>
                  Speak clearly and organize
                  your thoughts before answering.
                </p>

              </div>


              <div className="tip">

                <strong>
                  Keep practicing
                </strong>

                <p>
                  Regular practice can improve
                  your confidence and accuracy.
                </p>

              </div>

            </div>


            <div className="panel">

              <h3>
                📋 Interview Summary
              </h3>

              <div className="summary-row">

                <span>
                  Questions answered
                </span>

                <strong>
                  {answers.length}/
                  {questions.length}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Interview type
                </span>

                <strong>
                  {interviewType}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Overall score
                </span>

                <strong>
                  {overall}/100
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Status
                </span>

                <strong className="success">
                  Completed
                </strong>

              </div>

            </div>

          </div>


          {/* ------------------------------------------
             RETAKE BUTTON
          ------------------------------------------ */}

          <div className="final-action">

            <button
              className="start-btn"
              onClick={restartInterview}
            >
              🔄 Retake Interview
            </button>

          </div>

        </main>

      </div>
    );
  }


  /* ==================================================
     INTERVIEW PAGE
  ================================================== */

  return (

    <div className="app">

      <Header />

      <main className="interview">

        <div className="interview-top">

          <div>

            <div className="eyebrow">
              {interviewType.toUpperCase()} INTERVIEW
            </div>

          </div>


          <span className="question-counter">
            Question{" "}
            {currentQuestion + 1} /{" "}
            {questions.length}
          </span>

        </div>


        {/* ------------------------------------------
           PROGRESS
        ------------------------------------------ */}

        <div className="progress">

          <div
            style={{
              width:
                `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
            }}
          />

        </div>


        {/* ------------------------------------------
           QUESTION DOTS
        ------------------------------------------ */}

        <div className="question-dots">

          {questions.map(
            (_, index) => (

              <div
                key={index}
                className={
                  index <
                  currentQuestion
                    ? "dot completed"
                    : index ===
                      currentQuestion
                    ? "dot current"
                    : "dot"
                }
              >
                {index <
                currentQuestion
                  ? "✓"
                  : index + 1}
              </div>

            )
          )}

        </div>


        {/* ------------------------------------------
           QUESTION CARD
        ------------------------------------------ */}

        <div className="question-card">

          <div className="question-number">
            QUESTION{" "}
            {currentQuestion + 1}
          </div>


          <h2>
            {questions[currentQuestion]}
          </h2>


          <textarea
            value={answer}
            onChange={(e) => {

              setAnswer(
                e.target.value
              );

              transcriptRef.current =
                e.target.value;

            }}
            placeholder="Type your answer here..."
          />


          {!recordingSupported && (

            <p className="recording-error">
              Voice recording is not supported
              in this browser. Try Google Chrome.
            </p>

          )}


          <div className="voice-buttons">

            {!recording ? (

              <button
                className="record-btn"
                onClick={startRecording}
              >
                🎤 Start Recording
              </button>

            ) : (

              <button
                className="stop-btn"
                onClick={stopRecording}
              >
                ⏹ Stop Recording
              </button>

            )}

          </div>


          {recording && (

            <div className="recording-status">
              🔴 Recording...
              <br />
              Speak your answer
            </div>

          )}


          <button
            className="start-btn interview-submit"
            onClick={submitAnswer}
          >

            {currentQuestion ===
            questions.length - 1
              ? "Finish Interview"
              : "Submit Answer →"}

          </button>

        </div>

      </main>

    </div>
  );
}

export default App;