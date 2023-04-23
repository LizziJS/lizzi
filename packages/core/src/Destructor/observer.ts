import { zzIsolatorStack } from "../Isolator";
import { IDestructor, DestructorsStack } from "./destructor";

class DestructorsIsolator extends zzIsolatorStack<IDestructor> {
  catch(fn: () => void): DestructorsStack {
    return new DestructorsStack(...super.runIsolated(fn));
  }
}

export const zzDestructorsObserver = new DestructorsIsolator();
