import { gql } from 'graphile-utils';

export const submitSchema = gql`
  input QuizScoreSubmissionInput {
    examId: Int!
    userId: Int!
    percentage: Float!
    answers: String!
  }

  input SubmitExamInput {
    score: QuizScoreSubmissionInput!
  }

  type SubmitExamPayload {
    score: Score @pgField
    query: Query
  }

  extend type Mutation {
    submitQuizScore(input: SubmitExamInput!): SubmitExamPayload
  }
`;