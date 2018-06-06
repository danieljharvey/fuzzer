import { runFunction, extractConstFunctions, extractFunctions } from "../src/index";
import { tsquery } from "@phenomnomnominal/tsquery";
import * as funcs from "./functions";
import { SyntaxKind } from "typescript";

describe("It is the tests", () => {
  it("Runs a zero arity function", () => {
    expect(runFunction(funcs.func0)).toEqual("poo");
  });

  it("Runs a one arity function", () => {
    const result = runFunction(funcs.func1Number);

    expect(Number(result)).toEqual(result);
    expect(result + 1).toEqual(result + 1);
  });

  it.skip("Runs a one arity function that wants a string", () => {
    const result = runFunction(funcs.func1String);
    expect(String(result)).toEqual(result);
    expect(result + "!").toEqual(result + "!");
  });
});

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
`;

describe("Parsing for const functions", () => {
  it("Detects that there are three functions", () => {
    expect(extractConstFunctions(testCode).length).toEqual(3);
  });

  it("Detects that these are Consts", () => {
    extractConstFunctions(testCode).map((node: any) => {
      expect(node.kind).toEqual(SyntaxKind.VariableDeclaration);
    });
  });

  it("Gets the first functions name", () => {
    const firstFunc = extractConstFunctions(testCode)[0];
    expect(firstFunc.name).toEqual("func0");
  });

  it("Counts 1 line of statements in the first function", () => {
    const firstFunc = extractConstFunctions(testCode)[0];
    expect(firstFunc.lines).toEqual(1);
  });

  it("Detects that the first const function requires no arguments", () => {
    const firstFunc = extractConstFunctions(testCode)[0];
    expect(firstFunc.parameters.length).toEqual(0);
  });

  it("Gets the second functions name", () => {
    const firstFunc = extractConstFunctions(testCode)[1];
    expect(firstFunc.name).toEqual("func1Number");
  });

  it("Counts 1 line of statements in the second function", () => {
    const firstFunc = extractConstFunctions(testCode)[1];
    expect(firstFunc.lines).toEqual(1);
  });

  it("Detects that the second const function requires 1 argument", () => {
    const firstFunc = extractConstFunctions(testCode)[1];
    expect(firstFunc.parameters.length).toEqual(1);
  });

  it("Detects that the second const function requires a number", () => {
    const firstFunc = extractConstFunctions(testCode)[1];
    expect(firstFunc.parameters[0].type).toEqual(SyntaxKind.NumberKeyword);
  });
});

describe("Parsing for regular functions", () => {
  it("Detects that there is one function", () => {
    expect(extractFunctions(testCode).length).toEqual(1);
  });

  it("Detects that these are Functions", () => {
    extractFunctions(testCode).map((node: any) => {
      expect(node.kind).toEqual(SyntaxKind.FunctionDeclaration);
    });
  });

  it("Detects that the function requires one argument", () => {
    const firstFunc = extractFunctions(testCode)[0];
    expect(firstFunc.parameters.length).toEqual(1);
  });

  it("Detects that the first function requires a number", () => {
    const firstFunc = extractFunctions(testCode)[0];
    expect(firstFunc.parameters[0].type).toEqual(SyntaxKind.NumberKeyword);
  });

  it("Gets the first functions name", () => {
    const firstFunc = extractFunctions(testCode)[0];
    expect(firstFunc.name).toEqual("func1Number2");
  });

  it("Counts 1 line of statements in the first function", () => {
    const firstFunc = extractFunctions(testCode)[0];
    expect(firstFunc.lines).toEqual(1);
  });
});
