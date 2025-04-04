import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Button, Modal, Spinner, Alert, Card, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/DashboardProvider';
import { useNavigate } from 'react-router-dom';

// GraphQL query to get user scores
const GET_USER_SCORES = gql`
  query GetUserScores($userId: Int!) {
    allScores(
      condition: { userId: $userId }
      orderBy: SUBMIT_DATE_DESC
    ) {
      nodes {
        id
        userId
        examId
        percentage
        answers
        submitDate
        examByExamId {
          id
          title
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
  }
`;

const Scores = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const userId = currentUser?.id;

  // States for managing the review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user scores using GraphQL
  const { loading, data } = useQuery(GET_USER_SCORES, {
    variables: { userId: parseInt(userId) },
    skip: !userId,
    fetchPolicy: 'network-only' // Add this to ensure we always get fresh data
  });

  // Calculate simple stats from scores
  const calculateStats = () => {
    const scores = data?.allScores?.nodes || [];
    if (scores.length === 0) return null;
    
    const total = scores.length;
    const passing = scores.filter(score => score.percentage >= 70).length;
    const average = scores.reduce((sum, score) => sum + score.percentage, 0) / total;
    
    return {
      total,
      passing,
      average: average.toFixed(1)
    };
  };

  // Handle viewing a specific exam's answers
  const handleViewExam = (exam) => {
    try {
      // Make sure we have the exam data
      if (!exam.examByExamId || !exam.examByExamId.questionsByExamId) {
        setError("Exam data is missing. Please try again later.");
        return;
      }

      // Parse the answers JSON string
      let userAnswers = {};
      try {
        userAnswers = typeof exam.answers === 'string' 
          ? JSON.parse(exam.answers) 
          : exam.answers || {};
      } catch (e) {
        console.error("Error parsing answers:", e);
        userAnswers = {};
      }
      
      // Make sure we have questions
      const questions = exam.examByExamId.questionsByExamId.nodes || [];
      
      // Format the questions with answers
      const reviewQuestions = questions.map((q, index) => {
        // Convert options to array if needed
        let options = [];
        if (typeof q.options === 'string') {
          options = q.options.split(',').map(opt => opt.trim());
        } else if (Array.isArray(q.options)) {
          options = q.options;
        }
        
        // Convert to numbers for comparison
        const userAnswer = userAnswers[index] !== undefined ? Number(userAnswers[index]) : null;
        const correctAnswer = Number(q.correctAnswer);
        
        return {
          ...q,
          options,
          userAnswer,
          correctAnswer,
          isCorrect: userAnswer === correctAnswer
        };
      });
      
      setSelectedExam({
        title: exam.examByExamId.title,
        percentage: exam.percentage,
        questions: reviewQuestions
      });
      
      setShowReviewModal(true);
    } catch (err) {
      console.error('Error parsing exam data:', err);
      setError('Could not load exam details. Please try again.');
    }
  };

  // Stats from the scores
  const stats = calculateStats();

  // Loading state
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading your scores...</p>
      </div>
    );
  }

  const scores = data?.allScores?.nodes || [];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Exam Results</h2>
        <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {stats && (
        <Card className="mb-4 bg-light">
          <Card.Body>
            <Card.Title>Your Performance</Card.Title>
            <div className="row">
              <div className="col-md-4">
                <h5>Total Exams</h5>
                <p className="fs-4">{stats.total}</p>
              </div>
              <div className="col-md-4">
                <h5>Average Score</h5>
                <p className="fs-4">{stats.average}%</p>
              </div>
              <div className="col-md-4">
                <h5>Passing Rate</h5>
                <p className="fs-4">{stats.passing} / {stats.total}</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {scores.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Exam Title</th>
                <th>Score</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {scores.map(score => (
                <tr key={score.id}>
                  <td>{score.examByExamId?.title || 'Untitled Exam'}</td>
                  <td>
                    <Badge bg={score.percentage >= 70 ? 'success' : 'danger'} pill>
                      {score.percentage.toFixed(1)}%
                    </Badge>
                  </td>
                  <td>
                    {new Date(score.submitDate).toLocaleDateString()}
                  </td>
                  <td>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleViewExam(score)}
                    >
                      Review Answers
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Alert variant="info">
          You haven't taken any exams yet. Go to the Available Exams section to take an exam.
        </Alert>
      )}

      {/* Review Modal */}
      <Modal 
        show={showReviewModal} 
        onHide={() => setShowReviewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedExam?.title} - Score: {selectedExam?.percentage}%
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExam?.questions.map((question, index) => (
            <div key={index} className="mb-4 p-3 border rounded">
              <h5>Question {index + 1}</h5>
              <p>{question.text}</p>
              
              <div className="mt-3">
                <p>Options:</p>
                <ul className="list-group">
                  {question.options.map((option, optIndex) => (
                    <li 
                      key={optIndex} 
                      className={`list-group-item ${
                        optIndex === question.userAnswer ? 
                          (question.isCorrect ? 'list-group-item-success' : 'list-group-item-danger') : 
                          (optIndex === question.correctAnswer ? 'list-group-item-success' : '')
                      }`}
                    >
                      {option}
                      {optIndex === question.userAnswer && ' (Your Answer)'}
                      {optIndex === question.correctAnswer && ' (Correct Answer)'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Scores;