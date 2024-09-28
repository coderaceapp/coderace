// src/app/components/GraphQLTestComponent.tsx
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_RANDOM_QUESTION = gql`
  query GetRandomQuestion {
    question {
      id
      difficulty
      question
      expected_output
      example_1
      example_2
      example_3
    }
  }
`;

const GraphQLTestComponent: React.FC = () => {
  const { loading, error, data } = useQuery(GET_RANDOM_QUESTION);

  console.log("Loading status:", loading);
  console.log("Error status:", error);
  console.log("Data received:", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>GraphQL Test - Random Question</h1>
      <p><strong>ID:</strong> {data.question.id}</p>
      <p><strong>Difficulty:</strong> {data.question.difficulty}</p>
      <p><strong>Question:</strong> {data.question.question}</p>
      <p><strong>Expected Output:</strong> {data.question.expected_output}</p>
      <p><strong>Example 1:</strong> {data.question.example_1}</p>
      <p><strong>Example 2:</strong> {data.question.example_2}</p>
      <p><strong>Example 3:</strong> {data.question.example_3}</p>
    </div>
  );
};

export default GraphQLTestComponent;
