import path from 'path';
import { promises as fsPromises } from 'fs';

export class FileService {
    isPathToFile(path: string): boolean {
        return path.split('/').length > 1;
    };

    async search(directory: string, fileName: string): Promise<string | null> {
        try {
            console.log("[FileService]: Opening directory", directory);

            const dir = await fsPromises.opendir(directory);

            if (!this.isPathToFile(fileName)) {
                for await (const dirent of dir) {
                    const entryPath = path.resolve(directory, dirent.name);
                    console.log(`Searching in ${entryPath} for file ${fileName}...`);

                    if (dirent.name.endsWith(fileName)) {
                        return entryPath;
                    }

                    const stats = await fsPromises.stat(entryPath);
                    if (stats.isDirectory()) {
                        const result = await this.search(entryPath, fileName);
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
}
