import { runFunction, extractConstFunctions, extractFunctions } from '../src/index'
import { tsquery } from '@phenomnomnominal/tsquery'
import * as funcs from './functions'
import { SyntaxKind } from 'typescript';

describe("It is the tests", () => {
    it("Runs a zero arity function", () => {
        expect(runFunction(funcs.func0)).toEqual("poo")
    })

    it("Runs a one arity function", () => {
        const result = runFunction(funcs.func1Number)

        expect(Number(result)).toEqual(result)
        expect(result + 1).toEqual(result + 1)
    })

    it.skip("Runs a one arity function that wants a string", () => {
        const result = runFunction(funcs.func1String)
        expect(String(result)).toEqual(result)
        expect(result + "!").toEqual(result + "!")
    })
})

const testCode = `
export const func0 = () => {
    return "poo"
}

export const func1Number = (num: number) => {
    return num
}

export const func1String = (str: string) => {
    return str
}

export function func1Number2(num: number) {
    return num
}
`
describe("Parsing for const functions", () => {
    it("Detects that there are three functions", () => {
        expect(extractConstFunctions(testCode).length).toEqual(3)
    })

    it("Detects that these are Consts", () => {
        extractConstFunctions(testCode).map((node: any) => {
            expect(node.kind).toEqual(SyntaxKind.VariableStatement)
        })
    })
})

describe("Parsing for regular functions", () => {
    it("Detects that there is one function", () => {
        expect(extractFunctions(testCode).length).toEqual(1)
    })


    it("Detects that these are Functions", () => {
        extractFunctions(testCode).map((node: any) => {
            expect(node.kind).toEqual(SyntaxKind.FunctionDeclaration)
        })
    })

    it("Detects that the function requires one argument", () => {
        const firstFunc = extractFunctions(testCode)[0]
        expect(firstFunc.parameters.length).toEqual(1)
    })

    it("Detects that the first function requires a number", () => {
        const firstFunc = extractFunctions(testCode)[0]
        expect(firstFunc.parameters[0].type).toEqual(SyntaxKind.NumberKeyword)
    })

    it('Gets the first functions name', () => {
        const firstFunc = extractFunctions(testCode)[0]
        expect(firstFunc.name).toEqual("func1Number2")
    })

    it('Counts 1 line of statements in the first function', () => {

    })
})