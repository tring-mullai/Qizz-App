
import { gql } from 'graphile-utils';

export const attendeesSchema = gql`
  type ExamAttendee {
    user: User!
    score: Score!
  }

  extend type Query {
    examAttendees(examId: Int!): [ExamAttendee!]!
  }
`;