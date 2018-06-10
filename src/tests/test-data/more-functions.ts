export function func1Number2(strings: string[]): string {
  return strings.reduce((acc, val) => acc + val);
}

export function boolTime(bool: boolean): boolean {
  return !bool;
}

export const multiString = (str: string[]) => {
  return str.map(i => i + "!");
};

export const board = (board: number[][]) => {
  return board.map(row => row.map(thing => thing + 1));
};
