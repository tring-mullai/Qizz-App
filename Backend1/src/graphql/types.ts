// src/graphql/types.ts
import { gql } from 'graphile-utils';

export const sharedTypeDefs = gql`
  # Use the renamed type from PostGraphile
  type DBQuestion {
    id: Int!
    text: String!
    options: [String!]!
    correct_answer: Int!
    exam: Exam!
  }

  input QuestionInput {
    text: String!
    options: [String!]!
    correctAnswer: Int!
  }
`;