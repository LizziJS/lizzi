import { zzDebug, zzLoggingLevel, setDebugLoggingLevel } from "@lizzi/core";

export const TodoDebug = zzDebug(zzLoggingLevel.DEBUG, "Todo");
export const SearchDebug = zzDebug(zzLoggingLevel.DEBUG, "Search");

setDebugLoggingLevel(zzLoggingLevel.DEBUG);
