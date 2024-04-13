export async function findAsync<T>(
  array: T[],
  predicate: (element: T, index: number, array: T[]) => Promise<boolean>
): Promise<T | undefined> {
  for (let index = 0; index < array.length; index++) {
    if (await predicate(array[index], index, array)) {
      return array[index];
    }
  }
  return undefined;
}
