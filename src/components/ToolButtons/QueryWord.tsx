import { usePlugin } from '@remnote/plugin-sdk';
import { queryAi } from '../../utils/openai';
import { generateMdToChildRems } from '../../utils/rem';
import { SubmitButton } from '../SubmitButton';
import { from, mergeMap } from 'rxjs';

export const QueryWord = () => {
  const plugin = usePlugin();
  return (
    <>
      <SubmitButton
        onSubmit={async () => {
          const text = await plugin.editor.getSelectedText();
          if (!text?.richText) return;
          const focusRem = await plugin.focus.getFocusedRem();
          const [err, res] = await queryAi({
            autoExtractCode: true,
            model: 'gpt-4',
            prompt: `创建一张学习卡片帮助用户在RemNote等学习软件中记忆新单词。当用户查询一个英文单词时，按照以下格式提供信息：
\`\`\`
- 发音：[请提供美式发音的音标]
- 释义：[列举此单词所有含义。对于每个含义，请提供英文定义及相应的中文翻译，并明确标注词性。格式为：词性 中文解释 (英文解释)]
- 同义词：[列出1到5个与查询单词意思相近的同义词，并详细说明它们之间的细微差异和各自的侧重含义。单词本身也单独拎出来加入对比并说明其侧重含义。每个同义词的格式为：单词: 中文说明]
- 例句：[针对该单词最常用的两个词性和释义，分别提供一个英文例句，并附上中文翻译。对例句中的单词和中文翻译中的对应翻译进行加粗]
- 常用词组：[提供1到5个除了例句提及的词组之外，与该单词相关的常用词组，并给出简短的中文解释。如果没有，则不显示整行]
- 词根词源：[简述单词的词源信息，包括它是如何发展变化来的，以帮助加深记忆。如果没有，则不显示整行]
- 派生词：[列出此单词的重要派生词，仅包括它们的词性和简要中文注释，以帮助用户理解单词的不同用法。如果没有，则不显示整行]
\`\`\`
词性英文缩写说明：
- n.：名词
- adj.：形容词
- adv.：副词
- v.：动词（未特别说明时，涵盖及物和不及物动词）
  - vt.：及物动词
  - vi.：不及物动词
- prep.：介词
- conj.：连词
- interj.：感叹词
补充说明：请把上述信息以代码块的形式输出。不要有额外的说明，整体用中文回答。
下面是我给你的第一个单词：${await plugin.richText.toString(text.richText)}`,
          });
          await generateMdToChildRems({
            plugin,
            topRem: focusRem!,
            md: (!err && res) || '',
          });

          const children = await focusRem?.getChildrenRem();
          children?.forEach(async (a) => {
            await a.setIsCardItem(true);
          });
        }}
      >
        查询单词
      </SubmitButton>
      <SubmitButton
        onSubmit={async () => {
          const focusRem = await plugin.focus.getFocusedRem();
          const children = (await focusRem?.getChildrenRem()) || [];

          from(children)
            .pipe(
              mergeMap(async (child) => {
                const text = await plugin.richText.toString(child.text!);
                if (!text) return;
                if ((await child.getChildrenRem()).length > 0) return;

                const [err, res] = await queryAi({
                  autoExtractCode: true,
                  model: 'gpt-4',
                  prompt: `创建一张学习卡片帮助用户在RemNote等学习软件中记忆新单词。当用户查询一个英文单词时，按照以下格式提供信息：
  \`\`\`
  - 发音：[请提供美式发音的音标]
  - 释义：[列举此单词所有含义。对于每个含义，请提供英文定义及相应的中文翻译，并明确标注词性。格式为：词性 中文解释 (英文解释)]
  - 同义词：[列出1到5个与查询单词意思相近的同义词，并详细说明它们之间的细微差异和各自的侧重含义。单词本身也单独拎出来加入对比并说明其侧重含义。每个同义词的格式为：单词: 中文说明]
  - 例句：[针对该单词最常用的两个词性和释义，分别提供一个英文例句，并附上中文翻译。对例句中的单词和中文翻译中的对应翻译进行加粗]
  - 常用词组：[提供1到5个除了例句提及的词组之外，与该单词相关的常用词组，并给出简短的中文解释。如果没有，则不显示整行]
  - 词根词源：[简述单词的词源信息，包括它是如何发展变化来的，以帮助加深记忆。如果没有，则不显示整行]
  - 派生词：[列出此单词的重要派生词，仅包括它们的词性和简要中文注释，以帮助用户理解单词的不同用法。如果没有，则不显示整行]
  \`\`\`
  词性英文缩写说明：
  - n.：名词
  - adj.：形容词
  - adv.：副词
  - v.：动词（未特别说明时，涵盖及物和不及物动词）
    - vt.：及物动词
    - vi.：不及物动词
  - prep.：介词
  - conj.：连词
  - interj.：感叹词
  补充说明：请把上述信息以代码块的形式输出。不要有额外的说明，整体用中文回答。
  下面是我给你的第一个单词：${text}`,
                });
                await generateMdToChildRems({
                  plugin,
                  topRem: child!,
                  md: (!err && res) || '',
                });
                child.collapse(child!);
                (await child.getChildrenRem())?.forEach(async (a) => {
                  await a.setIsCardItem(true);
                });
              }, 5)
            )
            .subscribe();
        }}
      >
        批量查询单词
      </SubmitButton>
    </>
  );
};
