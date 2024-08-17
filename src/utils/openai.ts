import { extractCode } from '../utils/format';

const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(undefined);
    }, ms)
  );

export const toneMap = {
  professional: {
    temperature: 0.4,
    top_p: 0.5,
    frequency_penalty: 0.3,
    presence_penalty: 0.0,
  },
  casual: {
    temperature: 0.9,
    top_p: 0.9,
    frequency_penalty: 0.1,
    presence_penalty: 0.0,
  },
  friendly: {
    temperature: 0.7,
    top_p: 0.8,
    frequency_penalty: 0.1,
    presence_penalty: 0.0,
  },
  confident: {
    temperature: 0.6,
    top_p: 0.7,
    frequency_penalty: 0.4,
    presence_penalty: 0.0,
  },
  direct: {
    temperature: 0.5,
    top_p: 0.6,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  },
};

export async function queryAi({
  prompt,
  params,
  model,
  autoExtractCode,
  debug = false,
}: {
  params?: Record<string, any>;
  prompt: string;
  model?: string;
  autoExtractCode?: boolean;
  debug?: boolean;
}): Promise<[any, string]> {
  console.log(`debug[queryAi] prompt: `, prompt);
  console.log(`debug[queryAi] params: `, params);
  console.log(`debug[queryAi] autoExtractCode: `, autoExtractCode);
  if (debug) {
    await delay(1000);
    return [null, 'debug content' + Date.now()];
  }
  try {
    const response = await fetch('https://www.gptapi.us/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ``,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              prompt,
              // '请生成一个简洁明了的文本，内容直接相关于用户的具体请求，不包含任何额外的说明或格式化文本。确保输出结果仅包括所需的最终文本内容',
              '不添加任何额外说明，不要输出在代码块中',
            ].join('\n'),
          },
        ],
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
