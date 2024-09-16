import React, { useState } from 'react';
import { questions } from './surveyData';
import $ from 'jquery';
import './App.css';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [screen, setScreen] = useState('welcome');

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSurveyComplete = () => {
    const customerId = new Date().getTime().toString();
    const data = {
      customerId,
      answers,
      status: 'COMPLETED',
    };


    localStorage.setItem("Submitted answers", data.customerId);
    $.ajax({
      url: 'http://localhost:5000/api/survey',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (response) {
        console.log('Survey submitted successfully!', response);
        console.log(data);
        setScreen('thankyou');
        setTimeout(() => {
          setScreen('welcome');
          setCurrentQuestion(0);
          setAnswers({});
        }, 5000);
      },
      error: function (xhr, status, error) {
        console.log('Failed to submit survey:', error);
      },
    });
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    return (
      <div className="survey">
        <h2>Customer Survey</h2>
        <p>{currentQuestion + 1}/{questions.length}</p>
        <h3>{question.questionText}</h3>

        {question.type === 'rating' ? (
          <div>
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option)}
                className={answers[question.id] === option ? 'selected' : ''}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        )}

        <div>
          <button className="previous"onClick={handlePrev} disabled={currentQuestion === 0}>
            Prev
          </button>
          {currentQuestion < questions.length - 1 ? (
            <button className= "next" onClick={handleNext}>Next</button>
          ) : (
            <button onClick={handleSurveyComplete}>Submit</button>
          )}
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    if (screen === 'welcome') {
      return (
        <div className="welcome-screen">
          <h1>Welcome to the Customer Survey</h1>
          <button className="welcome-s-button"onClick={() => setScreen('survey')}>Start</button>
        </div>
      );
    } else if (screen === 'survey') {
      return renderQuestion();
    } else if (screen === 'thankyou') {
      return (
        <div className="thank-you-screen">
          <h1>Thank you for your time!</h1>
        </div>
      );
    }
  };

  return <div className="App">{renderScreen()}</div>;
}

export default App;
