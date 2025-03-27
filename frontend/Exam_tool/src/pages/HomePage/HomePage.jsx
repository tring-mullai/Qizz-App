import React from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useAuth } from "../../context/DashboardProvider";
import './HomePage.css';

const DASHBOARD_QUERY = gql`
  query DashboardData($userId: Int!) {
    allExams {
      totalCount
    }
    userExams: allExams(condition: { creatorId: $userId }) {
      totalCount
    }
    userById(id: $userId) {
      scoresByUserId {
        nodes {
          percentage
        }
      }
    }
  }
`;

const HomePage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    // Get userId from authenticated user
    const userId = currentUser?.id;

    const { loading, error, data } = useQuery(DASHBOARD_QUERY, {
        variables: { userId },
        fetchPolicy: 'cache-and-network',
        skip: !userId // Skip query if no user is logged in
    });

    const calculateAverageScore = () => {
        if (!data?.userById?.scoresByUserId?.nodes?.length) return 0;
        
        const scores = data.userById.scoresByUserId.nodes;
        const totalScore = scores.reduce((sum, score) => sum + score.percentage, 0);
        return (totalScore / scores.length).toFixed(1);
    };

    if (!currentUser) {
        return (
            <Container fluid className="p-4 text-center">
                <Spinner animation="border" />
                <p>Loading user data...</p>
            </Container>
        );
    }

    if (loading) return (
        <Container fluid className="p-4 text-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Container>
    );

    if (error) return (
        <Container fluid className="p-4 text-center text-danger">
            <h2>Error Loading Dashboard</h2>
            <p>{error.message}</p>
        </Container>
    );

    return (
        <Container fluid className="p-4">
            <div className="text-center mb-5">
                <h1 className="mb-3">Dashboard Overview</h1>
                <p className="lead">Welcome back, {currentUser.name}!</p>
            </div>

            <Row className="g-4">
                <Col md={4}>
                    <Card 
                        className="text-center shadow-sm h-100 card-hover"
                        onClick={() => navigate('/dashboard/list-exams')}
                    >
                        <Card.Body className="p-4">
                            <Card.Title className="display-4 mb-3">
                                {data?.allExams?.totalCount || 0}
                            </Card.Title>
                            <Card.Text>Total Available Exams</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card 
                        className="text-center shadow-sm h-100 card-hover"
                        onClick={() => navigate('/dashboard/my-exams')}
                    >
                        <Card.Body className="p-4">
                            <Card.Title className="display-4 mb-3">
                                {data?.userExams?.totalCount || 0}
                            </Card.Title>
                            <Card.Text>My Created Exams</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card 
                        className="text-center shadow-sm h-100 card-hover"
                        onClick={() => navigate('/dashboard/scores')}
                    >
                        <Card.Body className="p-4">
                            <Card.Title className="display-4 mb-3">
                                {calculateAverageScore()}%
                            </Card.Title>
                            <Card.Text>Average Score</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;