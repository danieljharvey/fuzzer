import { extractConstFunctions, extractFunctions } from "../ts-funcs";
import { SyntaxKind } from "typescript";

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

describe("It passes more complex parameters", () => {
  it("Can detect an array of numbers", () => {
    const firstCode = `const aaaa = (a: number[]): number[] => a`;
    const firstFunc = extractConstFunctions(firstCode)[0];
    const firstParam = firstFunc.parameters[0];
    expect(firstParam.type).toEqual(SyntaxKind.ArrayType);
    expect(firstParam.elementType[0]).toEqual(SyntaxKind.NumberKeyword);
  });

  it("Can detect an array of numbers in array<number> format", () => {
    const firstCode = `const aaaa = (a: Array<number>): number[] => a`;
    const firstFunc = extractConstFunctions(firstCode)[0];
    const firstParam = firstFunc.parameters[0];
    expect(firstParam.type).toEqual(SyntaxKind.ArrayType);
    expect(firstParam.elementType[0]).toEqual(SyntaxKind.NumberKeyword);
  });

  it("Can spot a boolean", () => {
    const firstCode = `const aaaa = (a: boolean): boolean => a`;
    const firstFunc = extractConstFunctions(firstCode)[0];

    expect(firstFunc.parameters[0].type).toEqual(SyntaxKind.BooleanKeyword);
  });

  it("Detects a nested array", () => {
    const code = `
    export const board = (board: number[][]) => {
      return board.map(row => row.map(thing => thing + 1));
    };
    `;
    const firstFunc = extractConstFunctions(code)[0];
    const firstParam = firstFunc.parameters[0];
    expect(firstParam.type).toEqual(SyntaxKind.ArrayType);
    expect(firstParam.elementType[0]).toEqual(SyntaxKind.ArrayType);
    expect(firstParam.elementType[1]).toEqual(SyntaxKind.NumberKeyword);
  });

  it.skip("Can use an interface", () => {
    const code = `
      interface Horse {
        name: string
        age: number
      }

      const useHorse = (horse: Horse): boolean => {
        return true
      }
    `;

    const firstFunc = extractConstFunctions(code)[0];
    const firstParam = firstFunc.parameters[0];
    expect(firstParam.type).toEqual(SyntaxKind.Identifier);
  });
});
