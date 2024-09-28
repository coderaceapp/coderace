import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code, question, expected_output } = req.body;

    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: "API key is missing" });
    }

    const systemMessage = {
        role: "system",
        content: "You are an expert code evaluator."
    };

    const userMessage = {
        role: "user",
        content: `
        Evaluate the following Python code:
        
        Problem: "${question}"
        Expected output: "${expected_output}"
        User's code:
        \`\`\`
        ${code}
        \`\`\`

        Run the code and compare the output with the expected output. 

        - If the code is logically correct and the output matches, return:
          - "Correct"
          - A brief explanation of why it's correct.
        - If the code produces an incorrect result, return:
          - "Incorrect"
          - A brief explanation of what is wrong.

        Your response should only contain:
        1. "Correct" or "Incorrect".
        2. A short explanation (1-2 sentences).`
    };

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [systemMessage, userMessage],
                max_tokens: 150,
                temperature: 0,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        const gptResponse = response.data.choices[0].message.content.trim();

        // Determine if the result is "Correct" or "Incorrect"
        const isCorrect = gptResponse.toLowerCase().includes("correct");

        // Send both the evaluation text and whether it's correct
        return res.status(200).json({ evaluation: gptResponse, isCorrect });
    } catch (error: any) {
        console.error('Error with GPT:', error.response?.data || error.message);
        return res.status(500).json({
            error: 'Failed to evaluate code.',
            details: error.response?.data || error.message,
        });
    }
}