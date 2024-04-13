import { expect, test, describe } from 'vitest';
import { completePrompt, prompt_optText } from './prompts';

test('completePrompt', () => {
  expect(completePrompt(prompt_optText, { text: '123' })).toMatchInlineSnapshot(
    `"请精简以下文本，保持原意并提高语言的精确性和清晰度。在优化时保持原文的人称视角。不需要输出任何额外内容："""123""""`
  );
});
