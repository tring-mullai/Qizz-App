import { gql } from 'graphile-utils';

export const updateExamSchema = gql`
  input CustomUpdateQuestionInput {
    questionText: String!
    questionOptions: [String!]!
    correctOptionIndex: Int!
  }

  input CustomUpdateExamInput {
    examId: Int!
    title: String!
    description: String!
    duration: Int!
    questions: [CustomUpdateQuestionInput!]!
  }

  type CustomUpdateExamPayload {
    exam: Exam!
    questions: [Question!]!
  }

  extend type Mutation {
    customUpdateExam(input: CustomUpdateExamInput!): CustomUpdateExamPayload
  }
`;