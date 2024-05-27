export type ExtractFunctionKeys<O> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
  [K in keyof O]: O[K] extends (...args: any[]) => any ? K : never;
}[keyof O];
