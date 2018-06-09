import { tsquery } from "@phenomnomnominal/tsquery";
import { SourceFile, SyntaxKind } from "typescript";

export const extractAll = (code: string): any => {
  return extractConstFunctions(code).concat(extractFunctions(code));
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
    lines: getConstFunctionLines(node.initializer.body)
  };
};

const getConstFunctionLines = (body: any) => {
  return body.statements ? body.statements.length : body.text.split("\n").length;
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
