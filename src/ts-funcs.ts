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

export interface FunctionParams {
  name: string;
  kind: SyntaxKind;
  parameters: { [key: string]: ParamType };
  lines: number;
}

const calcConstFunctionParams = (node: any): FunctionParams => {
  return {
    name: node.name.name,
    kind: node.kind,
    parameters: node.initializer.parameters.map(calcParameterTypes),
    lines: getConstFunctionLines(node.initializer.body)
  };
};

const getConstFunctionLines = (body: any): number => {
  return body.statements ? body.statements.length : body.text.split("\n").length;
};

const calcFunctionParams = (node: any): FunctionParams => {
  return {
    name: node.name.name,
    kind: node.kind,
    parameters: node.parameters.map(calcParameterTypes),
    lines: node.body.statements.length
  };
};

export interface ParamType {
  name: string;
  types: SyntaxKind[];
  children: ParamType[];
}

export const calcParameterTypes = (param: any): ParamType => {
  return {
    name: param.name.name,
    types: [calcType(param.type)].concat(calcTypeArguments(param.type)),
    children: calcParameterChildren(param)
  };
};

const calcParameterChildren = (param: any): ParamType[] => {
  if (calcType(param.type) !== SyntaxKind.TypeLiteral) {
    return [];
  } else {
    return param.type.members.map(calcParameterTypes);
  }
};

const calcType = (type: any): SyntaxKind => {
  return type.kind === 161 ? getTypeFromName(type.typeName.name) : type.kind;
};

const getTypeFromName = (typeName: string): SyntaxKind => {
  switch (typeName.toLowerCase()) {
    case "array":
      return SyntaxKind.ArrayType;
    default:
      return SyntaxKind.Identifier;
  }
};

const calcTypeArguments = (type: any): SyntaxKind[] => {
  if (type.elementType) {
    return calcElementType([], type);
  } else if (type.typeArguments) {
    return type.typeArguments.map((typeArgument: any) => typeArgument.kind);
  } else {
    return [];
  }
};

const calcElementType = (all: SyntaxKind[], type: any): SyntaxKind[] => {
  return type.elementType ? calcElementType([...all, type.elementType.kind], type.elementType) : all;
};
