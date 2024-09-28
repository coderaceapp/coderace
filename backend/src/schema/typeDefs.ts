export const typeDefs = `
type Question {
  id: ID!
  difficulty: String!
  question: String!
  expected_output: String!
  example_1: String!
  example_2: String!
  example_3: String!
}

type Query {
  # Query to fetch questions by difficulty
  questions(difficulty: String!): [Question!]!
}
`;