import React, { useEffect } from 'react';
import { Card, Button, Modal, ProgressBar, Form } from 'react-bootstrap';
import { useDashboard } from '../../context/DashboardProvider';
import './ListExams.css'

const ListExams = () => {
    const {
        fetchExams,
        fetchAttendedExams,
        exams,
        showExamModal,
        handleStartExam,
        setShowExamModal,
        examInProgress,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        selectedAnswers,
        timeLeft,
        setTimeLeft,
        examSubmitted,
        hasAttendedExam,
        handleAnswerSelect,
        handlePrevQuestion, 
        handleNextQuestion,
        showConfirmation,
        setShowConfirmation,
        formatTime,
        handleConfirmSubmit
    } = useDashboard();

    useEffect(() => {
        fetchExams();
        fetchAttendedExams();
    }, []);

    useEffect(() => {
        let timer;
        if (showExamModal && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleConfirmSubmit();
        }
        return () => clearInterval(timer);
    }, [showExamModal, timeLeft, handleConfirmSubmit, setTimeLeft]);

    return (
        <>
            <h5>List of All Exams</h5>
            <div>
                {exams.length > 0 ? (
                    exams.map((exam) => (
                        <Card key={exam.id} className="mb-3 custom-card">
                            <Card.Body className='custom-card-background'>
                                <Card.Title className='card-title'>{exam.title}</Card.Title>
                                <Card.Text className='card-text'>{exam.description}</Card.Text>
                                <Card.Text>Duration: {exam.duration} minutes</Card.Text>
                                <Card.Text>Questions: {exam.questions ? (typeof exam.questions === 'string' ? JSON.parse(exam.questions).length : exam.questions.length) : 0}</Card.Text>

                                {hasAttendedExam(exam.id) ? (
                                    <Button variant="secondary"  disabled>Attended</Button>
                                ) : (
                                    <Button  className='card-button-exam' onClick={() => handleStartExam(exam)}>Start Exam</Button>
                                )}
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>No exams found</p>
                )}
            </div>
            <Modal show={showExamModal} fullscreen onHide={() => setShowExamModal(false)} size="lg" backdrop="static" keyboard={false}>
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
                                    onClick={() => setShowConfirmation(true)}
                                    disabled={examSubmitted}
                                >
                                    Submit Exam
                                </Button>
                            )}
                        </Modal.Footer>

                        <Modal centered show={showConfirmation} onHide={() => setShowConfirmation(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Submission</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to submit the exam? Have you attended all questions?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleConfirmSubmit}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                )}
            </Modal>
        </>
    );
};

export default ListExams;

