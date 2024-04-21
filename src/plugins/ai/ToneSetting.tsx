import Slider from '@mui/joy/Slider';
import { WidgetLocation, usePlugin, useTracker, Rem } from '@remnote/plugin-sdk';
import React from 'react';
import { AI_ENABLED_POWERUP_CODE, aiSlots } from './constants';
import { SubmitButton } from '../../components/SubmitButton';
import { toneMap } from '../../utils/openai';
import { enableAI } from './utils';

const marks = [
  {
    value: 0,
    label: 'no',
    zhLabel: '无',
  },
  {
    value: 20,
    label: 'casual',
    zhLabel: '随意',
  },
  {
    value: 40,
    label: 'friendly',
    zhLabel: '友好',
  },
  {
    value: 60,
    label: 'direct',
    zhLabel: '直接',
  },
  {
    value: 80,
    label: 'confident',
    zhLabel: '自信',
  },
  {
    value: 100,
    label: 'professional',
    zhLabel: '专业',
  },
];
function valueText(value: number) {
  switch (value) {
    case 0:
      return 'Casual';
    case 25:
      return 'Friendly';
    case 50:
      return 'Direct';
    case 75:
      return 'Confident';
    case 100:
      return 'Professional';
    default:
      return `${value}`;
  }
}

export const ToneSetting = ({ rem }: { rem?: Rem }) => {
  const plugin = usePlugin();
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [tab, setTab] = React.useState<'action' | 'buildIn'>('action');

  const widgetContext = useTracker(
    (plugin) => plugin.widget.getWidgetContext<WidgetLocation.UnderRemEditor>(),
    []
  );
  const widgetRem = useTracker(
    (plugin) => plugin.rem.findOne(widgetContext?.remId),
    [widgetContext]
  );

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="w-full flex justify-center py-2">
        <div className="w-10/12">
          <Slider
            // valueLabelFormat={(x) => marks.find((a) => a.value === x)?.label}
            step={null} // 使用 null 来只允许在标记处停止
            marks={marks}
            valueLabelDisplay="off"
            onChange={async (e, value) => {
              const tone = marks.find((a) => a.value === value)?.label;
              const res = await plugin.powerup.getPowerupSlotByCode(
                AI_ENABLED_POWERUP_CODE,
                aiSlots.tone
              );
              const toneChildren = (await res?.getChildrenRem()) || [];
              const toneRem = toneChildren.find((a) => a.text?.[0] === tone);
              if (!tone) return;
              toneRem?._id &&
                (await rem?.setPowerupProperty(AI_ENABLED_POWERUP_CODE, aiSlots.tone, [
                  {
                    i: 'q',
                    _id: toneRem._id,
                  },
                ]));
              // await rem?.setPowerupProperty(AI_ENABLED_POWERUP_CODE, aiSlots.tone, [tone]);
              await rem?.setPowerupProperty(AI_ENABLED_POWERUP_CODE, aiSlots.params, [
                // @ts-ignore
                JSON.stringify(toneMap[tone] || {}),
              ]);
              // onChange?.(marks.find(a=>a.value===value)?.)
            }}
          />
        </div>
      </div>
      <SubmitButton
        className="w-max bg-blue-50 rounded-md inline-block py-1 px-2 text-sm text-bold text-white cursor-pointer"
        onSubmit={async () => {
          if (!widgetRem) return;
          debugger;
          const text = await plugin.richText.toString(widgetRem.text || []);
          if (!text) return;
          const prompt = await widgetRem?.getPowerupProperty(
            AI_ENABLED_POWERUP_CODE,
            aiSlots.prompt
          );
          if (!prompt) {
            await plugin.app.toast('此rem没有prompt');
            return;
          }

          await Promise.all(
            marks.map(async (a, i) => {
              // @ts-ignore
              const params = toneMap[a.label];
              if (!params) return;
              await enableAI({
                plugin,
                rem,
                prompt,
                text,
                params,
                transformResponseText: async (text) => {
                  return [
                    {
                      text: a.zhLabel + '  ',
                      i: 'm',
                      tc: 0,
                      h: 3,
                    } as any,
                    ...text,
                  ];
                },
              });
            })
          );
        }}
      >
        所有语气生成一次
      </SubmitButton>
    </div>
  );
};
