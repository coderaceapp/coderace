import { IResolvers } from '@graphql-tools/utils';
import path from 'path';
import fs from 'fs';

const filePath = path.join(__dirname, '../data/questions.json');
const fileContents = fs.readFileSync(filePath, 'utf8');
const questionsData = JSON.parse(fileContents).questions;

export const questionResolver: IResolvers = {
    Query: {
        question: (_, { id }) => questionsData.find((q: any) => q.id === parseInt(id)),
    },
};
