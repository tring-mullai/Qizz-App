import { Container, Row, Col, Card } from "react-bootstrap";
import { useDashboard } from '../../context/DashboardProvider';
import { useEffect } from "react";
import './HomePage.css'
import { useNavigate } from "react-router-dom";


const HomePage = () => {
    const { myExams, exams, scores, fetchExams, fetchMyExams, fetchScores } = useDashboard();
    const navigate = useNavigate();
    useEffect(() => {
        fetchExams();
        fetchMyExams();
        fetchScores();
    }, [fetchExams, fetchMyExams, fetchScores]);

    return (
        <Container fluid className="p-4  ">
            <div className="text-center mb-5">
                <h1 className="mb-3">Dashboard Overview</h1>
                <p className="lead">Good luck on your exams! You've got the knowledge, skills, and determination.</p>
            </div>

            <Row className="g-4">
                <Col md={4}>
                    <Card className="text-center shadow-sm h-100 card-hover"
                    onClick={()=>navigate('/dashboard/list-exams')}>
                        <Card.Body className="p-4" >
                            <Card.Title className="display-4 mb-3">{exams.length}</Card.Title>
                            <Card.Text>Total Exams</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm h-100 card-hover"
                    onClick={()=>navigate('/dashboard/create-exam')}>
                        <Card.Body className="p-4">
                            <Card.Title className="display-4 mb-3">{myExams.length}</Card.Title>
                            <Card.Text >My Created Exams</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center shadow-sm h-100 card-hover"
                    onClick={()=>navigate('/dashboard/scores')}>
                        <Card.Body className="p-4">
                            <Card.Title className="display-4 mb-3">
                                {scores.length > 0
                                    ? (scores.reduce((sum, score) => sum + parseFloat(score.score), 0) / scores.length).toFixed(1)
                                    : 0}%
                            </Card.Title>
                            <Card.Text >Average Score</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;




