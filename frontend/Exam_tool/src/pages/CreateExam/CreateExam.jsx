import React ,{useEffect,useState} from 'react';
import { Button, Card, Form, Modal, ModalHeader, ModalTitle } from 'react-bootstrap';
import { useDashboard } from '../../context/DashboardProvider';

const CreateExam = () => {
  const { myExams, showModal, setShowModal, currentExam, setCurrentExam, handleEdit, handleDelete, handleSubmit, handleInput,fetchMyExams } = useDashboard();
  const [showDelete , setShowDelete] = useState(false)
  const [examDelete,setExamDelete] = useState(null);
  useEffect(()=>
  {   
    fetchMyExams();   
  },[])
  
  const confirmDelete = (examId) =>
  {
    setExamDelete(examId)
    setShowDelete(true);
  }
  const executeDelete = ()=>
  {
    handleDelete(examDelete);
    setShowDelete(false)
    setExamDelete(null);
  }
  
  return (
    <>
      <h5>Manage Your Exams</h5>
      <Button variant="primary" onClick={() => {
        setCurrentExam({ id: null, title: '', description: '', duration: '', questions: [] });
        setShowModal(true);
      }}>Create New Exam</Button>
      
      <div className="mt-4">
        <h6>Your Created Exams:</h6>
        {myExams.length > 0 ? (
          myExams.map((exam) => (
            <Card key={exam.id} className="mb-3 custom-card">
              <Card.Body>
                <Card.Title>{exam.title}</Card.Title>
                <Card.Text>{exam.description}</Card.Text>
                <Card.Text>Duration: {exam.duration} minutes</Card.Text>
                <Card.Text>Questions: {exam.questions ? (typeof exam.questions === 'string' ? JSON.parse(exam.questions).length : exam.questions.length) : 0}</Card.Text>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(exam)}>Edit</Button>
                <Button variant="danger" onClick={() => confirmDelete(exam.id)}>Delete</Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>Create an exam to get started.</p>
        )}
      </div>

      <Modal show={showDelete}centered  onHide={()=>setShowDelete(false)}>
        <ModalHeader closeButton>
            <ModalTitle>Confirm Delete</ModalTitle>
        </ModalHeader>
        <Modal.Body>
            Are you sure you want to delete this exam?
        </Modal.Body>
        <Modal.Footer>
            <Button variant='secondary' onClick={()=>setShowDelete(false)}>Cancel</Button>
            <Button variant='danger' onClick={executeDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
      
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
                            setCurrentExam({...currentExam, questions: updatedQuestions});
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
                                setCurrentExam({...currentExam, questions: updatedQuestions});
                              }}
                            />
                            <Form.Check 
                              type="radio" 
                              className="ms-2 mt-2" 
                              checked={question.correct_answer === oIndex}
                              onChange={() => {
                                const updatedQuestions = [...currentExam.questions];
                                updatedQuestions[qIndex].correct_answer = oIndex;
                                setCurrentExam({...currentExam, questions: updatedQuestions});
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
                                setCurrentExam({...currentExam, questions: updatedQuestions});
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
                            setCurrentExam({...currentExam, questions: updatedQuestions});
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
                          setCurrentExam({...currentExam, questions: updatedQuestions});
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
                  setCurrentExam({...currentExam, questions: updatedQuestions});
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