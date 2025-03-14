import React, { useEffect } from 'react';
import { useDashboard } from '../../context/DashboardProvider';
import {  Button ,Modal,ListGroup} from 'react-bootstrap';
const Scores = () => {
  const { scores,fetchScores ,showViewAnswers,selectedScore,handleCloseAnswers,handleViewAnswers} = useDashboard();
  
  useEffect(()=>
{
    fetchScores()
},[])

  return (
    <>
      <h5>Exam Scores</h5>
      <div className="mt-4">
        {scores && scores.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {scores?.map((score) => (
                  <tr key={score.id}>
                    <td>{score.exam_title}</td>
                    <td>{parseFloat(score.score).toFixed(2)}%</td>
                    <td>{new Date(score.created_at).toLocaleString()}</td>
                    <td>
                      <Button variant="info" onClick={() => handleViewAnswers(score)}>
                        View Answers
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No exam attempts found. Start an exam to see your scores here.</p>
        )}
      </div>
      <Modal show={showViewAnswers} centered onHide={handleCloseAnswers} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Answers for {selectedScore?.exam_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedScore && (
            <ListGroup>
              {selectedScore.questions.map((question, index) => (
                <ListGroup.Item key={index}>
                  <h6>{question.text}</h6>
                  <p>
                    Your Answer: <span style={{ color: selectedScore.answers[index] === question.correct_answer ? 'green' : 'red' }}>
                      {question.options[selectedScore.answers[index]]}
                    </span>
                  </p>
                  <p>
                    Correct Answer: <span style={{ color: 'green' }}>
                      {question.options[question.correct_answer]}
                    </span>
                  </p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAnswers}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default Scores;