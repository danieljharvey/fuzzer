import { calcJSFunctionParams } from "./js-funcs";
import * as funcs from "./functions";
import { SyntaxKind } from "typescript";

describe("Passing JS functions for information", () => {
  it("Gets the function name", () => {
    const func = funcs.func0;
    const params = calcJSFunctionParams(func);
    expect(params.name).toEqual("func0");
  });

  it("Gets the number of arguments for a function", () => {
    expect(calcJSFunctionParams(funcs.func1Number2).parameters.length).toEqual(1);
  });

  it("Gets the names of the arguments for a function", () => {
    expect(calcJSFunctionParams(funcs.func1Number2).parameters).toEqual(["num"]);
  });

  it("Detects this is a regular function", () => {
    expect(calcJSFunctionParams(funcs.func1Number2).kind).toEqual(SyntaxKind.FunctionDeclaration);
  });

  it("Detects the number of lines in the function", () => {
    expect(calcJSFunctionParams(funcs.func1Number2).lines).toEqual(1);
  });
});

describe("Passing JS const functions for information", () => {
  it("Gets a const function name", () => {
    expect(calcJSFunctionParams(funcs.func1Number, "func1Number").name).toEqual("func1Number");
  });

  it("Gets the number of arguments for a const function", () => {
    expect(calcJSFunctionParams(funcs.func1Number).parameters.length).toEqual(1);
  });

  it("Gets the names of the arguments for a const function", () => {
    expect(calcJSFunctionParams(funcs.func1Number).parameters).toEqual(["num"]);
  });

  it("Detects this is a const function", () => {
    expect(calcJSFunctionParams(funcs.func1Number).kind).toEqual(SyntaxKind.VariableDeclaration);
  });

  it("Detects the number of lines in a const function", () => {
    expect(calcJSFunctionParams(funcs.func1String).lines).toEqual(1);
  });

  it("Detects the number of lines in a bracketless const function", () => {
    expect(calcJSFunctionParams(funcs.func1NumberBracketless).lines).toEqual(1);
  });

  it("Includes the actual function we passed", () => {
    expect(calcJSFunctionParams(funcs.func1NumberBracketless).func).toEqual(funcs.func1NumberBracketless);
  });
});
