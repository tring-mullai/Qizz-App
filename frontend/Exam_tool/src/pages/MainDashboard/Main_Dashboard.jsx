import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Modal, Form, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import header_logo from '../../assets/header_logo.jpg'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MainDashboard.css'

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");



  const [exams, setExams] = useState([]);
  const [myExams, setMyExams] = useState([]); 
  const [scores, setScores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentExam, setCurrentExam] = useState({ id: null, title: '', description: '', duration: '', questions: [] });
  const navigate = useNavigate();
  const [showExamModal, setShowExamModal] = useState(false);
  const [examInProgress, setExamInProgress] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [userName, setUserName] = useState("User"); 

  useEffect(() => {
    fetchExams();
    fetchMyExams(); 
    fetchScores();
    getUserInfo();
  }, []);

  useEffect(() => {
    let timer;
    if (examInProgress && timeLeft > 0 && !examSubmitted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 ) {
      handleSubmitExam();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, examSubmitted, examInProgress]);

  
  const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        //atob - converts base64 encoded jwt to readable format and can able to access payload values
        console.log(payload)
        
        if (payload.name) {
          setUserName(payload.name);
        }
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  };

  
  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/route/exams', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExams(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch exams');
    }
  };

  
  const fetchMyExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/route/my-exams', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMyExams(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch your exams');
    }
  };

  const fetchScores = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/route/scores', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setScores(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch scores');
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCurrentExam({ ...currentExam, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const validQuestions = currentExam.questions.filter(q => 
      q.text && q.options && q.options.length >= 2 && q.correct_answer !== null
    );
    
    if (validQuestions.length === 0) {
      toast.error('Please add at least one question with options and mark a correct answer');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
  
      
      const examData = {
        ...currentExam,
        questions: validQuestions
      };
      console.log(examData)
  
      if (currentExam.id) {
        await axios.put(`https://n3q3bv9g-5000.inc1.devtunnels.ms/api/route/exams/${currentExam.id}`, examData, { headers });
        toast.success('Exam updated successfully');
      } else {
        await axios.post('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/route/exams', examData, { headers });
        toast.success('Exam created successfully');
      }
      setShowModal(false);
      
      
      fetchExams();
      fetchMyExams();

      setCurrentExam({ id: null, title: '', description: '', duration: '', questions: [] });
    } catch (error) {
      toast.error('Failed to save exam');
      console.error("Save Exam Error:", error);
    }
  };
  
  const handleEdit = (exam) => {
    
    let examToEdit = { ...exam }; //shallow copy of exams 
    console.log(examToEdit)
    
    
    if (examToEdit.questions && typeof examToEdit.questions === 'string') {
      try {
        examToEdit.questions = JSON.parse(examToEdit.questions);
      } catch (error) {
        console.error("Error parsing questions JSON:", error);
        examToEdit.questions = [];
      }
    } else if (!Array.isArray(examToEdit.questions)) {
      
      examToEdit.questions = [];
    }
    
    
    setCurrentExam(examToEdit);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://n3q3bv9g-5000.inc1.devtunnels.ms/api/route/exams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Exam deleted successfully');
      
      fetchExams();
      fetchMyExams();
    } catch (error) {
      toast.error('Failed to delete exam');
      console.error("Delete Exam Error:", error);
    }
  };

  const handleStartExam = async (exam) => {
    let examToStart = { ...exam };
    
    
    if (examToStart.questions && typeof examToStart.questions === 'string') {
      try {
        examToStart.questions = JSON.parse(examToStart.questions);
      } catch (error) {
        console.error("Error parsing questions JSON:", error);
        examToStart.questions = [];
      }
    }
    
    
    setExamInProgress(examToStart);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(examToStart.duration * 60); // Convert minutes to seconds
    setExamSubmitted(false);
    
    
    setShowExamModal(true);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examInProgress.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (!examSubmitted && examInProgress) {
      setExamSubmitted(true);
      
      // Calculate score
      let correctAnswers = 0;
      examInProgress.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct_answer) {
          correctAnswers++;
        }
      });
      
      const score = (correctAnswers / examInProgress.questions.length) * 100;
      
      try {
        const token = localStorage.getItem('token');
        await axios.post('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/route/scores', {
          examId: examInProgress.id,
          score: score,
          answers: selectedAnswers
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        toast.success('Exam submitted successfully!');
        setShowExamModal(false);
        fetchScores();
        setActiveTab("Scores"); // Switch to scores tab
      } catch (error) {
        toast.error('Failed to submit exam');
        console.error(error);
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    
    navigate('/login');
    toast.info('Logged out successfully');
  };

 return(
  <Container fluid className="p-0 h-100">
  <Row className="m-0 h-100 ">
    
    <Col md={3} className="sidebar p-0 shadow-sm ">
      <div className="d-flex flex-column h-100 bg-white">
        
        <div className="p-4 border-bottom">
          <img 
            src={header_logo} 
            alt="Logo" 
            className="img-fluid" 
            style={{ maxWidth: '150px' }} />
        </div>
        
        
        <div className="p-4 ">
          <h6 className="text-uppercase text-muted mb-4 small">Main Menu</h6>
          <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button 
                className={`nav-link text-dark py-2 px-3 rounded w-100 ${activeTab === "Home" ? 'bg-secondary text-white' : ''}`}
                onClick={() => setActiveTab("Home")}>
            Home
            </button>
          </li>
          
            <li className="nav-item mb-2">
              <button 
                className={`nav-link text-dark py-2 px-3 rounded w-100 ${activeTab === "List Exams" ? 'bg-secondary text-white' : ''}`}
                onClick={() => setActiveTab("List Exams")}>
              List Exams
              </button>
            </li>

            <li className="nav-item mb-2">
              <button 
                className={`nav-link text-dark py-2 px-3 rounded w-100 ${activeTab === "Create Exam" ? 'bg-secondary text-white' : ''}`}
                onClick={() => setActiveTab("Create Exam")}>
              Create Exam
              </button>
            </li>

            <li className="nav-item mb-2">
              <button 
                className={`nav-link text-dark py-2 px-3 rounded w-100 ${activeTab === "Scores" ? 'bg-secondary text-white' : ''}`}
                onClick={() => setActiveTab("Scores")}>
              Scores
              </button>
            </li>
          </ul>
        </div>
        
        
        <div className="mt-auto border-top p-4">
          <button 
            onClick={handleLogout} 
            className="btn btn-outline-danger w-100">
            Logout
          </button>
        </div>
      </div>
    </Col>
    
    
    <Col md={9} className="main-content p-4">
    
      <h4 className="text-dark mb-3">Welcome to our Exam tool</h4>
      <h2>Hello {userName}</h2>
      <div className="bg-light p-4 rounded-3 shadow-sm mt-4">
        
        {activeTab === "Home" && (
        <div className='main_background'>
           <div className='main_opacity_background_image'>
          <div className='text-center text-dark font-weight-bold p-5 rounded'>
            <h2>Dashboard Overview</h2>
            <p>Good luck on your exams! You've got the knowledge, the skills, and the determination</p>
            <div className="row mt-4">
              <div className="col-md-4 mb-3">
                <Card className="text-center h-100">
                  <Card.Body>
                    <Card.Title>{exams.length}</Card.Title>
                    <Card.Text>Total Exams</Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4 mb-3">
                <Card className="text-center h-100">
                  <Card.Body>
                    <Card.Title>{myExams.length}</Card.Title>
                    <Card.Text>My Created Exams</Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4 mb-3">
                <Card className="text-center h-100">
                  <Card.Body>
                    <Card.Title>
                      {scores.length > 0 
                        ? (scores.reduce((sum, score) => sum + parseFloat(score.score), 0) / scores.length).toFixed(1) 
                        : 0}%
                    </Card.Title>
                    <Card.Text>Average Score</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>

          </div>
        </div>
        )}
        
        {activeTab === "List Exams" && (
          <>
            <h5>List of All Exams</h5>
            <div>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <Card key={exam.id} className="mb-3 custom-card">
                    <Card.Body>
                      <Card.Title>{exam.title}</Card.Title>
                      <Card.Text>{exam.description}</Card.Text>
                      <Card.Text>Duration: {exam.duration} minutes</Card.Text>
                      
                       <Card.Text>Questions: {exam.questions ? (typeof exam.questions === 'string' ? JSON.parse(exam.questions).length : exam.questions.length) : 0}</Card.Text>

                      <Button variant="success" onClick={() => handleStartExam(exam)}>Start Exam</Button>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>No exams found</p>
              )}
            </div>
          </>
        )}

        {activeTab === "Create Exam" && (
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
                      <Button variant="danger" onClick={() => handleDelete(exam.id)}>Delete</Button>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>Create an exam to get started.</p>
              )}
            </div>
            
            <Modal show={showModal} onHide={() => setShowModal(false)}>
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
        )}

        {activeTab === "Scores" && (
          <>
            <h5>Exam Scores</h5>
            <div className="mt-4">
              {scores.length > 0 ? (
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
                      {scores.map((score) => (
                        <tr key={score.id}>
                          <td>{score.exam_title}</td>
                          <td>{parseFloat(score.score).toFixed(2)}%</td>
                          <td>{new Date(score.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No exam attempts found. Start an exam to see your scores here.</p>
              )}
            </div>
          </>
        )}
      </div>
    </Col>
  </Row>
  
  {/* Exam Taking Modal */}
  <Modal show={showExamModal} onHide={() => setShowExamModal(false)} size="lg" backdrop="static" keyboard={false}>
    {examInProgress && (
      <>
        <Modal.Header>
          <Modal.Title>{examInProgress.title}</Modal.Title>
          <div className="ms-auto text-danger">Time Left: {formatTime(timeLeft)}</div>
        </Modal.Header>
        <Modal.Body>
          <ProgressBar now={(currentQuestionIndex + 1) / examInProgress.questions.length * 100} 
                      label={`${Math.round((currentQuestionIndex + 1) / examInProgress.questions.length * 100)}%`} 
                      className="mb-4" />
          
          <h5>Question {currentQuestionIndex + 1} of {examInProgress.questions.length}</h5>
          <p className="mt-3 mb-4">{examInProgress.questions[currentQuestionIndex].text}</p>
          
          <Form>
            {examInProgress.questions[currentQuestionIndex].options.map((option, index) => (
              <Form.Check
                key={index}
                type="radio"
                id={`question-${currentQuestionIndex}-option-${index}`}
                label={option}
                name={`question-${currentQuestionIndex}`}
                className="mb-3"
                checked={selectedAnswers[currentQuestionIndex] === index}
                onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
              />
            ))}
          </Form>
          
          <div className="mt-4 d-flex flex-wrap gap-2">
            {examInProgress.questions.map((_, index) => (
              <Button
                key={index}
                variant={selectedAnswers[index] !== undefined ? "success" : "outline-secondary"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className={currentQuestionIndex === index ? "fw-bold" : ""}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handlePrevQuestion} 
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < examInProgress.questions.length - 1 ? (
            <Button variant="primary" onClick={handleNextQuestion}>
              Next
            </Button>
          ) : (
            <Button 
              variant="success" 
              onClick={handleSubmitExam}
              disabled={examSubmitted}
            >
              Submit Exam
            </Button>
          )}
        </Modal.Footer>
      </>
    )}
  </Modal>
  
  <ToastContainer />
</Container>
 );
};

export default MainDashboard;