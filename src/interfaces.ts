import { tsquery } from "@phenomnomnominal/tsquery";
import { calcParameterTypes } from "./ts-funcs";
import { getParamData } from "./fuzzer";

export const extractInterfaces = (code: string): InterfaceParams[] => {
  const ast = tsquery.ast(code);

  const query = "InterfaceDeclaration";
  const nodes = tsquery(ast, query);
  return nodes.map(calcInterfaceParams);
};

export interface InterfaceParams {
  name: string;
  children: any[];
}

const calcInterfaceParams = (node: any): InterfaceParams => {
  return {
    name: node.name.name,
    children: node.members.map(calcParameterTypes)
  };
};
