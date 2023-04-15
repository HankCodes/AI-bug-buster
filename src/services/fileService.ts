import path from 'path';
import { promises as fsPromises } from 'fs';

const isPathToFile = (path: string): boolean => {
    return path.split('/').length > 1;
};

const search = async (directory: string, fileName: string): Promise<string | null> => {
    try {

        const dir = await fsPromises.opendir(directory);

        if (!isPathToFile(fileName)) {
            for await (const dirent of dir) {
                const entryPath = path.resolve(directory, dirent.name);
                console.log(`Searching in ${entryPath} for file ${fileName}...`);

                if (dirent.name.endsWith(fileName)) {
                    return entryPath;
                }

                const stats = await fsPromises.stat(entryPath);
                if (stats.isDirectory()) {
                    const result = await search(entryPath, fileName);
                    if (result) {
                        return result;
                    }
                }
            }
        } else {
            return fileName
        }

        return null;
    } catch (err) {
        console.error(`Error while searching for file ${fileName} in directory ${directory}:`, err);
        throw err;
    }
};

const getContent = async (filePath: string): Promise<string> => {
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


export const searchAndReplaceFileContent = async (fileToFind: string) => {
    const directoryToSearch = "src";
    console.log(`Searching for file ${fileToFind} in directory ${directoryToSearch}...`);

    const filePath = await search(fileToFind, directoryToSearch);
    console.log(`File found: ${filePath}`);

    if (filePath) {
        const fileContent = await getContent(filePath);
        console.log(`File content: ${fileContent}`);

        const newContent = "export interface WebhookRequestBaseBoii {\n  payload: string;\n}"
        await replaceFileContent(filePath, newContent);
    }
}



export const fileService = {
    search,
    getContent,
    replaceFileContent,
}
