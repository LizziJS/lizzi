import { zzIsolatorStack } from "../Isolator";
import { IDestructor, DestructorsStack } from "./destructor";

class DestructorsIsolator extends zzIsolatorStack<IDestructor> {
  catch(fn: () => void): DestructorsStack {
    return new DestructorsStack().addArray(this.runIsolated(fn));
  }
}

export const zzDestructorsObserver = new DestructorsIsolator();
