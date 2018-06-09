import {
  runFunction,
  extractAll,
  calcJSFunctionParams,
  calcAll,
  match,
  wrapMatched,
  wrapAll,
  findInWrapped
} from "../src/index";
import * as funcs from "./functions";
const fs = require("fs");

describe("It is the tests", () => {
  it("Runs a zero arity function", () => {
    const allWrapped = wrapAll(allFunctionsString, allFunctions);
    expect(runFunction(allWrapped, funcs.func0)).toEqual("poo");
  });

  it("Runs a one arity function", () => {
    const allWrapped = wrapAll(allFunctionsString, allFunctions);
    const result = runFunction(allWrapped, funcs.func1Number);

    expect(Number(result)).toEqual(result);
    expect(result + 1).toEqual(result + 1);
  });

  it("Runs a one arity function that wants a string", () => {
    const allWrapped = wrapAll(allFunctionsString, allFunctions);
    const result = runFunction(allWrapped, funcs.func1String);
    expect(String(result)).toEqual(result);
    expect(result + "!").toEqual(result + "!");
  });

  it("Runs a two arity function that wants a string and then a number", () => {
    const allWrapped = wrapAll(allFunctionsString, allFunctions);
    const result = runFunction(allWrapped, funcs.numAndString);
    const [numResult, strResult] = result;
    expect(String(strResult)).toEqual(strResult);
    expect(Number(numResult)).toEqual(numResult);
  });

  it("Runs a function that wants an array of numbers", () => {
    const allWrapped = wrapAll(allFunctionsString, allFunctions);
    const result = runFunction(allWrapped, funcs.func1Number2);
    result.map((item: any) => expect(Number(item)).toEqual(item));
  });
});

const readFile = (): string => {
  return fs.readFileSync("./src/functions.ts", "utf8");
};

const allFunctionsString = readFile();

const allFunctions = funcs;

describe("Matches JS functions with their source code", () => {
  it("Finds 6 function in the code", () => {
    expect(extractAll(allFunctionsString).length).toEqual(6);
  });

  it("Finds 6 functions in the export", () => {
    expect(Object.keys(allFunctions).length).toEqual(6);
  });

  it("Transforms object of functions into list", () => {
    expect(calcAll(allFunctions).length).toEqual(6);
  });

  it("Finds regular function func0 from list of functions", () => {
    expect(match(extractAll(allFunctionsString))(calcJSFunctionParams(funcs.func0)).name).toEqual("func0");
  });

  it("Finds const function func1Number from list of functions", () => {
    expect(
      match(extractAll(allFunctionsString))(calcJSFunctionParams(funcs.func1Number, "func1Number")).name
    ).toEqual("func1Number");
  });

  it("Matches all the functions", () => {
    const matcher = match(extractAll(allFunctionsString));
    calcAll(allFunctions).map(jsFunc => {
      expect(matcher(jsFunc).name).toEqual(jsFunc.name);
    });
  });

  it("Wraps all the functions", () => {
    const matcher = match(extractAll(allFunctionsString));
    calcAll(allFunctions).map(jsFunc => {
      const matched = matcher(jsFunc);
      const wrapped = wrapMatched(matched, jsFunc);
      expect(wrapped && wrapped.name).toEqual(jsFunc.name);
      expect(wrapped && wrapped.func).toEqual(jsFunc.func);
      expect(wrapped && wrapped.details).toEqual(matched);
    });
  });

  it("Wraps everything in one go", () => {
    expect(wrapAll(allFunctionsString, allFunctions)).toHaveLength(6);
  });

  it("Finds a const func in pile", () => {
    const allWrapped = wrapAll(allFunctionsString, allFunctions);
    expect(findInWrapped(allWrapped, funcs.func1Number).name).toEqual("func1Number");
  });
});
