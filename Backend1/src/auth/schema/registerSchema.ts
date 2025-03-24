import {gql} from "graphile-utils";

export const registerSchema = gql`
type AuthPayload {
      token: String
      user: User
    }

    extend type Mutation {
      register(email: String!, password: String!, name: String!): String
      login(email: String!, password: String!): AuthPayload
    }
`