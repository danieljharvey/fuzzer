// great job
export * from "./ts-funcs";
export * from "./js-funcs";
export * from "./matcher";
import { extractAll } from "./ts-funcs";
import { match, wrapMatched } from "./matcher";
import { calcAll } from "./js-funcs";
import { SyntaxKind } from "typescript";

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

const getParamData = (param: any) => {
  switch (param.type) {
    case SyntaxKind.ArrayType:
      return genArray(param.elementType[0]);
    default:
      return dataForType(param.type);
  }
};

const dataForType = (type: SyntaxKind) => {
  switch (type) {
    case SyntaxKind.StringKeyword:
      return genString();
    case SyntaxKind.NumberKeyword:
      return genNumber();
    case SyntaxKind.BooleanKeyword:
      return genBool();
    case SyntaxKind.ArrayType:
      console.log("array!");
      return [[]];
    default:
      return genNumber();
  }
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

const genArray = (subType: SyntaxKind): any[] => {
  const length = randomIntGen(1000);
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(dataForType(subType));
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
