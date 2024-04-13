import { renderWidget, usePlugin, RNPlugin, Rem, RichTextInterface } from '@remnote/plugin-sdk';
import { AI_ENABLED_POWERUP_CODE, aiSlots, AI_ACTION_POWERUP_CODE } from './constants';
import { completePrompt } from './prompts';
import { queryAi } from '../../utils/openai';

export const getAiStatusRem = async ({
  plugin,
  status,
}: {
  plugin: RNPlugin;
  status: 'option' | 'editingSelection';
}) => {
  const statusRem = await plugin.powerup.getPowerupSlotByCode(
    AI_ENABLED_POWERUP_CODE,
    aiSlots.status
  );

  return (await statusRem?.getChildrenRem())?.find((a) => a.text?.[0] === status);
};

/** 开始使用ai处理指定rem */
export const tagEnableAI = async ({
  rem,
  prompt,
}: {
  //   plugin: RNPlugin;
  rem?: Rem;
  prompt?: RichTextInterface;
}) => {
  if (!rem) return;
  await rem.addPowerup(AI_ENABLED_POWERUP_CODE);
  prompt && (await rem?.setPowerupProperty(AI_ENABLED_POWERUP_CODE, aiSlots.prompt, prompt));
};

/** 把选中的文本添加到子级，原文替换为添加到自己的rem的块引用 */
export const replaceSelection = async ({ rem, plugin }: { plugin: RNPlugin; rem?: Rem }) => {
  if (!rem) {
    rem = await plugin.focus.getFocusedRem();
  }
  const textSelection = await plugin.editor.getSelectedText();
  if (textSelection) {
    const newRem = await plugin.rem.createRem();
    newRem?.setText(textSelection?.richText);
    await newRem?.setParent(rem!, -1);
    const replacedRem = await plugin.richText.replaceAllRichText(
      rem?.text!,
      textSelection.richText,
      [{ i: 'q', _id: newRem?._id! }]
    );
    rem?.setText(replacedRem);
    return { newRem };
  }
  return {};
};

/** 标记为 ai rem，并且执行一次 prompt */
export const enableAI = async ({
  prompt,
  rem,
  plugin,
  text,
}: {
  plugin: RNPlugin;
  rem?: Rem;
  prompt: string;
  text: string;
}) => {
  if (!rem) return;
  rem.expand(rem._id, false); // TODO: 好像没效果

  tagEnableAI({
    rem,
    prompt: [prompt],
  });
  const [err, res] = await queryAi({
    prompt: completePrompt(prompt, { text }),
  });
  if (err) {
    plugin.app.toast('query ai error');
    return;
  }
  const newRem = await plugin.rem.createRem();
  newRem?.addPowerup(AI_ACTION_POWERUP_CODE);
  const editingRem = await getAiStatusRem({ plugin, status: 'option' });
  editingRem && newRem?.addTag(editingRem);
  newRem?.setText([res]);
  newRem?.setParent(rem, -1);
};
