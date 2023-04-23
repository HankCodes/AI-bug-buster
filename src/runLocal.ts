import fs from 'fs'
import path from 'path'
import { DummyAiClient } from "./clients/DummyAiClient"
import { AiService } from "./services/AiService"
import { BugBusterService } from "./services/BugBusterService"
import { FileService } from "./services/FileService"
import dotenv from 'dotenv';

dotenv.config()

const getErrorMessageFromLocalFile = () => {
    try {
        return fs.readFileSync(path.join(__dirname, 'localErrorMessage.txt'), 'utf8');
    } catch (error: any) {
        if (error?.code === 'ENOENT') {
            console.log('"localErrorMessage.txt" not found in the root of the project. Please create it and add the error message you want to fix.')
            process.exit(1)
        }
        throw new Error('Unexpected error reading localErrorMessage.txt')
    }
}

const checkFileExists = (location: string, errorMessage: string) => {
    if (!fs.existsSync(location)) {
        console.log(errorMessage);
        process.exit(1)
    }
}



if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set");
if (!process.env.REPOSITORY_LOCAL_LOCATION) throw new Error("REPOSITORY_LOCAL_LOCATION not set");
checkFileExists(
    process.env.REPOSITORY_LOCAL_LOCATION,
    "REPOSITORY_LOCAL_LOCATION is not a valid directory, did you clone the repository in the right place?"
)
checkFileExists(
    "localErrorMessage.txt",
    '"localErrorMessage.txt" not found in the root of the project. Please create it and add the error message you want to fix.'
)

const errorMessage = getErrorMessageFromLocalFile()
const repositoryLocation = process.env.REPOSITORY_LOCAL_LOCATION

// const aiclient = new ChatGptClient({ apiKey: this.openApiKey })
const aiclient = new DummyAiClient()
const ai = new AiService(aiclient)
const fileService = new FileService()
const bugBusterService = new BugBusterService(ai, fileService, repositoryLocation)

bugBusterService.bustTheBugs(errorMessage)
