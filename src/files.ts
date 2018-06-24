import { Promise } from 'es6-promise'

const fs = require('fs')

export const getAllFiles = (filePath: string): Promise<string>[] => {
    return filterTS(getAllFilenames(filePath, [])).map(readFile)
}

const getAllFilenames = function (filePath: string, filelist: string[]) {
    const files = fs.readdirSync(filePath);
    files.forEach(function (file: string) {
        if (fs.statSync(filePath + file).isDirectory()) {
            filelist = getAllFilenames(filePath + file + '/', filelist);
        }
        else {
            filelist.push(filePath + file);
        }
    });
    return filelist;
};

const filterTS = (filenames: string[]): string[] => filenames.filter(name => name.indexOf('.ts') !== -1)

const readFile = (filename: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err: any, data: string) => {
            if (err) {
                return reject(err)
            }
            return resolve(data)
        });
    })

}