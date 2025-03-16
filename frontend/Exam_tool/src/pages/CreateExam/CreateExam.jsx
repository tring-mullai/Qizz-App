import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, ModalHeader, ModalTitle, Dropdown, Table, Spinner } from 'react-bootstrap';
import { useDashboard } from '../../context/DashboardProvider';
import './CreateExam.css';

const CreateExam = () => {
    const { myExams, showModal, setShowModal, currentExam, setCurrentExam, handleEdit, handleDelete, handleSubmit, handleInput, fetchMyExams } = useDashboard();
    const [showDelete, setShowDelete] = useState(false);
    const [examDelete, setExamDelete] = useState(null);
    const [showAttendeesModal, setShowAttendeesModal] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [loadingAttendees, setLoadingAttendees] = useState(false);
    const [selectedAttendee, setSelectedAttendee] = useState(null);
    const [showAnswersModal, setShowAnswersModal] = useState(false);

    useEffect(() => {
        fetchMyExams();
    }, []);

    const confirmDelete = (examId) => {
        setExamDelete(examId);
        setShowDelete(true);
    };

    const executeDelete = () => {
        handleDelete(examDelete);
        setShowDelete(false);
        setExamDelete(null);
    };

    const handleViewAttendees = async (examId) => {
        setLoadingAttendees(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`https://n3q3bv9g-5000.inc1.devtunnels.ms/api/exams/exams/${examId}/attendees`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
      
          console.log('Response:', response); // Log the response object
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Response Data:', data); // Log the parsed JSON data
      
          if (data.success) {
            setAttendees(data.data);
            setShowAttendeesModal(true);
          } else {
            console.error('Failed to fetch attendees:', data.message);
            alert('Failed to fetch attendees: ' + data.message);
          }
        } catch (error) {
          console.error('Error fetching attendees:', error);
          alert('Error fetching attendees: ' + error.message);
        } finally {
          setLoadingAttendees(false);
        }
      };

      const viewDetailedAnswers = (attendee) => {
        const detailedAnswers = attendee.exam_questions.map((question, index) => {
          const userAnswer = attendee.user_answers[index];
          return {
            question_text: question.text,
            selected_option: question.options[userAnswer],
            correct_option: question.options[question.correct_answer],
            is_correct: userAnswer === question.correct_answer
          };
        });
      
        setSelectedAttendee({
          ...attendee,
          answers: detailedAnswers
        });
        setShowAnswersModal(true);
      };

    return (
        <>
            <h5>Manage Your Exams</h5>
            <Button variant="primary" onClick={() => {
                setCurrentExam({ id: null, title: '', description: '', duration: '', questions: [] });
                setShowModal(true);
            }}>Create New Quizz</Button>

            <div className="mt-4">
                <h6>Your Created Exams:</h6>
                {myExams.length > 0 ? (
                    myExams.map((exam) => (
                        <Card key={exam.id} className="mb-3 custom-card">
                            <Card.Body>
                                <div className='examcreation_card'>
                                    <div>
                                        <Card.Title>{exam.title}</Card.Title>
                                        <Card.Text>{exam.description}</Card.Text>
                                        <Card.Text>Duration: {exam.duration} minutes</Card.Text>
                                        <Card.Text>Questions: {exam.questions ? (typeof exam.questions === 'string' ? JSON.parse(exam.questions).length : exam.questions.length) : 0}</Card.Text>
                                    </div>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="link" id={`dropdown-button-${exam.id}`} className="buttonthreedotcursor">
                                            &#8942; {/* Unicode for three dots */}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu-custom">
                                            <Dropdown.Item onClick={() => handleViewAttendees(exam.id)}>
                                                View Attendees
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <Button variant="warning" className="me-2" onClick={() => handleEdit(exam)}>Edit</Button>
                                <Button variant="danger" onClick={() => confirmDelete(exam.id)}>Delete</Button>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>Create an exam to get started.</p>
                )}
            </div>

            {/* Modal to show attendees */}
            <Modal show={showAttendeesModal} onHide={() => setShowAttendeesModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Exam Attendees</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingAttendees ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : attendees.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Score</th>
                                    <th>Answers</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendees.map((attendee) => (
                                    <tr key={attendee.user_id}>
                                        <td>{attendee.user_name}</td>
                                        <td>{attendee.user_email}</td>
                                        <td>{attendee.score}%</td>
                                        <td>
                                            <Button 
                                                variant="outline-info" 
                                                size="sm"
                                                onClick={() => viewDetailedAnswers(attendee)}
                                            >
                                                View Answers
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No attendees found for this exam.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAttendeesModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal to show detailed answers */}
            <Modal show={showAnswersModal} onHide={() => setShowAnswersModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>
      Answers - {selectedAttendee?.user_name}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedAttendee && (
      <div>
        <p><strong>Score:</strong> {selectedAttendee.score}%</p>
        <p><strong>Exam Title:</strong> {selectedAttendee.exam_title}</p>
        <hr />
        <h6>Answers:</h6>
        {selectedAttendee.answers.map((answer, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>Question {index + 1}</Card.Title>
              <Card.Text>
                <strong>Question:</strong> {answer.question_text}
              </Card.Text>
              <Card.Text>
                <strong>Selected Answer:</strong> {answer.selected_option}
              </Card.Text>
              <Card.Text>
                <strong>Correct Answer:</strong> {answer.correct_option}
              </Card.Text>
              <Card.Text>
                <strong>Result:</strong> 
                <span className={answer.is_correct ? "text-success" : "text-danger"}>
                  {answer.is_correct ? "Correct" : "Incorrect"}
                </span>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAnswersModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

            {/* Delete confirmation modal */}
            <Modal show={showDelete} centered onHide={() => setShowDelete(false)}>
                <ModalHeader closeButton>
                    <ModalTitle>Confirm Delete</ModalTitle>
                </ModalHeader>
                <Modal.Body>
                    Are you sure you want to delete this exam?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowDelete(false)}>Cancel</Button>
                    <Button variant='danger' onClick={executeDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Create/Edit exam modal */}
            <Modal show={showModal} fullscreen onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentExam.id ? 'Edit Exam' : 'Create Exam'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" value={currentExam.title} onChange={handleInput} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={currentExam.description} onChange={handleInput} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Duration (minutes)</Form.Label>
                            <Form.Control type="number" name="duration" value={currentExam.duration} onChange={handleInput} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Questions</Form.Label>
                            <div className="mb-2">
                                {currentExam.questions.map((question, qIndex) => (
                                    <Card className="mb-3" key={qIndex}>
                                        <Card.Body>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Question Text</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={question.text || ''}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...currentExam.questions];
                                                        updatedQuestions[qIndex].text = e.target.value;
                                                        setCurrentExam({ ...currentExam, questions: updatedQuestions });
                                                    }}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Options</Form.Label>
                                                {(question.options || []).map((option, oIndex) => (
                                                    <div className="d-flex mb-2" key={oIndex}>
                                                        <Form.Control
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => {
                                                                const updatedQuestions = [...currentExam.questions];
                                                                updatedQuestions[qIndex].options[oIndex] = e.target.value;
                                                                setCurrentExam({ ...currentExam, questions: updatedQuestions });
                                                            }}
                                                        />
                                                        <Form.Check
                                                            type="radio"
                                                            className="ms-2 mt-2"
                                                            checked={question.correct_answer === oIndex}
                                                            onChange={() => {
                                                                const updatedQuestions = [...currentExam.questions];
                                                                updatedQuestions[qIndex].correct_answer = oIndex;
                                                                setCurrentExam({ ...currentExam, questions: updatedQuestions });
                                                            }}
                                                            label="Correct"
                                                        />
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="ms-2"
                                                            onClick={() => {
                                                                const updatedQuestions = [...currentExam.questions];
                                                                updatedQuestions[qIndex].options.splice(oIndex, 1);
                                                                if (question.correct_answer === oIndex) {
                                                                    updatedQuestions[qIndex].correct_answer = null;
                                                                }
                                                                setCurrentExam({ ...currentExam, questions: updatedQuestions });
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        const updatedQuestions = [...currentExam.questions];
                                                        if (!updatedQuestions[qIndex].options) {
                                                            updatedQuestions[qIndex].options = [];
                                                        }
                                                        updatedQuestions[qIndex].options.push('');
                                                        setCurrentExam({ ...currentExam, questions: updatedQuestions });
                                                    }}
                                                >
                                                    Add Option
                                                </Button>
                                            </Form.Group>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => {
                                                    const updatedQuestions = [...currentExam.questions];
                                                    updatedQuestions.splice(qIndex, 1);
                                                    setCurrentExam({ ...currentExam, questions: updatedQuestions });
                                                }}
                                            >
                                                Remove Question
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>

                            <Button
                                variant="secondary"
                                onClick={() => {
                                    const updatedQuestions = [...currentExam.questions];
                                    updatedQuestions.push({
                                        text: '',
                                        options: ['', ''],
                                        correct_answer: null
                                    });
                                    setCurrentExam({ ...currentExam, questions: updatedQuestions });
                                }}
                            >
                                Add Question
                            </Button>
                        </Form.Group>
                        <Button variant="primary" type="submit">Save</Button>
                        <Button variant="secondary" className="ms-2" onClick={() => setShowModal(false)}>Cancel</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreateExam;