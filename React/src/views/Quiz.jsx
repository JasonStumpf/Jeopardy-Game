import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import '../static.css';
import Question from "./Question";
import { Button } from "react-bootstrap";
import { DataContext } from "../components/DataProvider";


const Quiz = () => {

  const {user, setUser} = useContext(DataContext)

  const getQuizData = async () => {
    let response = await axios.get('http://127.0.0.1:5000/quiz');
    return response.status === 200 ? response.data : null
  }

  const loadQuizData = async () => {
    let data = await getQuizData();
    console.log(data)
    setQuiz(data.question_list);
    setNames(data.category_list);
  }

  const [quiz, setQuiz] = useState(() => loadQuizData());
  const [names, setNames] = useState(() => loadQuizData());

  const [currentQuestion, setCurrentQuestion] = useState({});

  const setQuestion = (question) => {
    setCurrentQuestion(question)
  }

  const [matchingSections, setMatchingSections] = useState([]);

  useEffect(() => {
    const computeMatchingSections = () => {
      if (names.length > 0 && quiz.length > 0) {
        const matchingSections = names.map((section) => {
          return {
            'categoryId' : section.category_id,
            'category_name' : section.category_name,
            'questions' : quiz.filter((q) => q.category_id === section.category_id),
          };
        });
        setMatchingSections(matchingSections);
      }
    };
    computeMatchingSections();
  }, [names, quiz]);

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current.play();
  }, []);

  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  return (
    <div>
      <h1>PLEASE WELCOME TODAYS CONTESTANT:</h1>
      {user.id? <h2>{user.username.toUpperCase()}</h2> : null}
      <div className="container">
        {matchingSections && matchingSections.length > 0 ? (
          <div className="columns">
            {matchingSections.map((section) => (
              <div key={section.categoryId} className="column">
                <Table className="quiz-table">
                  <thead>
                    <tr>
                      <th className="category-name">{section.category_name.toUpperCase()}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.questions.map((question, index) => (
                      <tr key={index}>
                        <Button key={index} variant="primary" onClick={() => setQuestion(question)} disabled={answeredQuestions.includes(question.id)}>$ {question.value}</Button>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <Card.Header>Loading Knowledge</Card.Header>
          </Card>
        )}
      </div>
      <div className="container">
        {currentQuestion ? <Question q={currentQuestion} a={answeredQuestions} s={setAnsweredQuestions} /> : null}
      </div>
      <audio ref={audioRef} src="/board.mp3" />
    </div>
  );
}
export default Quiz;
