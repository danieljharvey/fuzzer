import { tsquery } from "@phenomnomnominal/tsquery";
import { SyntaxKind } from "typescript";
import { InterfaceParams, extractInterfaces } from "./interfaces";

export interface Extracted {
  funcs: FunctionParams[];
  interfaces: InterfaceParams[];
}

function flatten(arr: any[]): any[] {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

export const combineExtracted = (extracted: Extracted[]): Extracted => ({
  funcs: flatten(extracted.map(x => x.funcs)),
  interfaces: flatten(extracted.map(x => x.interfaces))
})

export const extractAll = (code: string): Extracted => ({
  funcs: extractConstFunctions(code).concat(extractFunctions(code)),
  interfaces: extractInterfaces(code)
})

export const extractConstFunctions = (code: string): FunctionParams[] => {
  const ast = tsquery.ast(code);

  const query = "VariableStatement VariableDeclarationList";
  const nodes = tsquery(ast, query) || []

  return nodes.map(getVariableDeclaration).map(calcConstFunctionParams);
};

const getVariableDeclaration = (node: any) => node.declarations[0];

export const extractFunctions = (code: string): FunctionParams[] => {
  const ast = tsquery.ast(code);

  const query = "FunctionDeclaration";
  const nodes = tsquery(ast, query) || []

  return nodes.map(calcFunctionParams);
};

export interface FunctionParams {
  name: string;
  kind: SyntaxKind;
  parameters: { [key: string]: ParamType };
  lines: number;
}

const calcConstFunctionParams = (node: any): FunctionParams => {
  const parameters = node.initializer.parameters || []
  return {
    name: node.name.name,
    kind: node.kind,
    parameters: parameters.map(calcParameterTypes).filter(notFalse),
    lines: getConstFunctionLines(node.initializer.body)
  };
};

const getConstFunctionLines = (body: any): number => {
  if (!body) return 0
  return body.statements ? body.statements.length : body.text.split("\n").length;
};

const calcFunctionParams = (node: any): FunctionParams => {
  return {
    name: node.name.name,
    kind: node.kind,
    parameters: node.parameters.map(calcParameterTypes).filter(notFalse),
    lines: node.body.statements.length
  };
};

export interface ParamType {
  name: string;
  types: SyntaxKind[];
  children: ParamType[];
  interfaceName: string;
}

const notFalse = (x: any) => x !== false

export const calcParameterTypes = (param: any): ParamType | false => {
  if (param.name === undefined) return false
  return {
    name: param.name.name,
    types: [calcType(param.type)].concat(calcTypeArguments(param.type)),
    children: calcParameterChildren(param),
    interfaceName: calcInterfaceName(param)
  };
};

const calcInterfaceName = (param: any): string => {
  return param.type.kind === SyntaxKind.TypeReference ? param.type.text : "";
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
