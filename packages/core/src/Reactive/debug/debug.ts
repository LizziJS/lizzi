export enum zzLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

let debugLoggingLevel = zzLoggingLevel.INFO;

export function setDebugLoggingLevel(level: zzLoggingLevel) {
  debugLoggingLevel = level;
}

class zzReactiveDebug {
  constructor(public level: number, public type: string) {}

  setLevel(level: number) {
    this.level = level;
  }

  log(message: string, level?: number) {
    level = level ?? this.level;

    if (level >= debugLoggingLevel) {
      console.log("[" + this.type + "]", message);
    }
  }

  trace(message?: string, level?: number) {
    const dlevel = level ?? this.level;

    return (value: any, last: any, target: any) => {
      if (dlevel >= debugLoggingLevel) {
        if (value === last) {
          console.log(
            "[" + this.type + "] =>",
            value,
            "(" + (message ?? target.constructor.name) + ")"
          );
        } else {
          console.log(
            "[" + this.type + "]",
            last,
            "=>",
            value,
            "(" + (message ?? target.constructor.name) + ")"
          );
        }
      }
    };
  }
}

export const zzDebug = (level: number, type: string) => {
  return new zzReactiveDebug(level, type);
};
