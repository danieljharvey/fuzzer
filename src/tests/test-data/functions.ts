export function func0() {
  return "poo";
}

export const func1Number = (num: number) => {
  return num;
};

export const func1String = (str: string) => {
  return str + "!";
};

export function func1Number2(nums: number[]): number[] {
  return nums.map(num => num + 1);
}

export const func1NumberBracketless = (num: number) => num + 10;

export const numAndString = (num: number, str: string) => [num, str];
