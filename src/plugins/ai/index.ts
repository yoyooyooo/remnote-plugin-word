import { RNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import {
  AI_ENABLED_POWERUP_CODE,
  AI_ENABLED_POWERUP_NAME,
  AI_ACTION_POWERUP_CODE,
  AI_ACTION_POWERUP_NAME,
  aiSlots,
} from './constants';

export * from './constants';
export * from './utils';
export * from './prompts';

export const initAiPlugin = async ({ plugin }: { plugin: RNPlugin }) => {
  await plugin.app.registerCommand({
    id: AI_ENABLED_POWERUP_CODE,
    name: 'enable AI',
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
        const rem = await plugin.focus.getFocusedRem();
        const tags = await rem?.getTagRems();
        console.log('focused rem', rem);
        console.log(
          'focused rem tags',
          tags,
          await Promise.all(tags?.map(async (a) => await a.isPowerupEnum()) || [])
        );
      },
    });
  }

  await plugin.app.registerCommand({
    id: 'xxxxx',
    name: 'xxxxx',
    action: async () => {
      const rem = await plugin.focus.getFocusedRem();
      console.log(1111111111111111, rem);

      const replacedRem = await plugin.richText.replaceAllRichText(
        rem?.text!,
        [{ i: 'q', _id: 'QCsu2csucbVeqz3NP' }],
        ['xxxxxxxxxxxxxxx']
      );

      // plugin.rem.hdxc r5

      console.log(222222222222, replacedRem);
    },
  });

  await plugin.app.registerPowerup({
    name: AI_ENABLED_POWERUP_NAME,
    code: AI_ENABLED_POWERUP_CODE,
    description: 'Mark a REM to indicate its being processed by AI',
    options: {
      slots: [
        { code: aiSlots.prompt, name: aiSlots.prompt, hidden: true },
        { code: aiSlots.data, name: aiSlots.data, hidden: true },
        {
          code: aiSlots.status,
          name: aiSlots.status,
          hidden: true,
          enumValues: { option: 'option', editingSelection: 'editingSelection' },
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

  await plugin.app.registerWidget('aiActive_widget', WidgetLocation.UnderRemEditor, {
    dimensions: { height: 'auto', width: '100%' },
    powerupFilter: AI_ENABLED_POWERUP_CODE,
  });

  await plugin.app.registerWidget('aiAction_widget', WidgetLocation.RightSideOfEditor, {
    dimensions: { height: `auto`, width: 'auto' },
    powerupFilter: AI_ACTION_POWERUP_CODE,
  });
};
