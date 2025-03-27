import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, Button, Modal, ProgressBar, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/DashboardProvider';
import './ListExams.css';

const GET_ALL_EXAMS = gql`
  query GetAllExams {
    allExams {
      nodes {
        id
        title
        description
        duration
        creatorId
        questionsByExamId {
          nodes {
            id
            text
            options
            correctAnswer
          }
        }
      }
    }
  }
`;

const GET_USER_ATTENDED_EXAMS = gql`
  query GetUserAttendedExams($userId: Int!) {
    userById(id: $userId) {
      scoresByUserId {
        nodes {
          examId
        }
      }
    }
  }
`;

const SUBMIT_EXAM_MUTATION = gql`
  mutation SubmitExam($input: CreateScoreInput!) {
    createScore(input: { score: $input }) {
      score {
        id
        examId
        userId
        percentage
        answers
      }
    }
  }
`;

const ListExams = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  // State management
  const [selectedExam, setSelectedExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);

  // Fetch all exams
  const { 
    loading: examsLoading, 
    error: examsError, 
    data: examsData,
    refetch: refetchExams
  } = useQuery(GET_ALL_EXAMS, {
    fetchPolicy: 'network-only'
  });

  // Fetch user's attended exams
  const { 
    loading: attendedLoading,
    data: attendedData
  } = useQuery(GET_USER_ATTENDED_EXAMS, {
    variables: { userId },
    skip: !userId
  });

  // Exam submission mutation
  const [submitExam] = useMutation(SUBMIT_EXAM_MUTATION);

  // Timer effect
  useEffect(() => {
    if (!selectedExam || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedExam, timeLeft]);

  // Start exam handler
  const handleStartExam = (exam) => {
    if (!exam.questionsByExamId?.nodes?.length) {
      setError("This exam has no questions");
      return;
    }

    setSelectedExam({
      ...exam,
      questions: exam.questionsByExamId.nodes
    });
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(exam.duration * 60);
    setError(null);
  };

  // Answer selection handler
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  // Exam submission handler
  const handleSubmitExam = async () => {
    try {
      const totalQuestions = selectedExam.questions.length;
      const correctAnswers = selectedExam.questions.reduce((count, question, index) => {
        return count + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
      }, 0);
      
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);

      await submitExam({
        variables: {
          input: {
            userId,
            examId: selectedExam.id,
            percentage,
            answers: JSON.stringify(selectedAnswers),
            createdAt: new Date().toISOString()
          }
        }
      });

      await refetchExams();
      navigate('/dashboard/scores');
    } catch (err) {
      setError(err.message);
      console.error("Exam submission failed:", err);
    }
  };

  // Check if user has attended an exam
  const hasAttendedExam = (examId) => {
    return attendedData?.userById?.scoresByUserId?.nodes?.some(
      score => score.examId === examId
    );
  };

  // Loading and error states
  if (examsLoading || attendedLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
        <p>Loading exams...</p>
      </div>
    );
  }

  if (examsError) {
    return (
      <Alert variant="danger">
        Error loading exams: {examsError.message}
      </Alert>
    );
  }

  const exams = examsData?.allExams?.nodes || [];

  return (
    <div className="list-exams-container">
      <h2 className="mb-4">Available Exams</h2>
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {exams.length === 0 ? (
        <Alert variant="info">No exams available yet</Alert>
      ) : (
        <div className="exam-grid">
          {exams.map((exam) => (
            <Card key={exam.id} className="exam-card">
              <Card.Body>
                <Card.Title>{exam.title}</Card.Title>
                <Card.Text className="text-muted">{exam.description}</Card.Text>
                <div className="exam-meta">
                  <span>Duration: {exam.duration} mins</span>
                  <span>Questions: {exam.questionsByExamId?.nodes?.length || 0}</span>
                </div>
                
                {hasAttendedExam(exam.id) ? (
                  <Button variant="outline-secondary" disabled className="w-100">
                    Already Taken
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={() => handleStartExam(exam)}
                    className="w-100"
                    disabled={!exam.questionsByExamId?.nodes?.length}
                  >
                    {exam.questionsByExamId?.nodes?.length ? 'Start Exam' : 'No Questions'}
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Exam Taking Modal */}
      {selectedExam && (
        <Modal
          show={!!selectedExam}
          onHide={() => setSelectedExam(null)}
          fullscreen
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedExam.title}</Modal.Title>
            <div className="ms-auto">
              <span className="badge bg-primary">
                Time: {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </Modal.Header>
          
          <Modal.Body>
            <ProgressBar
              now={((currentQuestionIndex + 1) / selectedExam.questions.length) * 100}
              label={`${currentQuestionIndex + 1}/${selectedExam.questions.length}`}
              className="mb-3"
            />

            <div className="question-container">
              <h5>Question {currentQuestionIndex + 1}</h5>
              <p className="question-text">
                {selectedExam.questions[currentQuestionIndex].text}
              </p>

              <Form>
                {selectedExam.questions[currentQuestionIndex].options.map((option, idx) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    id={`option-${idx}`}
                    label={option}
                    name="question-options"
                    checked={selectedAnswers[currentQuestionIndex] === idx}
                    onChange={() => handleAnswerSelect(currentQuestionIndex, idx)}
                    className="option-item"
                  />
                ))}
              </Form>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {currentQuestionIndex < selectedExam.questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmitExam}
                disabled={Object.keys(selectedAnswers).length !== selectedExam.questions.length}
              >
                Submit Exam
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ListExams;

