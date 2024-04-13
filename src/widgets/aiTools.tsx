import { renderWidget, usePlugin, useRunAsync, WidgetLocation } from '@remnote/plugin-sdk';
import React from 'react';
import { DigestLongText } from '../components/ToolButtons/DigestLongText';
import { QueryWord } from '../components/ToolButtons/QueryWord';
import { OptText } from '../components/ToolButtons/OptText';
import { SubmitButton } from '../components/SubmitButton';
import { PromptGenerator } from '../components/ToolButtons/PromptGenerator';
import { AI_ENABLED_POWERUP_CODE, replaceSelection, getAiStatusRem } from '../plugins/ai';

export const SampleWidget = () => {
  const plugin = usePlugin();
  const widgetContext = useRunAsync(
    () => plugin.widget.getWidgetContext<WidgetLocation.UnderRemEditor>(),
    []
  );
  const widgetRem = useRunAsync(() => plugin.rem.findOne(widgetContext?.remId), [widgetContext]);

  // let name = useTracker(() => plugin.settings.getSetting<string>('name'));

  return (
    <div className="flex flex-wrap gap-4 h-[100%] p-4">
      <QueryWord />
      <DigestLongText />
      <OptText />
      <PromptGenerator />
      <SubmitButton
        onSubmit={async () => {
          const { newRem } = await replaceSelection({
            plugin,
            rem: await plugin.focus.getFocusedRem(),
          });
          newRem?.addPowerup(AI_ENABLED_POWERUP_CODE);
          const editingSelectionRem = await getAiStatusRem({ plugin, status: 'editingSelection' });
          console.log({ editingSelectionRem });

          editingSelectionRem && newRem?.addTag(editingSelectionRem);
        }}
      >
        激活ai(当前选择文本)
      </SubmitButton>
      <SubmitButton
        onSubmit={async () => {
          const rem = await plugin.focus.getFocusedRem();
          await rem?.addPowerup(AI_ENABLED_POWERUP_CODE);
        }}
      >
        激活ai(整个rem)
      </SubmitButton>
    </div>
  );
};

renderWidget(SampleWidget);
