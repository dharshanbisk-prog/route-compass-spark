let counter = 0;
export function v4(): string {
  return `id-${Date.now()}-${++counter}`;
}
