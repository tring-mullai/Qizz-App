import React, { useState } from 'react';
import { Button, Card, Modal, Form, Dropdown, Spinner, Alert } from 'react-bootstrap';
import { useMutation, useQuery, gql } from '@apollo/client';
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

const CREATE_EXAM_WITH_QUESTIONS = gql`
  mutation CreateExamWithQuestions($input: CustomCreateExamInput!) {
    customCreateExamWithQuestions(input: $input) {
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




const UPDATE_EXAM = gql`
  mutation UpdateExam($input: CustomUpdateExamInput!) {
    customUpdateExam(input: $input) {
      exam {
        id
        title
        description
        duration
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


  const [currentExam, setCurrentExam] = useState({
    id: null,
    title: '',
    description: '',
    duration: 30,
    questions: [{
      text: '',
      options: ['', ''],
      correctAnswer: 0
    }]
  });

  // State for modal, error, and UI control
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);


  // Fetch exams query
  const {
    loading: loadingExams,
    data: examsData,
    refetch: refetchExams
  } = useQuery(GET_MY_EXAMS, {
    variables: { creatorId: 1 }, // Replace with actual user ID
    skip: false,
    fetchPolicy: 'network-only'
  });

  // Mutations
  const [createExamWithQuestions] = useMutation(CREATE_EXAM_WITH_QUESTIONS);
  const [updateExam] = useMutation(UPDATE_EXAM);
  const [deleteExam] = useMutation(DELETE_EXAM);

  // Validate exam before submission
  const validateExam = () => {
    // Check title
    if (!currentExam.title.trim()) {
      setError("Exam title is required");
      return false;
    }

    // Check description
    if (!currentExam.description.trim()) {
      setError("Exam description is required");
      return false;
    }

    // Check questions
    for (let i = 0; i < currentExam.questions.length; i++) {
      const question = currentExam.questions[i];

      // Check question text
      if (!question.text.trim()) {
        setError(`Question ${i + 1} is missing text`);
        return false;
      }

      // Check options
      const validOptions = question.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        setError(`Question ${i + 1} needs at least 2 options`);
        return false;
      }

      // Check correct answer
      if (question.correctAnswer === null ||
        question.correctAnswer < 0 ||
        question.correctAnswer >= validOptions.length) {
        setError(`Question ${i + 1} needs a valid correct answer`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate exam
    if (!validateExam()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare questions data
      const questionsData = currentExam.questions.map(q => ({
        questionText: q.text.trim(),
        questionOptions: q.options.filter(opt => opt.trim() !== ''),
        correctOptionIndex: q.correctAnswer
      }));

      // Mutation payload
      const mutationInput = currentExam.id
        ? {
          // For update mutation, use exact field names from schema
          examId: currentExam.id,
          title: currentExam.title.trim(),
          description: currentExam.description.trim(),
          duration: currentExam.duration,
          questions: questionsData
        }
        : {
          examTitle: currentExam.title.trim(),
          examDescription: currentExam.description.trim(),
          examDuration: currentExam.duration,
          creatorId: 1, // Replace with actual user ID
          questions: questionsData
        };

      // Create or update exam
      if (currentExam.id) {
        // Update existing exam
        await updateExam({
          variables: {
            input: mutationInput
          }
        });
        setSuccessMessage('Exam Updated Successfully');
      } else {
        // Create new exam
        await createExamWithQuestions({
          variables: { input: mutationInput }
        });
        setSuccessMessage('Exam Created Successfully');
      }

      // Refetch exams and close modal
      await refetchExams();
      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      setError(err.message || "An error occurred while saving the exam");
      console.error("Exam operation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (exam) => {
    const formattedExam = {
      id: exam.id,
      title: exam.title || '',
      description: exam.description || '',
      duration: exam.duration || 30,
      questions: exam.questionsByExamId.nodes.map(q => ({
        text: q.text,
        // Robust parsing of options
        options: (() => {
          // If options is already an array, return it
          if (Array.isArray(q.options)) return q.options;

          // If options is a string that looks like a JSON array
          try {
            const parsedOptions = JSON.parse(q.options);
            return Array.isArray(parsedOptions) ? parsedOptions : ['', ''];
          } catch {
            // If it's a string, try to split it
            return q.options ? q.options.split(',').map(opt => opt.trim()) : ['', ''];
          }
        })(),
        correctAnswer: q.correctAnswer || 0
      }))
    };

    setCurrentExam(formattedExam);
    setShowModal(true);
  };

  // Handle exam deletion
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteExam({ variables: { id: examToDelete } });
      setSuccessMessage('Exam deleted successfully');
      await refetchExams();
      setShowDelete(false);
      setTimeout(() => setSuccessMessage(null), 1500);
    } catch (err) {
      setError(err.message || "Failed to delete exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  // In your CreateExam.jsx, update the handleViewAttendees function:
  const handleViewAttendees = (exam) => {
    if (!exam?.id) {
      console.error("Cannot view results - no exam ID provided");
      return;
    }
    navigate(`/dashboard/exam-attendees/${exam.id}`);
  };

  // Render methods for question and option inputs
  const renderQuestionInputs = () => {
    return currentExam.questions.map((question, qIndex) => (
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
              disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={() => {
                  const updatedQuestions = [...currentExam.questions];
                  updatedQuestions[qIndex].options.splice(oIndex, 1);
                  if (question.correctAnswer === oIndex) {
                    updatedQuestions[qIndex].correctAnswer = 0;
                  }
                  setCurrentExam({ ...currentExam, questions: updatedQuestions });
                }}
                disabled={isSubmitting || question.options.length <= 2}
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
            disabled={isSubmitting || question.options.length >= 5}
          >
            Add Option
          </Button>

          <Button
            variant="danger"
            size="sm"
            className="mt-2 ms-2"
            onClick={() => {
              const updatedQuestions = [...currentExam.questions];
              updatedQuestions.splice(qIndex, 1);
              setCurrentExam({ ...currentExam, questions: updatedQuestions });
            }}
            disabled={isSubmitting || currentExam.questions.length <= 1}
          >
            Remove Question
          </Button>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <div className="container py-4">

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert variant='success' onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </Alert>
      )}


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
              questions: [{ text: '', options: ['', ''], correctAnswer: 0 }]
            });
            setShowModal(true);
          }}
          disabled={isSubmitting}
        >
          Create New Exam
        </Button>
      </div>


      {loadingExams ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : examsData?.allExams?.nodes.length > 0 ? (
        <div className="row">
          {examsData.allExams.nodes.map((exam) => (
            <div key={exam.id} className="col-md-6 col-lg-4 mb-4">
              <Card
                className="h-100"
                style={{ cursor: 'pointer' }}
                onClick={() => handleViewAttendees(exam)}
              >
                <Card.Body>
                  <Card.Title>{exam.title}</Card.Title>
                  <Card.Text>{exam.description}</Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      {exam.duration} mins • {exam.questionsByExamId.nodes.length} questions
                    </small>
                  </Card.Text>

                  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleViewAttendees(exam);
                      }}
                    >
                      View Results
                    </Button>

                    <Dropdown onClick={(e) => e.stopPropagation()}>
                      <Dropdown.Toggle variant="light" size="sm" disabled={isSubmitting}>
                        Actions
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(exam);
                          }}
                          disabled={isSubmitting}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={(e) => {
                            e.stopPropagation();
                            setExamToDelete(exam.id);
                            setShowDelete(true);
                          }}
                          className="text-danger"
                          disabled={isSubmitting}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
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
      <Modal show={showModal} onHide={() => !isSubmitting && setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentExam.id ? 'Edit Exam' : 'Create Exam'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Exam Details */}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={currentExam.title}
                onChange={(e) => setCurrentExam(prev => ({ ...prev, title: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={currentExam.description}
                onChange={(e) => setCurrentExam(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={currentExam.duration}
                onChange={(e) => setCurrentExam(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                min="1"
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            {/* Questions Section */}
            <Form.Group className="mb-3">
              <Form.Label>Questions</Form.Label>
              {renderQuestionInputs()}

              <Button
                variant="secondary"
                onClick={() => {
                  setCurrentExam(prev => ({
                    ...prev,
                    questions: [
                      ...prev.questions,
                      { text: '', options: ['', ''], correctAnswer: 0 }
                    ]
                  }));
                }}
                disabled={isSubmitting || currentExam.questions.length >= 20}
              >
                Add Question
              </Button>
            </Form.Group>

            {/* Submit Buttons */}
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="me-2"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || currentExam.questions.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Processing...</span>
                  </>
                ) : currentExam.id ? (
                  'Update Exam'
                ) : (
                  'Create Exam'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={() => !isSubmitting && setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this exam? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDelete(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>



    </div>
  );
};

export default CreateExam;