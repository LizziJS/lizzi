import { zzIsolatorStack } from "../Isolator";
import {
  IDestructor,
  DestructorsStack,
  SilentDestructorsStack,
} from "./destructor";

class DestructorsIsolator extends zzIsolatorStack<IDestructor> {
  catch(fn: () => void): DestructorsStack {
    return new SilentDestructorsStack(true).addArray(this.isolateAndGet(fn));
  }
}

export const zzDestructorsObserver = new DestructorsIsolator();
