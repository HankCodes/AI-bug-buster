import fs from 'fs'
import path from 'path'
import { DummyAiClient } from "./clients/DummyAiClient"
import { AiService } from "./services/AiService"
import { BugBusterService } from "./services/BugBusterService"
import { FileService } from "./services/FileService"
import dotenv from 'dotenv';
import ChatGptClient from './clients/ChatGptClient'

dotenv.config()
const errorTextFilePath = "../local.txt"

const getErrorMessageFromLocalFile = (location: string) => {
    try {
        return fs.readFileSync(path.join(__dirname, location), 'utf8');
    } catch (error: any) {
        if (error?.code === 'ENOENT') {
            console.log(`Could not find file: "${location}"`)
            process.exit(1)
        }
        throw new Error('Unexpected error reading ' + location + ': ' + error.message)
    }
}

const checkFileExists = (location: string, errorMessage: string) => {
    if (!fs.existsSync(path.join(__dirname, location))) {
        console.log(errorMessage);
        process.exit(1)
    }
}

const checkFileExistsAbsolutePath = (location: string, errorMessage: string) => {
    if (!fs.existsSync(location)) {
        console.log(errorMessage);
        process.exit(1)
    }
}


if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set");
if (!process.env.REPOSITORY_LOCAL_LOCATION) throw new Error("REPOSITORY_LOCAL_LOCATION not set");

const repositoryLocation = `${process.env.REPOSITORY_LOCAL_LOCATION}/bug-buster-local-repo`

checkFileExistsAbsolutePath(
    repositoryLocation,
    `REPOSITORY_LOCAL_LOCATION: ${repositoryLocation}, is not a valid directory, did you clone the repository in the right place?`
)
checkFileExists(
    errorTextFilePath,
    `"${errorTextFilePath.replace("../", "")}" not found in the root of the project. Please create it and add the error message you want to fix.`
)

const errorMessage = getErrorMessageFromLocalFile(errorTextFilePath)

const aiclient = new ChatGptClient({ apiKey: process.env.OPENAI_API_KEY })
// const aiclient = new DummyAiClient()
const ai = new AiService(aiclient)
const fileService = new FileService()
const bugBusterService = new BugBusterService(ai, fileService, repositoryLocation)

bugBusterService.bustTheBugs(errorMessage)
