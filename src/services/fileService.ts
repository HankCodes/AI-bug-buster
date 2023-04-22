import path from 'path';
import { promises as fsPromises } from 'fs';

export class FileService {

    async search(directory: string, fileName: string): Promise<string | null> {
        try {
            console.log("[FileService]: Opening directory", directory);
            const dir = await fsPromises.opendir(directory);

            console.log(`[FileService]: File to search for: ${fileName}`);

            for await (const dirent of dir) {
                const entryPath = path.resolve(directory, dirent.name);
                console.log(`[FileService]: Searching in ${entryPath} for file ${fileName}...`);

                const stats = await fsPromises.stat(entryPath);
                if (stats.isDirectory()) {
                    const result = await this.search(entryPath, fileName);
                    if (result) {
                        return result;
                    }
                }

                if (dirent.name.endsWith(fileName)) {
                    console.log(`[FileService]: file "${fileName}" found in ${entryPath}!`);
                    return entryPath;
                }
            }

            return null;
        } catch (err) {
            console.error(`Error while searching for file ${fileName} in directory ${directory}:`, err);
            throw err;
        }
    };

    async getContent(filePath: string): Promise<string> {
        try {
            return await fsPromises.readFile(filePath, 'utf-8');
        } catch (err) {
            console.error(`Error while extracting content from file ${filePath}:`, err);
            throw err;
        }
    };

    async replaceContent(filePath: string, newContent: string): Promise<boolean> {
        try {
            await fsPromises.writeFile(filePath, newContent, 'utf-8');
            return true;
        } catch (err) {
            console.error(`Error while replacing content in file ${filePath}:`, err);
            throw err;
        }
    };

    public getFileNameFomPath(path: string): string | null {
        if (!this.isFilePath(path)) {
            return path
        }

        console.log(`[FileService]: Extracing filename from path ${path}`);
        const extractedFileNme = path.split('/').pop() || null;

        if (!extractedFileNme) {
            console.log("[FileService]: Could not extract a file name from the following path: ", path);
            return null;
        }

        console.log(`[FileService]: File name extracted: ${extractedFileNme}`);
        return extractedFileNme;
    }

    private isFilePath(path: string): boolean {
        return path.split('/').length > 1;
    };

}
