export function computeChanges(oldObj: any, newObj: any, allowedFields: string[]) {
  const changes: { [k: string]: { before: any; after: any } } = {};
  for (const f of allowedFields) {
    const before = oldObj ? (oldObj as any)[f] : undefined;
    const after = newObj ? (newObj as any)[f] : undefined;

    const bothUndefined = before === undefined && after === undefined;
    if (bothUndefined) continue;

    const isDifferent = JSON.stringify(before) !== JSON.stringify(after);
    if (isDifferent) {
      changes[f] = { before, after };
    }
  }
  return changes;
}
