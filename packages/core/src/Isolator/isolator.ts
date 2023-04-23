export class zzIsolatorStack<T> {
  protected isolated: T[][] = [];

  runIsolated(fn: () => void): T[] {
    this.isolated.push([]);

    fn();

    return this.isolated.pop()!;
  }

  add(...items: T[]) {
    if (this.isolated.length === 0) return;

    this.isolated.at(-1)!.push(...items);
  }
}
