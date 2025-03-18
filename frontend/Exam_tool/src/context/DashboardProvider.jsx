import React, { createContext, useState, useContext,useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [exams, setExams] = useState([]);
  const [myExams, setMyExams] = useState([]);
  const [scores, setScores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentExam, setCurrentExam] = useState({ id: null, title: '', description: '', duration: '', questions: [] });
  const [showExamModal, setShowExamModal] = useState(false);
  const [examInProgress, setExamInProgress] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [userName, setUserName] = useState('User');
  const [attendedExams, setAttendedExams] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showViewAnswers, setShowViewAnswers] = useState(false);
  const [selectedScore, setSelectedScore] = useState(null);
  const navigate = useNavigate();


  const getUserInfo = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.name) {
          setUserName(payload.name);
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);


  const fetchExams = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/exams/exams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExams(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch exams');
    }
  }, []);


  const fetchMyExams = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/exams/my-exams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyExams(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch your exams');
    }
  }, []);


  const fetchScores = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/scores/scores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)
      setScores(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch scores');
    }
  }, []);

  const fetchAttendedExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/scores/scores',
        {
          headers:
          {
            Authorization: `Bearer ${token}`,
          },
        });
      if (response.data.success) {
        setScores(response.data.data || []);


        const examIDs = response.data.data.map(score => score.exam_id);
        setAttendedExams(examIDs);
      } else {
        console.error("Failed to fetch scores:", response.data.message);
        setScores([]);
      }
    } catch (error) {
      console.error('Failed to fetch attended exams', error);
    }
  }

  const hasAttendedExam = (examId) => {
    return attendedExams.includes(examId);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmation(false);
    handleSubmitExam();
  }
  const handleViewAnswers = (score) => {
    console.log("Original score:", score);


    const processedScore = { ...score };


    try {
      processedScore.answers = typeof score.answers === 'string'
        ? JSON.parse(score.answers)
        : score.answers;
    } catch (error) {
      console.error("Error parsing answers:", error);
      processedScore.answers = {};
    }

    try {
      processedScore.questions = typeof score.questions === 'string'
        ? JSON.parse(score.questions)
        : score.questions;
    } catch (error) {
      console.error("Error parsing questions:", error);
      processedScore.questions = [];
    }

    console.log("Processed score:", processedScore); 
    setSelectedScore(processedScore);
    setShowViewAnswers(true);
  };

  const handleCloseAnswers = () => {
    setShowViewAnswers(false);
    setSelectedScore(null)
  }


  const handleInput = (e) => {
    const { name, value } = e.target;
    setCurrentExam({ ...currentExam, [name]: value });
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    const validQuestions = currentExam.questions.filter(
      (q) => q.text && q.options && q.options.length >= 2 && q.correct_answer !== null
    );
    if (validQuestions.length === 0) {
      toast.error('Please add at least one question with options and mark a correct answer');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const examData = { ...currentExam, questions: validQuestions };
      if (currentExam.id) {
        await axios.put(`https://n3q3bv9g-5000.inc1.devtunnels.ms/api/exams/exams/${currentExam.id}`, examData, { headers });
        toast.success('Exam updated successfully');
      } else {
        await axios.post('https://n3q3bv9g-5000.inc1.devtunnels.ms/api/exams/exams', examData, { headers });
        toast.success('Exam created successfully');
      }
      setShowModal(false);
      fetchExams();
      fetchMyExams();
      setCurrentExam({ id: null, title: '', description: '', duration: '', questions: [] });
    } catch (error) {
      toast.error('Failed to save exam');
      console.error('Save Exam Error:', error);
    }
  };


  const handleEdit = (exam) => {
    let examToEdit = { ...exam };
    if (examToEdit.questions && typeof examToEdit.questions === 'string') {
      try {
        examToEdit.questions = JSON.parse(examToEdit.questions);
      } catch (error) {
        console.error('Error parsing questions JSON:', error);
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
      await axios.delete(`https://n3q3bv9g-5000.inc1.devtunnels.ms/api/exams/exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Exam deleted successfully');
      fetchExams();
      fetchMyExams();
    } catch (error) {
      toast.error('Failed to delete exam');
      console.error('Delete Exam Error:', error);
    }
  };


  const handleStartExam = (exam) => {
    let examToStart = { ...exam };
    if (examToStart.questions && typeof examToStart.questions === 'string') {
      try {
        examToStart.questions = JSON.parse(examToStart.questions);
      } catch (error) {
        console.error('Error parsing questions JSON:', error);
        examToStart.questions = [];
      }
    }
    setExamInProgress(examToStart);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(examToStart.duration * 60);
    setExamSubmitted(false);
    setShowExamModal(true);
  };


  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answerIndex });
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
      let correctAnswers = 0;
      examInProgress.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct_answer) {
          correctAnswers++;
        }
      });
      const score = (correctAnswers / examInProgress.questions.length) * 100;
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          'https://n3q3bv9g-5000.inc1.devtunnels.ms/api/scores/scores',
          {
            examId: examInProgress.id,
            examTitle: examInProgress.title,
            score,
            answers: selectedAnswers
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(selectedAnswers)
        toast.success('Exam submitted successfully!');
        setShowExamModal(false);

        fetchScores();
        navigate('/dashboard/scores')
        fetchAttendedExams();
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
    localStorage.removeItem('token');
    navigate('/');
    toast.info('Logged out successfully');
  };

  return (
    <DashboardContext.Provider
      value={{
        exams,
        myExams,
        scores,
        showModal,
        setShowModal,
        currentExam,
        setCurrentExam,
        showExamModal,
        setShowExamModal,
        examInProgress,
        setExamInProgress,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        selectedAnswers,
        setSelectedAnswers,
        timeLeft,
        setTimeLeft,
        examSubmitted,
        setExamSubmitted,
        showConfirmation,
        setShowConfirmation,
        userName,
        setUserName,
        getUserInfo,
        fetchExams,
        fetchMyExams,
        fetchScores,
        fetchAttendedExams,
        hasAttendedExam,
        handleInput,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleStartExam,
        handleAnswerSelect,
        handleNextQuestion,
        handlePrevQuestion,
        handleSubmitExam,
        handleConfirmSubmit,
        formatTime,
        showViewAnswers,
        setShowViewAnswers,
        handleViewAnswers,
        handleCloseAnswers,
        selectedScore, setSelectedScore,
        handleLogout

      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);

export default DashboardProvider