import { extractCode } from '../utils/format';

const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(undefined);
    }, ms)
  );

export async function queryAi({
  prompt,
  model,
  autoExtractCode,
  debug = true,
}: {
  prompt: string;
  model?: string;
  autoExtractCode?: boolean;
  debug?: boolean;
}): Promise<[any, string]> {
  console.log(`[queryAi]prompt: `, prompt);
  if (debug) {
    await delay(1000);
    return [null, 'debug content'];
  }
  try {
    const response = await fetch('https://www.gptapi.us/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer sk-Z1CB6EbbpMLMuK0O9a237e5b8e9945D8A77fDcEa8bC3199e`,
      },
      body: JSON.stringify({
        model: model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: [
              prompt,
              '请生成一个简洁明了的文本，内容直接相关于用户的具体请求，不包含任何额外的说明或格式化文本。确保输出结果仅包括所需的最终文本内容',
            ].join('\n'),
          },
        ],
        // max_tokens: 150,
        // temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message.content;
    console.log('ai response: ', result);
    return [null, autoExtractCode ? extractCode(result) : result];
  } catch (error) {
    return ['error', ''];
  }
}
