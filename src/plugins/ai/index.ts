import { PropertyType, RNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import { differenceBy } from 'lodash-es';
import {
  AI_ACTION_POWERUP_CODE,
  AI_ACTION_POWERUP_NAME,
  AI_ENABLED_POWERUP_CODE,
  AI_ENABLED_POWERUP_NAME,
  AI_PROMPT_POWERUP_CODE,
  AI_PROMPT_POWERUP_NAME,
  aiSlots,
} from './constants';
import { buildinPrompts } from './prompts';
import { getPromptRows } from './utils';

export * from './constants';
export * from './prompts';
export * from './utils';

export const initAiPlugin = async ({ plugin }: { plugin: RNPlugin }) => {
  await plugin.app.registerCommand({
    id: 'ai on',
    name: 'ai on',
    action: async () => {
      const rem = await plugin.focus.getFocusedRem();
      await rem?.addPowerup(AI_ENABLED_POWERUP_CODE);
    },
  });

  if (process.env.NODE_ENV === 'development') {
    await plugin.app.registerCommand({
      id: 'debug focused rem',
      name: 'Debug focused rem',
      action: async () => {
        const focusedRem = await plugin.focus.getFocusedRem();
        const tags = await focusedRem?.getTagRems();

        const enabledRem = await plugin.powerup.getPowerupSlotByCode(
          AI_PROMPT_POWERUP_CODE,
          'enabled'
        );

        console.log('debug rem', {
          focusedRem,
          tags,
          children: await focusedRem?.getChildrenRem(),
          enabledRem,
          xxx: await enabledRem?.getChildrenRem(),
        });
      },
    });
  }

  await plugin.app.registerCommand({
    id: 'install buildin prompts',
    name: 'install buildin prompts',
    action: async () => {
      const tableRem = (await plugin.powerup.getPowerupByCode(AI_PROMPT_POWERUP_CODE))!;
      const rows = await getPromptRows(plugin);
      const diff = differenceBy(buildinPrompts, rows, 'name');
      console.log({ rows, diff });
      diff.forEach(async (a, i) => {
        const rem = await plugin.rem.createRem();
        rem?.setText([a.name]);
        rem?.setPowerupProperty(AI_PROMPT_POWERUP_CODE, 'prompt', [a.prompt]);
        rem?.setPowerupProperty(AI_PROMPT_POWERUP_CODE, 'zhName', [a.zhName]);
        // rem?.setPowerupProperty(AI_PROMPT_POWERUP_CODE, 'scene', [a.scene]);
        rem?.setPowerupProperty(AI_PROMPT_POWERUP_CODE, 'enabled', ['Yes']);
        rem?.setPowerupProperty(AI_PROMPT_POWERUP_CODE, 'order', [String(rows.length + i)]);
        rem?.addTag(tableRem._id);
      });
    },
  });

  await plugin.app.registerCommand({
    id: 'view prompts',
    name: 'view prompts',
    action: async () => {
      const rem = await plugin.powerup.getPowerupByCode(AI_PROMPT_POWERUP_CODE);
      rem && (await plugin.window.openRem(rem));
    },
  });
  /*  await plugin.app.registerCommand({
    id: 'view prompts in pane',
    name: 'view prompts in pane',
    action: async () => {
      const rem = await plugin.powerup.getPowerupByCode(AI_PROMPT_POWERUP_CODE);
      const currentRemTree = await plugin.window.getCurrentWindowTree();
      const openPaneIds = await plugin.window.getOpenPaneIds();
      console.log({ currentRemTree, openPaneIds });

      plugin.window.setRemWindowTree({
        direction: 'row',
        ...currentRemTree,
        first: currentRemTree,
        second: {
          remId: rem?._id,
        },
        splitPercentage: 50,
      });
      // rem && (await plugin.window.getCurrentWindowTree());
    },
  }); */
  await plugin.app.registerCommand({
    id: 'tag prompt',
    name: 'tag prompt',
    action: async () => {
      const focusRem = await plugin.focus.getFocusedRem();
      focusRem?.addPowerup(AI_PROMPT_POWERUP_CODE);
      const enabledSlot = await plugin.powerup.getPowerupSlotByCode(
        AI_PROMPT_POWERUP_CODE,
        'enabled'
      );
      enabledSlot && focusRem?.setTagPropertyValue(enabledSlot._id, ['Yes']);
    },
  });
  await plugin.app.registerCommand({
    id: 'ai off',
    name: 'ai off',
    action: async () => {
      const focusRem = await plugin.focus.getFocusedRem();
      focusRem?.removePowerup(AI_ENABLED_POWERUP_CODE);
      const children = await focusRem?.getChildrenRem();
      const aiActionRem = await plugin.powerup.getPowerupByCode(AI_ACTION_POWERUP_CODE);
      children?.forEach(async (a) => {
        const tags = await a.getTagRems();
        if (tags.some((a) => a._id === aiActionRem?._id)) a.remove();
      });
    },
  });

  await plugin.app.registerCommand({
    id: 'xxxxx',
    name: 'xxxxx',
    action: async () => {
      const promptSLot = await plugin.powerup.getPowerupSlotByCode(
        AI_PROMPT_POWERUP_CODE,
        'prompt'
      );
      const tableRem = await plugin.powerup.getPowerupByCode(AI_PROMPT_POWERUP_CODE);
      const rows = await tableRem?.taggedRem();
      // const x= await getAiStatusRem
      await rows?.[2].setPowerupProperty(AI_PROMPT_POWERUP_CODE, 'scene', ['rem,selection']);
      console.log(213123213, {
        rows,
        promptSLot,
        text: await plugin.richText.toString(rows?.[2]?.text!),
        scene: await rows?.[2].getPowerupProperty(AI_PROMPT_POWERUP_CODE, 'scene'),
        children: await rows?.[2].getChildrenRem(),
      });
    },
  });

  await plugin.app.registerPowerup({
    name: AI_ENABLED_POWERUP_NAME,
    code: AI_ENABLED_POWERUP_CODE,
    description: 'Mark a rem to indicate its being processed by AI',
    options: {
      slots: [
        { code: aiSlots.prompt, name: aiSlots.prompt, hidden: true },
        { code: aiSlots.data, name: aiSlots.data, hidden: true },
        {
          code: aiSlots.status,
          name: aiSlots.status,
          hidden: true,
          propertyType: PropertyType.MULTI_SELECT,
          enumValues: { option: 'option', editingSelection: 'editingSelection', like: 'like' },
        },
        // {
        //   code: SLOT_IDs.height,
        //   name: SLOT_IDs.height,
        //   hidden: false,
        //   onlyProgrammaticModifying: false,
        // },
      ],
    },
  });
  await plugin.app.registerPowerup({
    name: AI_ACTION_POWERUP_NAME,
    code: AI_ACTION_POWERUP_CODE,
    description: 'The result after one AI processing',
    options: {
      slots: [],
    },
  });
  await plugin.app.registerPowerup({
    name: AI_PROMPT_POWERUP_NAME,
    code: AI_PROMPT_POWERUP_CODE,
    description: 'storing built-in prompts',
    options: {
      slots: [
        { code: 'zhName', name: 'zhName' },
        { code: 'prompt', name: 'prompt' },
        { code: 'enabled', name: 'enabled', propertyType: PropertyType.CHECKBOX },
        {
          code: 'scene',
          name: 'scene',
          propertyType: PropertyType.MULTI_SELECT,
          enumValues: { selection: 'selection', rem: 'rem' },
        },
        { code: 'order', name: 'order', propertyType: PropertyType.NUMBER },
      ],
    },
  });

  await plugin.app.registerWidget('aiActive_widget', WidgetLocation.UnderRemEditor, {
    dimensions: { height: 'auto', width: '100%' },
    powerupFilter: AI_ENABLED_POWERUP_CODE,
  });

  await plugin.app.registerWidget('aiAction_widget', WidgetLocation.RightSideOfEditor, {
    dimensions: { height: `auto`, width: 'auto' },
    powerupFilter: AI_ACTION_POWERUP_CODE,
  });
};
