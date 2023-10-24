const MIN_SPLIT_ARRAY_SIZE = 10000;
export const safeInsertToArray = <T>(
  array: T[],
  index: number,
  elements: T[]
) => {
  if (elements.length <= MIN_SPLIT_ARRAY_SIZE) {
    array.splice(index, 0, ...elements);
    return;
  }

  for (let i = 0; i < elements.length; i += MIN_SPLIT_ARRAY_SIZE) {
    array.splice(index + i, 0, ...elements.slice(i, i + MIN_SPLIT_ARRAY_SIZE));
  }
};
