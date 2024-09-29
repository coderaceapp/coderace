export const typeDefs = `
type LeaderboardEntry {
  userId: String!
  username: String!
  elo: Int!
}

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

  # Leaderboard queries
  mainLeaderboard: [LeaderboardEntry!]!
  questionLeaderboard(questionId: String!): [LeaderboardEntry!]!
}
`;
