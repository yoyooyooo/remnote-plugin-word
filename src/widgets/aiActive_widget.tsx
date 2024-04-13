import {
  renderWidget,
  usePlugin,
  useTracker,
  useRunAsync,
  WidgetLocation,
  RemViewer,
  filterAsync,
  RemRichTextEditor,
} from '@remnote/plugin-sdk';
import React from 'react';
import { DigestLongText } from '../components/ToolButtons/DigestLongText';
import { QueryWord } from '../components/ToolButtons/QueryWord';
import { OptText } from '../components/ToolButtons/OptText';
import { SubmitButton } from '../components/SubmitButton';
import { PromptGenerator } from '../components/ToolButtons/PromptGenerator';
import {
  AI_ENABLED_POWERUP_CODE,
  AI_ACTION_POWERUP_CODE,
  aiSlots,
  enableAI,
  prompt_optText,
  PROMPT,
} from '../plugins/ai';

export const SampleWidget = () => {
  const plugin = usePlugin();
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');

  // const rem = useRunAsync(async () => await plugin.rem.createRem(), []);
  const widgetContext = useRunAsync(
    () => plugin.widget.getWidgetContext<WidgetLocation.UnderRemEditor>(),
    []
  );
  const widgetRem = useRunAsync(() => plugin.rem.findOne(widgetContext?.remId), [widgetContext]);
  const _prompt = useRunAsync(async () => {
    return await widgetRem?.getPowerupProperty(AI_ENABLED_POWERUP_CODE, aiSlots.prompt);
  }, [widgetRem]);
  const xxx = useRunAsync(async () => {
    return await widgetRem?.getPowerupPropertyAsRem(AI_ENABLED_POWERUP_CODE, aiSlots.prompt);
  }, [widgetRem]);

  React.useEffect(() => {
    _prompt && setPrompt(_prompt);
  }, [_prompt]);

  return (
    <div
      className="bg-pink-10 rounded-md px-5 py-2 flex flex-wrap gap-2"
      onClick={async () => {
        //     const tag = await plugin.powerup.getPowerupByCode(AI_ACTIVE_POWERUP_CODE);
        //     const children = (await tag?.getChildrenRem()) || [];
        //     const properties = await filterAsync(children, (c) => c.isProperty());
        //     console.log({ properties }, await properties[0].getChildrenRem());
      }}
    >
      <SubmitButton
        className="bg-blue-50 rounded-md inline-block py-1 px-2 text-sm text-bold text-white cursor-pointer"
        onSubmit={async () => {
          const rem = (await plugin.rem.findOne(widgetContext?.remId))!;
          if (rem.text) {
            const text = await plugin.richText.toString(rem.text);
            await enableAI({
              plugin,
              rem,
              prompt: prompt_optText,
              text,
            });
          }
        }}
      >
        重新执行
        {prompt
          ? `${
              // @ts-ignore
              PROMPT[prompt] ? `: ${PROMPT[prompt]}` : ''
            }`
          : ''}
      </SubmitButton>

      <div
        className="bg-blue-50 rounded-md inline-block py-1 px-2 text-sm text-bold text-white cursor-pointer"
        onClick={() => setShowPrompt((p) => !p)}
      >
        更新prompt
      </div>
      {showPrompt && (
        <div className="flex w-full gap-2">
          <textarea
            className="border-grey flex-1"
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div
            className="bg-green-50 h-max rounded-md inline-block py-1 px-2 text-sm text-bold text-white cursor-pointer"
            onClick={() => {
              setShowPrompt(false);
              setPrompt(prompt);
              widgetRem?.setPowerupProperty(AI_ENABLED_POWERUP_CODE, aiSlots.prompt, [prompt]);
            }}
          >
            更新
          </div>
        </div>
      )}

      {/* <RemViewer remId={xxx?._id} width="100%" /> */}
      {/* <RemRichTextEditor remId={xxx?._id} width="100%" /> */}
    </div>
  );
};

renderWidget(SampleWidget);
