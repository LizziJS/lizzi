export class zzEventLocker {
  private locked = new Set<Symbol>();

  new() {
    const locker = Symbol();

    return <TFunc extends (...args: any[]) => void>(fn: TFunc) => {
      return this.locker(locker, fn);
    };
  }

  locker<TFunc extends (...args: any[]) => void>(
    lock: Symbol | Symbol[],
    fn: TFunc
  ): TFunc {
    return ((...args: any[]) => {
      if (this.isLocked(lock)) return;

      this.lock(lock);
      fn(...args);
      this.unlock(lock);
    }) as TFunc;
  }

  isLocked(lock: Symbol | Symbol[]) {
    const lockSymbols = Array.isArray(lock) ? lock : [lock];

    return lockSymbols.every((lock) => this.locked.has(lock));
  }

  lock(lock: Symbol | Symbol[]) {
    const lockSymbols = Array.isArray(lock) ? lock : [lock];

    for (const lock of lockSymbols) {
      this.locked.add(lock);
    }

    return this;
  }

  unlock(lock: Symbol | Symbol[]) {
    const lockSymbols = Array.isArray(lock) ? lock : [lock];

    for (const lock of lockSymbols) {
      this.locked.delete(lock);
    }

    return this;
  }
}

export const Locker = new zzEventLocker();
