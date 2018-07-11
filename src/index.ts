import { getAllFiles } from './files'
import { extractAll, combineExtracted, Extracted } from './ts-funcs'
import { Promise } from 'es6-promise'

const maybeGet = <a>(index: number, arr: a[]): a | null => {
    return (arr[index] === undefined) ? null : arr[index]
}

const checkGlobPath = () => {
    const globPath = maybeGet(2, process.argv)
    if (!globPath) {
        throw `Please pass a path to check!`
    }

    console.log('Path: ' + globPath)
    const allExtractedPromises = getAllFiles(globPath).map(value => value.then(extractAll))
    Promise.all(allExtractedPromises).then((values: Extracted[]) => {
        const combined = combineExtracted(values)
        console.log('yeah', combined)
    }).catch(error => {
        console.warn(error)
    })
}

checkGlobPath()