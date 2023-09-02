
const analyzeErrorPrompt1 = (stackTrace: string): string => {
    return `
        As a senior developer with great expertise in finding bugs from stacktaces you get the following stacktace:

        ${stackTrace}

        Analyze the stack trace and find in what files the potential bugs may lie. You understand that the response you give will
        be read by a computer so you will respond in the following JSON format:
        [{"fileName": "<name of the file>", "prompt": "<chatGPT prompt>"}]
        If you think that there may be a bug in more than one file, you can add more than one object to the array.

        In the "prompt" property of the object, you will give a prompt to yourself that can be used to instruct you to update the file content.
        `.trim().replace("\n", " ");
}

const analyzeErrorPrompt2 = (stackTrace: string): string => {
    return `
    Given the following stacktrace:

    ${stackTrace}

    Do the following:
    1. analyze the root cause of the error
    2. When you have found a fix or an improvement for the issue, extract the file name of the file where the error occur and construct a chatGPT prompt that have a detailed explanation of what the error is.

    The response you give will be read by a machine so you need to respond in the following JSON format and nothing else:

    [{
        "fileName": "nameOfFile.kt",
        "prompt": "there seems to be unvalidated input passed into the repository.createUser() function,  make sure that the email field is the correct format"
    }]

    You must provide valid json and nothing else.
    `.trim().replace("\n", " ")
}

const fileUpdatePrompt1 = (prompt: string, fileContent: string): string => {
    return `Given this file content: ${fileContent}, ${prompt}, The response you give must be the whole file content with the changes you want to make and nothing else.`
}

const fileUpdatePrompt2 = (prompt: string, fileContent: string): string => {
    return ""
}

export class PromptFactory {
    public static analyzeErrorPrompt(promptId: number): (stackTrace: string) => string {
        switch (promptId) {
            case 1:
                return analyzeErrorPrompt1;
            case 2:
                return analyzeErrorPrompt2;
            default:
                throw new Error(`analyzeErrorPrompt id ${promptId} not found`);
        }
    }

    public static fileUpdatePrompt(promptId: number): (prompt: string, fileContent: string) => string {
        switch (promptId) {
            case 1:
                return fileUpdatePrompt1;
            case 2:
                return fileUpdatePrompt2;
            default:
                throw new Error(`fileUpdatePrompt id ${promptId} not found`);
        }
    }
}