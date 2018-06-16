import { extractInterfaces } from "../interfaces";
import { SyntaxKind } from "typescript";

const basicInterfaceCode = `
interface Horse {
    name: string
    age: number
  }`;

describe("It understands basic interfaces", () => {
  it("Finds an interface", () => {
    expect(extractInterfaces(basicInterfaceCode)).toHaveLength(1);
  });

  it("Works out it's name", () => {
    const firstInterface = extractInterfaces(basicInterfaceCode)[0];
    expect(firstInterface.name).toEqual("Horse");
  });

  it("Counts it has 2 members", () => {
    const firstInterface = extractInterfaces(basicInterfaceCode)[0];
    expect(firstInterface.children).toHaveLength(2);
  });

  it("Gets the names of the first 2 members", () => {
    const firstInterface = extractInterfaces(basicInterfaceCode)[0];
    expect(firstInterface.children[0].name).toEqual("name");
    expect(firstInterface.children[1].name).toEqual("age");
  });

  it("Gets the types of the first two members", () => {
    const firstInterface = extractInterfaces(basicInterfaceCode)[0];
    expect(firstInterface.children[0].types).toEqual([SyntaxKind.StringKeyword]);
    expect(firstInterface.children[1].types).toEqual([SyntaxKind.NumberKeyword]);
  });
});

const nestedInterfaceCode = `
interface Horse2 {
    jumps: {
        min: number
        max: number
    }
  }`;

describe("It understands nested interfaces", () => {
  it("Finds an interface", () => {
    expect(extractInterfaces(nestedInterfaceCode)).toHaveLength(1);
  });

  it("Works out it's name", () => {
    const firstInterface = extractInterfaces(nestedInterfaceCode)[0];
    expect(firstInterface.name).toEqual("Horse2");
  });

  it("Counts it has 2 members", () => {
    const firstInterface = extractInterfaces(nestedInterfaceCode)[0];
    expect(firstInterface.children).toHaveLength(1);
  });

  it("Gets the names of the first member", () => {
    const firstInterface = extractInterfaces(nestedInterfaceCode)[0];
    expect(firstInterface.children[0].name).toEqual("jumps");
  });

  it("Gets the types of the first member", () => {
    const firstInterface = extractInterfaces(nestedInterfaceCode)[0];
    expect(firstInterface.children[0].types).toEqual([SyntaxKind.TypeLiteral]);
  });

  it("Counts two children in the first member", () => {
    const firstInterface = extractInterfaces(nestedInterfaceCode)[0];
    expect(firstInterface.children[0].children).toHaveLength(2);
  });

  it("Calculates the names of the two child members", () => {
    const firstInterface = extractInterfaces(nestedInterfaceCode)[0];
    expect(firstInterface.children[0].children[0].name).toEqual("min");
    expect(firstInterface.children[0].children[1].name).toEqual("max");
  });

  it("Calculates the types of the two child members", () => {
    const firstInterface = extractInterfaces(nestedInterfaceCode)[0];
    expect(firstInterface.children[0].children[0].types).toEqual([SyntaxKind.NumberKeyword]);
    expect(firstInterface.children[0].children[1].types).toEqual([SyntaxKind.NumberKeyword]);
  });
});
