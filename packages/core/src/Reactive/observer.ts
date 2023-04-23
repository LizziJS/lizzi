import { DestructorsStack } from "../Destructor";
import { zzIsolatorStack } from "../Isolator";
import { zzReactive } from "./reactive";

class GetReactiveIsolator extends zzIsolatorStack<zzReactive<any>> {
  catch(isolatedFn: () => void, onUpdateFn: () => void): DestructorsStack {
    return new DestructorsStack(
      ...super
        .runIsolated(isolatedFn)
        .map((r) => r.onChange.addListener(onUpdateFn))
    );
  }
}

export const zzGetReactiveObserver = new GetReactiveIsolator();
