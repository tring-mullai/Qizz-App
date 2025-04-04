import { gql } from 'graphile-utils';

export const examSchema = gql`
  input CustomExamQuestionInput {
    questionText: String!
    questionOptions: [String!]!
    correctOptionIndex: Int!
  }

  input CustomCreateExamInput {
    examTitle: String!
    examDescription: String!
    examDuration: Int!
    creatorId: Int!
    questions: [CustomExamQuestionInput!]!
  }

  type CustomCreateExamPayload {
    exam: Exam
  }

  extend type Mutation {
    customCreateExamWithQuestions(input: CustomCreateExamInput!): CustomCreateExamPayload
  }
`;