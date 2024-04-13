import { RNPlugin, Rem } from '@remnote/plugin-sdk';
import { findRem } from '../utils/rem';

export const extractInterviewProcess = async ({ plugin }: { plugin: RNPlugin }) => {
  await plugin.app.registerCommand({
    id: 'extractInterviewProcess',
    name: 'extract interview process',
    action: async () => {
      const focusRem = await plugin.focus.getFocusedRem();

      if (focusRem) {
        const rem = await findRem(focusRem, async (rem) => {
          if (rem.text) {
            const text = await plugin.richText.toString(rem.text);
            if (text === '面试题') {
              return true;
            }
          }
        });

        if (rem) {
          let stack = await rem.getChildrenRem();
          let res = [] as Rem[];
          const todoRem = await plugin.powerup.getPowerupByCode('t');
          while (stack.length) {
            const r = stack.pop()!;
            if (await r.isTodo()) {
              const todoStatus = await r.getTodoStatus();
              if (todoStatus === 'Finished') {
                r.setText([...r.text!, ' 👌🏼']);
              }
              if (todoStatus === 'Unfinished') {
                r.setText([...r.text!, ' 💩']);
              }
              r.removeTag(todoRem!._id!);
              res.push(r);
            } else {
              const children = await r.getChildrenRem();
              if (children.length) {
                stack.push(...children);
              }
            }
          }
          const newRem = await plugin.rem.createRem();
          await newRem?.setParent(focusRem);
          newRem?.setText(['面试题记录']);
          await plugin.rem.moveRems(res, newRem!, 999);
          // rem.remove();
        }
      }
    },
  });
};
