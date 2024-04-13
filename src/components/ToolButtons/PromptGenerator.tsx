import { usePlugin } from '@remnote/plugin-sdk';
import { queryAi } from '../../utils/openai';
import { generateMdToChildRems } from '../../utils/rem';
import { SubmitButton } from '../SubmitButton';

export const PromptGenerator = () => {
  const plugin = usePlugin();
  return (
    <SubmitButton
      onSubmit={async () => {
        const text = await plugin.editor.getSelectedText();
        if (!text?.richText) return;
        const [err, res] = await queryAi({
          prompt: `将以下文本转化为一个适合GPT使用的prompt，确保它能指导GPT清晰地完成一个具体的任务："""${await plugin.richText.toString(
            text.richText
          )}"""`,
        });
        console.log(res);

        if (!err) {
          await plugin.editor.delete();
          await plugin.editor.insertMarkdown(res);
        }

        // !err && (await focusRem?.setText(await plugin.richText.parseFromMarkdown(res || '')));

        // await generateMdToChildRems({
        //   plugin,
        //   topRem: focusRem,
        //   md: (!err && res) || '',
        // });
      }}
    >
      转化为 prompt
    </SubmitButton>
  );
};
