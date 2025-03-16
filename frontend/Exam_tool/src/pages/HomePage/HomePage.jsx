import { Container, Row, Col, Card } from "react-bootstrap";
import { useDashboard } from '../../context/DashboardProvider';
import { useEffect } from "react";

const HomePage = () => {
    const { myExams, exams, scores, fetchExams, fetchMyExams, fetchScores } = useDashboard();
    useEffect(() => {
        fetchExams()
        fetchMyExams()
        fetchScores()
    }, [fetchExams, fetchMyExams, fetchScores])
    return (
        <Container fluid className="main_background">
            <div className="text-center text-dark font-weight-bold p-5 rounded">
                <h2>Dashboard Overview</h2>
                <p>Good luck on your exams! You've got the knowledge, skills, and determination.</p>


                <Row className="mt-4">
                    <Col md={4} className="mb-3">
                        <Card className="text-center shadow h-100">
                            <Card.Body>
                                <Card.Title className="display-6">{exams.length}</Card.Title>
                                <Card.Text className="text-muted">Total Exams</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="text-center shadow h-100">
                            <Card.Body>
                                <Card.Title className="display-6">{myExams.length}</Card.Title>
                                <Card.Text className="text-muted">My Created Exams</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="text-center shadow h-100">
                            <Card.Body>
                                <Card.Title className="display-6">
                                    {scores.length > 0
                                        ? (scores.reduce((sum, score) => sum + parseFloat(score.score), 0) / scores.length).toFixed(1)
                                        : 0}%
                                </Card.Title>
                                <Card.Text className="text-muted">Average Score</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default HomePage;