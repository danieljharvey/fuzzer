export const match = (tsFuncs: any[]) => (jsFunc: any) => {
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
