import { tsquery } from "@phenomnomnominal/tsquery";
import { SourceFile, SyntaxKind } from "typescript";
import { ADDRGETNETWORKPARAMS } from "dns";

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
    type: calcType(param.type),
    elementType: calcTypeArguments(param.type)
  };
};

const calcType = (type: any) => {
  return type.kind === 161 ? getTypeFromName(type.typeName.name) : type.kind;
};

const getTypeFromName = (typeName: string) => {
  switch (typeName.toLowerCase()) {
    case "array":
      return SyntaxKind.ArrayType;
    default:
      return SyntaxKind.Identifier;
  }
};

const calcTypeArguments = (type: any) => {
  if (type.elementType) {
    return calcElementType([], type);
  } else if (type.typeArguments) {
    return type.typeArguments.map((typeArgument: any) => typeArgument.kind);
  } else {
    return 0;
  }
};

const calcElementType = (all: SyntaxKind[], type: any): SyntaxKind[] => {
  return type.elementType ? calcElementType([...all, type.elementType.kind], type.elementType) : all;
};
