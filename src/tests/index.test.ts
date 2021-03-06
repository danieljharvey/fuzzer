import {
  runFunction,
  extractAll,
  calcJSFunctionParams,
  calcAll,
  match,
  wrapMatched,
  wrapAll,
  findInWrapped,
  genInterface
} from "../index";
import { extractInterfaces } from "../interfaces";
import * as funcs from "./test-data/functions";
import * as moreFuncs from "./test-data/more-functions";
import * as matcherFuncs from "./test-data/matcher-functions";
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
    result.map((item: any) => {
      expect(item).toBeGreaterThan(-1);
      expect(Number(item)).toEqual(item);
    });
  });

  it("Runs a function that wants an array of strings", () => {
    const allWrapped = wrapAll(readFile("more-functions"), moreFuncs);
    const result = runFunction(allWrapped, moreFuncs.multiString);
    result.map((item: any) => {
      expect(item).toContain("!");
    });
  });

  it("Successfully generates a nested array", () => {
    const allWrapped = wrapAll(readFile("more-functions"), moreFuncs);
    const result = runFunction(allWrapped, moreFuncs.board);
    expect(Array.isArray(result)).toBeTruthy();
    expect(Array.isArray(result[0])).toBeTruthy();
    expect(Array.isArray(result[0][0])).toBeFalsy();
  });

  it("Successfully generates an interface", () => {
    const allWrapped = wrapAll(readFile("matcher-functions"), matcherFuncs);
    const result = runFunction(allWrapped, matcherFuncs.showDog);
    expect(String(result.name)).toEqual(result.name);
    expect(Boolean(result.poo)).toEqual(result.poo);
  });
});

export const readFile = (filename: string): string => {
  return fs.readFileSync(`./src/tests/test-data/${filename}.ts`, "utf8");
};

const allFunctionsString = readFile("functions");

const allFunctions = funcs;

describe("Matches JS functions with their source code", () => {
  it("Finds 6 function in the code", () => {
    expect(extractAll(allFunctionsString).funcs).toHaveLength(6);
  });

  it("Finds 6 functions in the export", () => {
    expect(Object.keys(allFunctions).length).toEqual(6);
  });

  it("Transforms object of functions into list", () => {
    expect(calcAll(allFunctions).length).toEqual(6);
  });

  it("Finds regular function func0 from list of functions", () => {
    const found = match(extractAll(allFunctionsString).funcs)(calcJSFunctionParams(funcs.func0));
    expect(found && found.name).toEqual("func0");
  });

  it("Finds const function func1Number from list of functions", () => {
    const found = match(extractAll(allFunctionsString).funcs)(
      calcJSFunctionParams(funcs.func1Number, "func1Number")
    );
    expect(found && found.name).toEqual("func1Number");
  });

  it("Matches all the functions", () => {
    const matcher = match(extractAll(allFunctionsString).funcs);
    calcAll(allFunctions).map(jsFunc => {
      const found = matcher(jsFunc);
      expect(found && found.name).toEqual(jsFunc.name);
    });
  });

  it("Wraps all the functions", () => {
    const matcher = match(extractAll(allFunctionsString).funcs);
    calcAll(allFunctions).map(jsFunc => {
      const matched = matcher(jsFunc);
      const wrapped = wrapMatched(matched, jsFunc);
      expect(wrapped && wrapped.name).toEqual(jsFunc.name);
      expect(wrapped && wrapped.func).toEqual(jsFunc.func);
      expect(wrapped && wrapped.details).toEqual(matched);
    });
  });

  it("Wraps everything in one go", () => {
    expect(wrapAll(allFunctionsString, allFunctions).funcs).toHaveLength(6);
  });

  it("Finds a const func in pile", () => {
    const allWrapped = wrapAll(allFunctionsString, allFunctions);
    expect(findInWrapped(allWrapped.funcs, funcs.func1Number).name).toEqual("func1Number");
  });
});

const anotherInterface = `
interface Stuff {
    name: string
    age: number
    things: number[]
  }`;

describe("It uses an interface to generate data", () => {
  it("Generates stuff that makes sense", () => {
    const firstInterface = extractInterfaces(anotherInterface)[0];
    const generated = genInterface(firstInterface);
    expect(generated.name.toString()).toEqual(generated.name);
    expect(Number(generated.age)).toEqual(generated.age);
    generated.things.map((thing: number) => {
      expect(Number(thing)).toEqual(thing);
    });
  });
});

const anotherMoreComplicatedInterface = `
interface Stuff {
    name: string
    age: number
    what: {
        things: number[]
        hat: string
    }    
  }`;

describe("It uses an interface to generate data with nested stuff", () => {
  it("Generates complicated stuff that makes sense", () => {
    const firstInterface = extractInterfaces(anotherMoreComplicatedInterface)[0];
    const generated = genInterface(firstInterface);
    expect(generated.name.toString()).toEqual(generated.name);
    expect(generated.what.hat.toString()).toEqual(generated.what.hat);
    expect(Number(generated.age)).toEqual(generated.age);
    generated.what.things.map((thing: number) => {
      expect(Number(thing)).toEqual(thing);
    });
  });
});
