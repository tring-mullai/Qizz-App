import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Dropdown, Spinner, Alert } from 'react-bootstrap';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useAuth } from '../../context/DashboardProvider';
import { useNavigate } from 'react-router-dom';

const GET_MY_EXAMS = gql`
  query MyExams($creatorId: Int!) {
    allExams(condition: { creatorId: $creatorId }) {
      nodes {
        id
        title
        description
        duration
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

const CREATE_EXAM = gql`
  mutation CreateExam($input: CreateExamInput!) {
    createExam(input: $input) {
      exam {
        id
        title
        description
        duration
        creatorId
      }
    }
  }
`;

const ADD_QUESTIONS = gql`
  mutation AddQuestions($input: CustomAddQuestionsInput!) {
    customAddQuestionsToExam(input: $input) {
      questions {
        id
        text
        options
        correctAnswer
      }
    }
  }
`;

const DELETE_EXAM = gql`
  mutation DeleteExam($id: Int!) {
    deleteExamById(input: { id: $id }) {
      exam {
        id
      }
    }
  }
`;

const CreateExam = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentExam, setCurrentExam] = useState({
    id: null,
    title: '',
    description: '',
    duration: 30,
    questions: []
  });
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [error, setError] = useState(null);

  const { 
    loading: loadingExams, 
    data: examsData, 
    refetch: refetchExams
  } = useQuery(GET_MY_EXAMS, {
    variables: { creatorId: currentUser?.id },
    skip: !currentUser?.id
  });

  const [createExam] = useMutation(CREATE_EXAM);
  const [addQuestions] = useMutation(ADD_QUESTIONS);
  const [deleteExam] = useMutation(DELETE_EXAM);

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  const myExams = examsData?.allExams?.nodes || [];

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCurrentExam(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Create exam
      const { data: examData } = await createExam({
        variables: {
          input: {
            exam: {
              title: currentExam.title,
              description: currentExam.description,
              duration: currentExam.duration,
              creatorId: currentUser.id
            }
          }
        }
      });

      // Add questions
      await addQuestions({
        variables: {
          input: {
            examId: examData.createExam.exam.id,
            questions: currentExam.questions.map(q => ({
              questionText: q.text,
              questionOptions: q.options,
              correctOptionIndex: q.correctAnswer
            }))
          }
        }
      });

      await refetchExams();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
      console.error("Exam creation failed:", err);
    }
  };

  const handleEdit = (exam) => {
    setCurrentExam({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      questions: exam.questionsByExamId.nodes.map(q => ({
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteExam({ variables: { id: examToDelete } });
      await refetchExams();
      setShowDelete(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Exams</h2>
        <Button 
          variant="primary" 
          onClick={() => {
            setCurrentExam({ 
              id: null, 
              title: '', 
              description: '', 
              duration: 30, 
              questions: [] 
            });
            setShowModal(true);
          }}
        >
          Create New Exam
        </Button>
      </div>

      {loadingExams ? (
        <Spinner animation="border" />
      ) : myExams.length > 0 ? (
        <div className="row">
          {myExams.map((exam) => (
            <div key={exam.id} className="col-md-6 col-lg-4 mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{exam.title}</Card.Title>
                  <Card.Text>{exam.description}</Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      {exam.duration} mins • {exam.questionsByExamId.nodes.length} questions
                    </small>
                  </Card.Text>
                  
                  <Dropdown>
                    <Dropdown.Toggle variant="light" size="sm">
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleEdit(exam)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => {
                          setExamToDelete(exam.id);
                          setShowDelete(true);
                        }}
                        className="text-danger"
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="lead">No exams created yet</p>
        </div>
      )}

      {/* Create/Edit Exam Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentExam.id ? 'Edit Exam' : 'Create Exam'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={currentExam.title}
                onChange={handleInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={currentExam.description}
                onChange={handleInput}
                rows={3}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={currentExam.duration}
                onChange={handleInput}
                min="1"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Questions</Form.Label>
              {currentExam.questions.map((question, qIndex) => (
                <Card key={qIndex} className="mb-3">
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Question {qIndex + 1}</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={question.text}
                        onChange={(e) => {
                          const updatedQuestions = [...currentExam.questions];
                          updatedQuestions[qIndex].text = e.target.value;
                          setCurrentExam({ ...currentExam, questions: updatedQuestions });
                        }}
                        rows={2}
                        required
                      />
                    </Form.Group>

                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="d-flex align-items-center mb-2">
                        <Form.Control
                          value={option}
                          onChange={(e) => {
                            const updatedQuestions = [...currentExam.questions];
                            updatedQuestions[qIndex].options[oIndex] = e.target.value;
                            setCurrentExam({ ...currentExam, questions: updatedQuestions });
                          }}
                          required
                        />
                        <Form.Check
                          type="radio"
                          className="ms-2"
                          checked={question.correctAnswer === oIndex}
                          onChange={() => {
                            const updatedQuestions = [...currentExam.questions];
                            updatedQuestions[qIndex].correctAnswer = oIndex;
                            setCurrentExam({ ...currentExam, questions: updatedQuestions });
                          }}
                          label="Correct"
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => {
                            const updatedQuestions = [...currentExam.questions];
                            updatedQuestions[qIndex].options.splice(oIndex, 1);
                            if (question.correctAnswer === oIndex) {
                              updatedQuestions[qIndex].correctAnswer = null;
                            }
                            setCurrentExam({ ...currentExam, questions: updatedQuestions });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        const updatedQuestions = [...currentExam.questions];
                        updatedQuestions[qIndex].options.push('');
                        setCurrentExam({ ...currentExam, questions: updatedQuestions });
                      }}
                      disabled={question.options.length >= 5}
                    >
                      Add Option
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      className="mt-2"
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

              <Button
                variant="secondary"
                onClick={() => {
                  setCurrentExam(prev => ({
                    ...prev,
                    questions: [
                      ...prev.questions,
                      { text: '', options: ['', ''], correctAnswer: null }
                    ]
                  }));
                }}
                disabled={currentExam.questions.length >= 20}
              >
                Add Question
              </Button>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={currentExam.questions.length === 0}
              >
                {currentExam.id ? 'Update Exam' : 'Create Exam'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this exam? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateExam;