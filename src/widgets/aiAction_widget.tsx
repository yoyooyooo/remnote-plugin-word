import {
  renderWidget,
  usePlugin,
  useTracker,
  useRunAsync,
  WidgetLocation,
} from '@remnote/plugin-sdk';
import React from 'react';
import { DigestLongText } from '../components/ToolButtons/DigestLongText';
import { QueryWord } from '../components/ToolButtons/QueryWord';
import { OptText } from '../components/ToolButtons/OptText';
import { SubmitButton } from '../components/SubmitButton';
import { PromptGenerator } from '../components/ToolButtons/PromptGenerator';
import {
  AI_ENABLED_POWERUP_CODE,
  aiSlots,
  AI_ACTION_POWERUP_CODE,
  completePrompt,
} from '../plugins/ai';
import { findAsync } from '../utils/common';

export const SampleWidget = () => {
  const plugin = usePlugin();

  const widgetContext = useRunAsync(
    () => plugin.widget.getWidgetContext<WidgetLocation.RightSideOfEditor>(),
    []
  );
  // const rem = useRunAsync(async () => await plugin.rem.createRem(), []);

  //   let name = useTracker((rplugin) => {});

  return (
    <div
      className="bg-green-10 rounded-lg cursor-pointer p-1"
      onClick={async () => {
        const rem = await plugin.rem.findOne(widgetContext?.remId);
        if (!rem) return;
        const editingSelectionRem = await findAsync(
          (await rem.getTagRems()) || [],
          async (a) => (await a.isPowerupEnum()) && a.text?.[0] === 'editingSelection'
        );
        console.log({ rem, editingSelectionRem, tags: await rem.getTagRems() });
        const parentRem = (await rem.getParentRem())!;

        if (editingSelectionRem) {
          const replacedRem = await plugin.richText.replaceAllRichText(
            parentRem.text!,
            [{ i: 'q', _id: rem._id }],
            rem.text!
          );
          parentRem.setText(replacedRem);
          rem.remove();
        } else {
          const childRems = await parentRem!.getChildrenRem();
          rem.text && parentRem?.setText(rem.text);
          childRems.forEach(async (a) => {
            if (await a.hasPowerup(AI_ACTION_POWERUP_CODE)) {
              a.remove();
            }
          });
        }
      }}
    >
      √
    </div>
  );
};

renderWidget(SampleWidget);
