export const fetchGPT = async (message: string) => {
    const apiKey = "sk-6XDotiko00geiYygRa-cB3bZbfXQ2M1UntRQ0mxEvjT3BlbkFJO1JR-Ug4VbXmPMNQZPF-nmwimw5FMe4xtGbyDYCxAA"; // Replace with your actual API key

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        }),
    });

    if (!response.ok) {
        throw new Error(`GPT API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json(); // Parse the JSON response
    return data; // Return the parsed data (should contain 'choices')
};

// Run Python code using Pyodide instance
export const runPythonCode = async (code: string, pyodide: any, setOutput: (output: string) => void) => {
    if (pyodide) {
        try {
            // Redirect Python print output
            pyodide.runPython(`
                import sys
                from io import StringIO
                sys.stdout = StringIO()
            `);
            await pyodide.runPythonAsync(code); // Run the user's Python code
            const result = pyodide.runPython('sys.stdout.getvalue()'); // Get the printed output
            setOutput(result || 'No output');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setOutput(`Error: ${error.message}`);
            } else {
                setOutput('An unknown error occurred.');
            }
        }
    } else {
        setOutput('Pyodide is not ready yet');
    }
};

// Run JavaScript code using eval
export const runJavaScriptCode = (code: string, setOutput: (output: string) => void) => {
    try {
        const result = eval(code);
        setOutput(result !== undefined ? result.toString() : 'No output');
    } catch (error: unknown) {
        if (error instanceof Error) {
            setOutput(`Error: ${error.message}`);
        } else {
            setOutput('An unknown error occurred.');
        }
    }
};

// Run the user's code based on language and gather results for examples
export const runCode = async (
    language: "python" | "javascript",
    code: string,
    pyodide: any,
    currentQuestion: {
        example_1: string;
        example_2: string;
        example_3: string;
    } | null,
    setOutput: (output: string) => void,
    setExampleOutputs: (outputs: {
        name: string;
        userOutput: string;
        expectedOutput: string;
        isCorrect: boolean;
    }[]) => void,
    setActiveTab: (tab: number) => void,
) => {
    if (!currentQuestion) {
        setOutput('No question selected');
        return;
    }

    let userOutputs: string[] = [];

    // Running user's code for each example
    if (language === 'javascript') {
        try {
            const result = eval(code);
            userOutputs.push(result !== undefined ? result.toString() : 'No output');
        } catch (error) {
            userOutputs.push(error instanceof Error ? `Error: ${error.message}` : 'An unknown error occurred.');
        }
    } else if (language === 'python' && pyodide) {
        try {
            for (let i = 1; i <= 3; i++) {
                pyodide.runPython(`
                    import sys
                    from io import StringIO
                    sys.stdout = StringIO()
                `);
                await pyodide.runPythonAsync(code); // Run the user's Python code
                const result = pyodide.runPython('sys.stdout.getvalue()');
                userOutputs.push(result || 'No output');
            }
        } catch (error) {
            userOutputs.push(error instanceof Error ? `Error: ${error.message}` : 'An unknown error occurred.');
        }
    } else {
        userOutputs.push('Pyodide is not ready yet');
    }

    // Generate example outputs including the isCorrect flag
    const exampleOutputs = [
        {
            name: "Example 1",
            userOutput: userOutputs[0] || 'No output',
            expectedOutput: currentQuestion.example_1,
            isCorrect: userOutputs[0] === currentQuestion.example_1
        },
        {
            name: "Example 2",
            userOutput: userOutputs[1] || 'No output',
            expectedOutput: currentQuestion.example_2,
            isCorrect: userOutputs[1] === currentQuestion.example_2
        },
        {
            name: "Example 3",
            userOutput: userOutputs[2] || 'No output',
            expectedOutput: currentQuestion.example_3,
            isCorrect: userOutputs[2] === currentQuestion.example_3
        },
    ];

    setExampleOutputs(exampleOutputs);
    setActiveTab(0);
};
