import { usePlugin } from '@remnote/plugin-sdk';
import { queryAi } from '../../utils/openai';
import { digestLongText } from '../../utils/prompts';
import { generateMdToChildRems } from '../../utils/rem';
import { SubmitButton } from '../SubmitButton';

export const DigestLongText = () => {
  const plugin = usePlugin();
  return (
    <SubmitButton
      onSubmit={async () => {
        const text = await plugin.editor.getSelectedText();
        if (!text?.richText) return;
        const focusRem = await plugin.focus.getFocusedRem();
        if (!focusRem) return;
        const [err, res] = await queryAi({
          prompt: digestLongText(await plugin.richText.toString(text.richText)),
          autoExtractCode: true,
        });
        await generateMdToChildRems({
          plugin,
          topRem: focusRem,
          md: (!err && res) || '',
        });
      }}
    >
      消化长文本
    </SubmitButton>
  );
};
