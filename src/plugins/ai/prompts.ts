export const completePrompt = (prompt: string, { text }: { text: string }) => {
  return prompt.replace(/{text}/, text);
};

export const prompt_optText = `请精简以下文本，保持原意并提高语言的精确性和清晰度。在优化时保持原文的人称视角。不需要输出任何额外内容："""{text}"""`;

export enum PROMPT {
  '优化文本' = prompt_optText,
}
