export const typeDefs = `
  type Question {
    id: ID!
    difficulty: String!
    question: String!
    expected_output: String!
  }

  type Query {
    question(id: ID!): Question
  }
`;
