import {
  renderWidget,
  usePlugin,
  RNPlugin,
  Rem,
  RichTextInterface,
  filterAsync,
} from '@remnote/plugin-sdk';
import { differenceBy, orderBy, sortBy } from 'lodash-es';
import {
  AI_ENABLED_POWERUP_CODE,
  aiSlots,
  AI_ACTION_POWERUP_CODE,
  AI_PROMPT_POWERUP_CODE,
  aiPromptSlots,
} from './constants';
import { completePrompt } from './prompts';
import { queryAi } from '../../utils/openai';

export const getAiStatusRem = async ({
  plugin,
  status,
}: {
  plugin: RNPlugin;
  status: 'option' | 'editingSelection' | 'like';
}) => {
  const statusRem = await plugin.powerup.getPowerupSlotByCode(
    AI_ENABLED_POWERUP_CODE,
    aiSlots.status
  );

  return (await statusRem?.getChildrenRem())?.find((a) => a.text?.[0] === status);
};

export const getAiPromptSceneRem = async ({
  plugin,
  scene,
}: {
  plugin: RNPlugin;
  scene: 'selection' | 'rem' | 'selectedRem';
}) => {
  const statusRem = await plugin.powerup.getPowerupSlotByCode(
    AI_PROMPT_POWERUP_CODE,
    aiPromptSlots.scene
  );

  return (await statusRem?.getChildrenRem())?.find((a) => a.text?.[0] === scene);
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
  params: params0,
  transformResponseText = (x) => x,
}: {
  plugin: RNPlugin;
  rem?: Rem;
  prompt: string;
  text?: string;
  params?: string | Record<string, any>;
  transformResponseText?: (
    text: RichTextInterface
  ) => RichTextInterface | Promise<RichTextInterface>;
}) => {
  if (!rem || !text) return;

  tagEnableAI({
    rem,
    prompt: [prompt],
  });
  const params = params0 || (await rem.getPowerupProperty(AI_ENABLED_POWERUP_CODE, aiSlots.params));
  const [err, res] = await queryAi({
    prompt: completePrompt(prompt, { text }),
    params: params && (typeof params === 'string' ? JSON.parse(params) : params),
  });
  if (err) {
    plugin.app.toast('query ai error');
    return;
  }
  const newRem = await plugin.rem.createRem();
  newRem?.addPowerup(AI_ACTION_POWERUP_CODE);
  const optionRem = await getAiStatusRem({ plugin, status: 'option' });
  optionRem && newRem?.addTag(optionRem);
  newRem?.setText(await transformResponseText(await plugin.richText.parseFromMarkdown(res)));
  // newRem?.setText([res]);
  await newRem?.setParent(rem, -1);
  rem.expand(rem._id, false);
};

export const getPromptRows = async (plugin: RNPlugin) => {
  const tableRem = await plugin.powerup.getPowerupByCode(AI_PROMPT_POWERUP_CODE);
  const rows = (await tableRem?.taggedRem()) || [];
  const res = await Promise.all(
    rows.map(async (a) => ({
      name: await plugin.richText.toString(a.text ?? []),
      scene: await a.getPowerupProperty(AI_PROMPT_POWERUP_CODE, 'scene'),
      prompt: await a.getPowerupProperty(AI_PROMPT_POWERUP_CODE, 'prompt'),
      enabled: await a.getPowerupProperty(AI_PROMPT_POWERUP_CODE, 'enabled'),
      order: +(await a.getPowerupProperty(AI_PROMPT_POWERUP_CODE, 'order')) || 0,
    }))
  );
  return orderBy(res, 'order');
};

export const getEnabledPromptRows = async (plugin: RNPlugin) => {
  const rows = await getPromptRows(plugin);
  return rows.filter((a) => a.enabled === 'Yes');
};
