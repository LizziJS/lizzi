export function hasGetter(obj: any, prop: string): boolean {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (descriptor) {
    return Boolean(descriptor.get);
  }
  const proto = Object.getPrototypeOf(obj);
  return proto ? hasGetter(proto, prop) : false;
}
