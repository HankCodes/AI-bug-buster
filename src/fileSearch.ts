import path from 'path';
import { promises as fsPromises } from 'fs';

// Make recursively
const fileSearch = async (fileName: string, directory: string): Promise<string | null> => {
    try {
        const files = await fsPromises.readdir(directory);
        const file = files.find((file) => file === fileName);

        return file ? path.join(directory, file) : null;
    } catch (err) {
        console.error(`Error while searching for file ${fileName} in directory ${directory}:`, err);
        throw err;
    }
};

const extractFileContent = async (filePath: string): Promise<string> => {
    try {
        return await fsPromises.readFile(filePath, 'utf-8');
    } catch (err) {
        console.error(`Error while extracting content from file ${filePath}:`, err);
        throw err;
    }
};

const replaceFileContent = async (filePath: string, newContent: string): Promise<boolean> => {
    try {
        await fsPromises.writeFile(filePath, newContent, 'utf-8');
        return true;
    } catch (err) {
        console.error(`Error while replacing content in file ${filePath}:`, err);
        throw err;
    }
};

const fileToFind = "WebhookRequest2";
const directoryToSearch = "src";

export const main = async () => {
    console.log(`Searching for file ${fileToFind} in directory ${directoryToSearch}...`);

    const filePath = await fileSearch(fileToFind, directoryToSearch);
    console.log(`File found: ${filePath}`);

    if (filePath) {
        const fileContent = await extractFileContent(filePath);
        console.log(`File content: ${fileContent}`);

        const newContent = fileContent.replace(/(export class WebhookRequest)/, "$1 extends WebhookResponseBase");
        await replaceFileContent(filePath, newContent);
    }
}
