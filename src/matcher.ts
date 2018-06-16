import { FunctionParams } from "./ts-funcs";
import { InterfaceParams } from "./interfaces";

export const match = (tsFuncs: FunctionParams[]) => (jsFunc: any): FunctionParams | false => {
  const found = tsFuncs.filter(tsFunc => {
    return tsFunc.name === jsFunc.name;
  });
  return found.length === 1 ? found[0] : false;
};

export const wrapMatched = (matched: any, jsFunc: any) => {
  return matched
    ? {
        name: matched.name,
        details: matched,
        func: jsFunc.func
      }
    : false;
};

export const matchInterface = (interfaces: InterfaceParams[], name: string): InterfaceParams | false => {
  const found = interfaces.filter(inter => {
    return inter.name === name;
  });
  return found.length === 1 ? found[0] : false;
};
