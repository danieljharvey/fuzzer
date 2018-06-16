import { SyntaxKind } from "typescript";

type Func = (...p: any[]) => any;

export const calcAll = (obj: any) => Object.keys(obj).map(key => calcJSFunctionParams(obj[key], key));

interface JSFunction {
  name: string;
  parameters: string[];
  kind: SyntaxKind;
  lines: number;
  func: Func;
}

export const calcJSFunctionParams = (func: Func, funcName?: string): JSFunction => {
  return {
    name: getFunctionName(func, funcName || ""),
    parameters: parseParamNames(func.toString()),
    kind: getFunctionKind(func),
    lines: getFunctionLines(func),
    func: func
  };
};

const getFunctionName = (func: any, funcName: string): string => {
  return func.name.length > 0 ? func.name : funcName;
};

const parseParamNames = (str: string): string[] => {
  const start = str.indexOf("(");
  const end = str.indexOf(")");
  const substr = str.substr(start + 1, end - start - 1);
  return substr.split(",").map(bit => bit.trim());
};

const getFunctionKind = (func: any): SyntaxKind => {
  return func.name.length > 0 ? SyntaxKind.FunctionDeclaration : SyntaxKind.VariableDeclaration;
};

const getFunctionLines = (func: any): number => {
  return parseFunctionBody(func.toString()).length;
};

const parseFunctionBody = (str: string): string[] => {
  const start = str.indexOf("{");
  const end = str.lastIndexOf("}");
  const substr = str.substr(start + 1, end - start - 1);
  return substr
    .split("\n")
    .map(bit => bit.trim())
    .filter(bit => bit.length > 0);
};
