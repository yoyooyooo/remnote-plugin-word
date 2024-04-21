import { WidgetLocation, renderWidget, usePlugin, useTracker } from '@remnote/plugin-sdk';
import React from 'react';
import { SubmitButton } from '../components/SubmitButton';
import {
  AI_ENABLED_POWERUP_CODE,
  PROMPT,
  aiSlots,
  enableAI,
  getAiStatusRem,
  getAiPromptSceneRem,
  getEnabledPromptRows,
} from '../plugins/ai';
import { ToneSetting } from '../plugins/ai/ToneSetting';
import { extractPost } from '../utils/extractPost';
import { getRemTextIncludesReferences } from '../utils/rem';

export const SampleWidget = () => {
  const plugin = usePlugin();
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [tab, setTab] = React.useState<'action' | 'buildIn' | 'tone'>('action');

  const widgetContext = useTracker(
    (plugin) => plugin.widget.getWidgetContext<WidgetLocation.UnderRemEditor>(),
    []
  );
  const widgetRem = useTracker(
    (plugin) => plugin.rem.findOne(widgetContext?.remId),
    [widgetContext]
  );
  const _prompt = useTracker(
    async (plugin) => {
      return await widgetRem?.getPowerupProperty(AI_ENABLED_POWERUP_CODE, aiSlots.prompt);
    },
    [widgetRem]
  );

  const prompts = useTracker(async (plugin) => {
    return await getEnabledPromptRows(plugin);
  }, []);

  React.useEffect(() => {
    _prompt && setPrompt(_prompt);
  }, [_prompt]);

  const buttonClassName = `bg-blue-50 rounded-md inline-block py-1 px-2 text-sm text-bold text-white cursor-pointer w-max`;

  // 提供的文案，如果是已选择多个rem，需要把当前rem里的双链包含子级都拿出来拼一起
  const getText = async () => {
    const rem = (await plugin.rem.findOne(widgetContext?.remId))!;
    const selectedRemRem = await getAiPromptSceneRem({
      plugin,
      scene: 'selectedRem',
    });
    const tags = await rem.getTagRems();
    if (tags.some((a) => a._id === selectedRemRem?._id)) {
      // plugin.richText.toString()
      // 选择多个rem
      return await getRemTextIncludesReferences({ rem, plugin, includeDescendants: false });
    } else {
      // 单个rem（当前rem）
      if (rem.text) {
        return await plugin.richText.toString(rem.text);
      }
    }
  };

  return (
    <div className="bg-pink-10 rounded-md px-5 py-2 flex flex-wrap gap-2">
      <div className="flex items-center justify-center bg-gray-10 rounded-lg">
        <div className="flex border-b">
          <button
            className={`text-sm px-4 ${
              tab === 'action' ? 'font-semibold text-black' : 'font-light text-gray-30'
            }`}
            onClick={() => setTab('action')}
          >
            操作
          </button>
          <button
            className={`text-sm px-4 h-[26px] ${
              tab === 'buildIn' ? 'font-semibold text-black' : 'font-light text-gray-30'
            }`}
            onClick={() => setTab('buildIn')}
          >
            内置prompt
          </button>
          <button
            className={`text-sm px-4 h-[26px] ${
              tab === 'tone' ? 'font-semibold text-black' : 'font-light text-gray-30'
            }`}
            onClick={() => setTab('tone')}
          >
            语气
          </button>
        </div>
      </div>

      <div className="w-full flex flex-wrap gap-2">
        {tab === 'action' && (
          <>
            {prompt && (
              <SubmitButton
                className={buttonClassName}
                onSubmit={async () => {
                  await enableAI({ plugin, rem: widgetRem, prompt, text: await getText() });
                }}
              >
                重新执行
                {prompt
                  ? `${
                      // @ts-ignore
                      PROMPT[prompt] ? `: ${PROMPT[prompt]}` : ': 自定义prompt'
                    }`
                  : ''}
              </SubmitButton>
            )}

            <SubmitButton
              className={buttonClassName}
              onSubmit={async () => {
                const childRems = await widgetRem!.getChildrenRem();
                const optionRem = (await getAiStatusRem({ plugin, status: 'option' }))!;
                const likeRem = (await getAiStatusRem({ plugin, status: 'like' }))!;
                childRems.forEach(async (a) => {
                  const tags = await a.getTagRems();
                  if (
                    tags.some((a) => a._id === optionRem?._id) &&
                    !tags.some((a) => a._id === likeRem._id)
                  )
                    a.remove();
                });
              }}
            >
              清空非标星
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
                  className="border border-solid border-red-10 rounded-md flex-1 p-2"
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div
                  className={`h-max ${buttonClassName}`}
                  onClick={() => {
                    setShowPrompt(false);
                    setPrompt(prompt);
                    widgetRem?.setPowerupProperty(AI_ENABLED_POWERUP_CODE, aiSlots.prompt, [
                      prompt,
                    ]);
                  }}
                >
                  更新
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'buildIn' &&
          prompts?.map((a, i) => (
            <SubmitButton
              key={i}
              className={buttonClassName}
              onSubmit={async () => {
                await enableAI({ plugin, rem: widgetRem, prompt: a.prompt, text: await getText() });
              }}
            >
              {a.name}
            </SubmitButton>
          ))}

        {tab === 'tone' && <ToneSetting rem={widgetRem} />}
      </div>

      <SubmitButton
        onSubmit={async () => {
          const res = await extractPost(`https://mp.weixin.qq.com/s/560AjX2-92nnKXQcupzFfA`);
          console.log(1213, res);
          // const rem = (await plugin.rem.createRem())!;
          // rem.setText(await plugin.richText.parseFromMarkdown(res));
          // widgetRem && rem.setParent(widgetRem);
          // rem.setText();
          const rems = await plugin.rem.createTreeWithMarkdown(res);
          console.log({ rems });

          if (widgetRem) {
            for (const r of rems) {
              await r.setParent(widgetRem);
            }
          }
        }}
      >
        extractPost
      </SubmitButton>
    </div>
  );
};

renderWidget(SampleWidget);
