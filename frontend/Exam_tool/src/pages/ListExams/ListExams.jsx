import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, Button, Modal, ProgressBar, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/DashboardProvider';
import './ListExams.css';

// GraphQL queries and mutations
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

// Updated mutation to match what the server expects
const SUBMIT_EXAM_MUTATION = gql`
  mutation SubmitExam($examId: Int!, $userId: Int!, $percentage: Float!, $answers: String!) {
    createScore(
      input: {
        score: {
          examId: $examId
          userId: $userId
          percentage: $percentage
          answers: $answers
        }
      }
    ) {
      score {
        id
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Fetch all exams
  const {
    loading: examsLoading,
    error: examsError,
    data: examsData
  } = useQuery(GET_ALL_EXAMS);

  // Fetch user's attended exams
  const {
    loading: attendedLoading,
    data: attendedData
  } = useQuery(GET_USER_ATTENDED_EXAMS, {
    variables: { userId: parseInt(userId) },
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

  // Handle starting an exam
  const handleStartExam = (exam) => {
    // Make sure the exam has questions
    const questions = exam.questionsByExamId?.nodes || [];
    
    if (questions.length === 0) {
      setError("This exam has no questions");
      return;
    }

    // Format the questions properly
    const formattedQuestions = questions.map(question => {
      // Handle options - convert to array if needed
      let options = [];
      
      if (typeof question.options === 'string') {
        options = question.options.split(',').map(opt => opt.trim());
      } else if (Array.isArray(question.options)) {
        options = question.options;
      }

      return {
        ...question,
        options: options
      };
    });

    // Set the exam and start the timer
    setSelectedExam({
      ...exam,
      questions: formattedQuestions
    });
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(exam.duration * 60);
    setError(null);
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  // Confirm submission
  const confirmSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const totalQuestions = selectedExam.questions.length;
    
    if (answeredCount < totalQuestions) {
      setShowSubmitConfirm(true);
    } else {
      handleSubmitExam();
    }
  };

  // Submit the exam
  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    setShowSubmitConfirm(false);
    
    try {
      const totalQuestions = selectedExam.questions.length;
      let correctAnswers = 0;
      
      // Count correct answers
      selectedExam.questions.forEach((question, index) => {
        const userAnswer = selectedAnswers[index];
        const correctAnswer = parseInt(question.correctAnswer);
        
        if (userAnswer === correctAnswer) {
          correctAnswers++;
        }
      });
  
      // Calculate percentage score
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);
      
      // Submit the exam
      await submitExam({
        variables: {
          examId: parseInt(selectedExam.id),
          userId: parseInt(userId),
          percentage: percentage,
          answers: JSON.stringify(selectedAnswers)
        }
      });
      
      // Success! Navigate to scores
      setSelectedExam(null);
      navigate('/dashboard/scores');
      
    } catch (err) {
      console.error("Error submitting exam:", err);
      setError("Failed to submit exam. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user has already taken this exam
  const hasAttendedExam = (examId) => {
    if (!attendedData || !attendedData.userById || !attendedData.userById.scoresByUserId) {
      return false;
    }
    
    return attendedData.userById.scoresByUserId.nodes.some(
      score => score.examId === examId
    );
  };

  // Loading state
  if (examsLoading || attendedLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
        <p>Loading exams...</p>
      </div>
    );
  }

  // Error state
  if (examsError) {
    return (
      <Alert variant="danger">
        Error loading exams. Please try again later.
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
              >
                Next
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={confirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" role="status" />
                    <span className="ms-2">Submitting...</span>
                  </>
                ) : (
                  'Submit Exam'
                )}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}

      {/* Confirmation Modal */}
      <Modal show={showSubmitConfirm} onHide={() => setShowSubmitConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You haven't answered all questions. Do you still want to submit the exam?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitConfirm(false)}>
            Continue Exam
          </Button>
          <Button variant="primary" onClick={handleSubmitExam}>
            Submit Anyway
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListExams;

