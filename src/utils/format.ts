export const extractCode = (code: string) => {
  return code.match(/\`\`\`.*?\n([\s\S]*?)\`\`\`/)?.[1] || code;
};
