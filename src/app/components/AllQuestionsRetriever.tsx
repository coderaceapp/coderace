import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';

// GraphQL query to fetch all questions for the dropdown
const GET_ALL_QUESTIONS = gql`
  query GetAllQuestions {
    questions {
      id
      question
    }
  }
`;

interface Question {
    id: number;
    question: string;
}

interface AllQuestionsRetrieverProps {
    onQuestionsFetched: (questions: Question[] | null) => void;
}

const AllQuestionsRetriever: React.FC<AllQuestionsRetrieverProps> = ({ onQuestionsFetched }) => {
    const { loading, error, data } = useQuery(GET_ALL_QUESTIONS);

    useEffect(() => {
        if (!loading && data && data.questions) {
            onQuestionsFetched(data.questions); // Send fetched questions to parent
        } else if (!loading && error) {
            console.error("Error fetching questions:", error);  // Log detailed error

            // Handle GraphQL errors
            if (error.graphQLErrors) {
                error.graphQLErrors.forEach(({ message, locations, path }) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ),
                );
            }

            // Handle network errors
            if (error.networkError) {
                console.log(`[Network error]: ${error.networkError}`);
            }

            onQuestionsFetched(null);
        }
    }, [loading, data, error, onQuestionsFetched]);

    if (loading) return <p>Loading questions...</p>;

    if (error) return (
        <p>Error loading questions: {error.message}</p>  // Output the main error message
    );

    return null; // This component does not render anything itself
};

const WrappedAllQuestionsRetriever: React.FC<AllQuestionsRetrieverProps> = (props) => (
    <ApolloProvider client={client}>
        <AllQuestionsRetriever {...props} />
    </ApolloProvider>
);

export default WrappedAllQuestionsRetriever;