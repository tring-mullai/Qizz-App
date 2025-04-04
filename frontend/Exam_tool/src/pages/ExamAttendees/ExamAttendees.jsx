import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Table, Badge, Spinner, Alert, Accordion } from 'react-bootstrap';

const EXAM_ATTENDEES_QUERY = gql`
  query ExamAttendees($examId: Int!) {
    exam: examById(id: $examId) {
      id
      title
      description
      duration
      scoresByExamId(orderBy: PERCENTAGE_DESC) {
        nodes {
          id
          percentage
          submitDate
          answers
          userByUserId {
            id
            name
            email
          }
          examByExamId {
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
  }
`;

const ExamAttendeesPage = () => {
    const { examId } = useParams();
    const parsedExamId = examId ? parseInt(examId) : NaN;

    const { loading, error, data } = useQuery(EXAM_ATTENDEES_QUERY, {
        variables: { examId: parsedExamId },
        skip: isNaN(parsedExamId)
    });

    if (isNaN(parsedExamId)) {
        return <Alert variant="danger">Click on "View Results" on your exam to review</Alert>;
    }

    if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

    const exam = data?.exam;
    const scores = exam?.scoresByExamId?.nodes || [];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const parseOptions = (options) => {
        try {
            return Array.isArray(options) ? options : JSON.parse(options);
        } catch {
            return options ? options.split(',') : [];
        }
    };

    const parseAnswers = (answers) => {
        try {
            // Handle cases where answers might be:
            // - undefined/null
            // - already parsed array
            // - JSON string
            // - empty string
            if (!answers) return [];
            if (Array.isArray(answers)) return answers;
            if (typeof answers === 'string' && answers.trim() === '') return [];
            const parsed = JSON.parse(answers);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Error parsing answers:', e);
            return [];
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>{exam?.title || 'Exam Results'}</h2>
                    {exam?.description && <p className="text-muted">{exam.description}</p>}
                    {exam?.duration && <p>Duration: {exam.duration} minutes</p>}
                </div>
            </div>

            {scores.length === 0 ? (
                <Alert variant="info">No submissions found for this exam</Alert>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                            <tr>
                                <th>Student</th>
                                <th>Email</th>
                                <th>Score</th>
                                <th>Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score) => (
                                <tr key={score.id}>
                                    <td>{score.userByUserId?.name || 'Anonymous'}</td>
                                    <td>{score.userByUserId?.email || 'N/A'}</td>
                                    <td>
                                        <Badge bg={score.percentage >= 70 ? "success" : score.percentage >= 50 ? "warning" : "danger"}>
                                            {score.percentage}%
                                        </Badge>
                                    </td>
                                    <td>{formatDate(score.submitDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <h4 className="mt-5 mb-3">Detailed Responses</h4>
                    <Accordion>
                        {scores.map((score, index) => {
                            const userAnswers = parseAnswers(score.answers);
                            const questions = score.examByExamId?.questionsByExamId?.nodes || [];
                            const correctCount = userAnswers.filter(a => a?.isCorrect).length;
                            const totalCount = userAnswers.length;

                            return (
                                <Accordion.Item key={score.id} eventKey={index.toString()}>
                                    <Accordion.Header>
                                        {score.userByUserId?.name || 'Student'} - {score.percentage}%
                                        <span className="ms-2 badge bg-secondary">
                                            {correctCount} / {totalCount} correct
                                        </span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Table bordered>
                                            <thead>
                                                <tr>
                                                    <th>Question</th>
                                                    <th>Student's Answer</th>
                                                    <th>Correct Answer</th>
                                                    <th>Result</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userAnswers.map((answer, ansIndex) => {
                                                    const question = questions[ansIndex];
                                                    if (!question) return null;

                                                    const options = parseOptions(question.options);
                                                    const selectedOption = answer?.selectedOption;
                                                    const isCorrect = answer?.isCorrect;

                                                    return (
                                                        <tr key={`${score.id}-${ansIndex}`}>
                                                            <td>{question.text}</td>
                                                            <td>
                                                                {selectedOption !== undefined && selectedOption !== null
                                                                    ? options[selectedOption] || 'Invalid answer'
                                                                    : 'No answer'}
                                                            </td>
                                                            <td>{options[question.correctAnswer] || 'N/A'}</td>
                                                            <td>
                                                                <Badge bg={isCorrect ? "success" : "danger"}>
                                                                    {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        })}
                    </Accordion>
                </>
            )}
        </div>
    );
};

export default ExamAttendeesPage;