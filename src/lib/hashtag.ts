export function extractHashtags(text: string): string[] {
  const tags = new Set<string>();
  const re = /#(\w+)/g; let m;
  while ((m = re.exec(text))) tags.add(m[1].toLowerCase());
  return Array.from(tags);
}
