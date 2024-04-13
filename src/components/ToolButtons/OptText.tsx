import { usePlugin } from '@remnote/plugin-sdk';
import {
  enableAI,
  prompt_optText,
  replaceSelection,
  AI_ACTION_POWERUP_CODE,
  AI_ENABLED_POWERUP_CODE,
  getAiStatusRem,
  tagEnableAI,
} from '../../plugins/ai';
import { SubmitButton } from '../SubmitButton';

export const OptText = () => {
  const plugin = usePlugin();
  return (
    <>
      <SubmitButton
        onSubmit={async () => {
          const focusRem = await plugin.focus.getFocusedRem();
          if (!focusRem?.text) return;
          await enableAI({
            plugin,
            rem: focusRem,
            prompt: prompt_optText,
            text: await plugin.richText.toString(focusRem.text),
          });
        }}
      >
        优化文本
      </SubmitButton>
      <SubmitButton
        onSubmit={async () => {
          const text = await plugin.editor.getSelectedText();
          if (!text?.richText) return;
          const { newRem } = await replaceSelection({
            plugin,
            rem: await plugin.focus.getFocusedRem(),
          });
          newRem?.addPowerup(AI_ENABLED_POWERUP_CODE);

          const optionRem = await getAiStatusRem({ plugin, status: 'option' });
          const editingSelectionRem = await getAiStatusRem({ plugin, status: 'editingSelection' });
          optionRem && newRem?.addTag(optionRem);
          editingSelectionRem && newRem?.addTag(editingSelectionRem);
          newRem?.addPowerup(AI_ACTION_POWERUP_CODE);

          await enableAI({
            plugin,
            rem: newRem,
            prompt: prompt_optText,
            text: await plugin.richText.toString(text.richText),
          });
        }}
      >
        优化文本(当前选择文本)
      </SubmitButton>
    </>
  );
};
