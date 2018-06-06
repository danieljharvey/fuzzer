import { tsquery } from "@phenomnomnominal/tsquery";
import { SourceFile, SyntaxKind } from "typescript";

// great job
const fs = require("fs");

export const runFunction = (func: (...args: any[]) => any) => {
  switch (func.length) {
    case 0:
      return func();
    case 1:
      return oneArity(func);
    case 2:
      return twoArity(func);
    default:
      return func();
  }
};

const oneArity = (func: (a: any) => any) => {
  const a = genNumber();
  return func(a);
};

const twoArity = (func: (a: any, b: any) => any) => {
  const a = genChar();
  const b = genChar();
  return func(a, b);
};

const genChar = (): string => {
  return String.fromCharCode(Math.round(Math.random() * 512));
};

const genNumber = (): number => {
  return Math.random() * 30000;
};

const readFile = (): string => {
  return fs.readFileSync("./src/functions.ts", "utf8");
};

export const extractConstFunctions = (code: string): any => {
  const ast = tsquery.ast(code);

  const query = "VariableStatement VariableDeclarationList";
  const nodes = tsquery(ast, query);
  // console.log(nodes[0]); // the TypeScript AST Node for the constructor function
  return nodes.map(getVariableDeclaration).map(calcConstFunctionParams);
};

const getVariableDeclaration = (node: any) => node.declarations[0];

export const extractFunctions = (code: string): any => {
  const ast = tsquery.ast(code);

  const query = "FunctionDeclaration";
  const nodes = tsquery(ast, query);

  return nodes.map(calcFunctionParams);
};

const calcConstFunctionParams = (node: any): any => {
  return {
    name: node.name.name,
    kind: node.kind,
    parameters: node.initializer.parameters.map(calcParameterTypes),
    lines: node.initializer.body.statements.length
  };
};

const calcFunctionParams = (node: any): any => {
  return {
    name: node.name.name,
    kind: node.kind,
    parameters: node.parameters.map(calcParameterTypes),
    lines: node.body.statements.length
  };
};

const calcParameterTypes = (param: any): any => {
  return {
    name: param.name.name,
    type: param.type.kind
  };
};
