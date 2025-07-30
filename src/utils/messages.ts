import type { TSESTree } from "@typescript-eslint/types";
/**
 * Get the id list text in the message for the given expressions.
 */
export function getIdTextList(nodes: TSESTree.Expression[]): string[] {
  const list = nodes.map((node) => getIdText(node, null));

  const used = new Set<string>(list.filter((id): id is string => id !== null));
  let seq = 33;
  return list.map((id) => {
    if (id) {
      return id;
    }
    let candidate = (seq++).toString(36);
    while (used.has(candidate) || /\d/u.test(candidate)) {
      candidate = (seq++).toString(36);
    }
    used.add(candidate);
    return candidate;
  });
}
/**
 * Get the id text in the message for the given expressions.
 */
export function getIdText<D extends string | null>(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  defaultId: D,
): string | D {
  return node.type === "Identifier" ? node.name : defaultId;
}
