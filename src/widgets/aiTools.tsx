import {
  renderWidget,
  usePlugin,
  useRunAsync,
  useTracker,
  WidgetLocation,
} from '@remnote/plugin-sdk';
import { SubmitButton } from '../components/SubmitButton';
import { AI_ENABLED_POWERUP_CODE, getEnabledPromptRows } from '../plugins/ai';
import { DigestLongText } from '../components/ToolButtons/DigestLongText';
import { OptText } from '../components/ToolButtons/OptText';
import { PromptGenerator } from '../components/ToolButtons/PromptGenerator';
import { QueryWord } from '../components/ToolButtons/QueryWord';
import { getAiStatusRem, replaceSelection, enableAI } from '../plugins/ai';

export const SampleWidget = () => {
  const plugin = usePlugin();
  const widgetContext = useRunAsync(
    () => plugin.widget.getWidgetContext<WidgetLocation.UnderRemEditor>(),
    []
  );
  const prompts = useTracker(async (plugin) => {
    return await getEnabledPromptRows(plugin);
  }, []);

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {prompts?.map((a, i) => (
        <SubmitButton
          key={i}
          // className={buttonClassName}
          onSubmit={async () => {
            const rem = await plugin.focus.getFocusedRem();
            if (rem?.text) {
              const text = await plugin.richText.toString(rem.text);
              await enableAI({
                plugin,
                rem,
                prompt: a.prompt,
                text,
              });
            }
          }}
        >
          {a.name}
        </SubmitButton>
      ))}
      <QueryWord />
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
