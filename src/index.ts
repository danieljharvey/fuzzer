// great job
export * from "./ts-funcs";
export * from "./js-funcs";
export * from "./matcher";
import { extractAll, FunctionParams, ParamType } from "./ts-funcs";
import { match, wrapMatched } from "./matcher";
import { calcAll } from "./js-funcs";
import { SyntaxKind } from "typescript";
import { InterfaceParams } from "./interfaces";

export const runFunction = (wrapped: any[], func: (...args: any[]) => any) => {
  const wrap = findInWrapped(wrapped, func);
  if (!wrap) {
    throw "Could not find, what!";
  }
  return wrap.details.parameters.length === 0 ? func() : runWithParams(wrap);
};

const runWithParams = (wrapped: any) => {
  const paramData = wrapped.details.parameters.map(getParamData);
  return wrapped.func(...paramData);
};

export const getParamData = (param: ParamType) => {
  return dataForType(param.types);
};

const dataForType = (types: SyntaxKind[]) => {
  switch (types[0]) {
    case SyntaxKind.StringKeyword:
      return genString();
    case SyntaxKind.NumberKeyword:
      return genNumber();
    case SyntaxKind.BooleanKeyword:
      return genBool();
    case SyntaxKind.ArrayType:
      const remainder = types.slice(1);
      return genArray(remainder);
    default:
      return genNumber();
  }
};

export const genInterface = (inter: InterfaceParams): any => {
  return inter.children.reduce((acc, val: ParamType) => {
    const data = val.types[0] === SyntaxKind.TypeLiteral ? genInterface(val) : getParamData(val);
    return { ...acc, [val.name]: data };
  }, {});
};

const randomIntGen = (max: number): number => Math.round(Math.random() * max);

const genBool = (): boolean => {
  return Boolean(randomIntGen(1));
};

const genChar = (): string => {
  return String.fromCharCode(randomIntGen(255));
};

const genString = (): string => {
  const length = randomIntGen(1000);
  let str = "";
  for (let i = 0; i < length; i++) {
    str = str + genChar();
  }
  return str;
};

const genNumber = (): number => {
  return Math.random() * 30000;
};

const genArray = (subTypes: SyntaxKind[]): any[] => {
  const length = randomIntGen(1000);
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(dataForType(subTypes));
  }
  return arr;
};

export const wrapAll = (code: string, obj: any) => {
  const matcher = match(extractAll(code));
  return calcAll(obj)
    .map(jsFunc => {
      const matched = matcher(jsFunc);
      return wrapMatched(matched, jsFunc);
    })
    .filter(i => i);
};

export const findInWrapped = (wrapped: any[], func: any) => {
  const found = wrapped.filter(wrap => wrap.func.toString() === func.toString());
  return found.length > 0 ? found[0] : false;
};
