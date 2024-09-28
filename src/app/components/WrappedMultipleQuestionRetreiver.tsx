import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';

const GET_QUESTIONS_BY_DIFFICULTY = gql`
  query GetQuestionsByDifficulty($difficulty: String!) {
    questions(difficulty: $difficulty) {
      id  # Ensure 'id' is a string
      difficulty
      question
      expected_output
    }
  }
`;

interface Question {
    id: string;
    difficulty: string;
    question: string;
    expected_output: string;
    example_1: string;  // Ensure example_1 is included
    example_2: string;  // Ensure example_2 is included
    example_3: string;  // Ensure example_3 is included
}

interface QuestionRetrieverProps {
    difficulty: string;
    onQuestionsFetched: (questions: Question[]) => void;
}

const QuestionRetriever: React.FC<QuestionRetrieverProps> = ({ difficulty, onQuestionsFetched }) => {
    const { loading, error, data } = useQuery(GET_QUESTIONS_BY_DIFFICULTY, {
        variables: { difficulty },
    });

    useEffect(() => {
        if (!loading && data && data.questions) {
            onQuestionsFetched(data.questions);
        } else if (!loading && error) {
            console.error("Error loading questions:", error.message);
        }
    }, [loading, data, error, onQuestionsFetched]);

    if (loading) return <p>Loading questions...</p>;
    if (error) return <p>Error loading questions</p>;

    return null;
};

const WrappedMultipleQuestionRetriever: React.FC<QuestionRetrieverProps> = (props) => (
    <ApolloProvider client={client}>
        <QuestionRetriever {...props} />
    </ApolloProvider>
);

export default WrappedMultipleQuestionRetriever;