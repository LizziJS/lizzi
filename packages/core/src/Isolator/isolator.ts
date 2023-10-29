export class zzIsolatorStack<T> {
  protected isolated: (T[] | null)[] = [null];

  isolateAndGet(fn: () => void): T[] {
    this.isolated.push([]);

    fn();

    return this.isolated.pop()!;
  }

  isolate(fn: () => void) {
    this.isolated.push(null);

    fn();

    this.isolated.pop()!;
  }

  add(...items: T[]) {
    if (this.isolated.at(-1) === null) return;

    this.isolated.at(-1)!.push(...items);
  }
}
