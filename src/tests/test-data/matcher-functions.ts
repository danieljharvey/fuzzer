interface Stuff {
  name: string;
  age: number;
  things: number[];
}

interface Dog {
  name: string;
  poo: boolean;
}

export const showDog = (dog: Dog): Dog => dog;
