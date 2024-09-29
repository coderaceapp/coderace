import { IResolvers } from '@graphql-tools/utils';
import path from 'path';
import fs from 'fs';

// Define the Question interface
interface Question {
    id: number;
    difficulty: string;
    question: string;
    expected_output: string;
    example_1: string;
    example_2: string;
    example_3: string;
}

// Load questions from a JSON file dynamically
const filePath = path.join(__dirname, '../data/questions.json');
let questionsData: Question[] = [];

try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    questionsData = JSON.parse(fileContents).questions as Question[];
} catch (error: any) {
    console.error(`Error reading or parsing questions JSON file: ${error.message}`);
}

export const questionResolver: IResolvers = {
    Query: {
        questions: (_, { difficulty }): Question[] => {
            // Filter and return questions based on the provided difficulty
            return questionsData.filter((question: Question) => question.difficulty === difficulty);
        },
    },
};
