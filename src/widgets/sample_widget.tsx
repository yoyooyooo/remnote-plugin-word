import { usePlugin, renderWidget, useTracker, useRunAsync } from '@remnote/plugin-sdk';
import { generateWordChildRems } from '../utils';

export const SampleWidget = () => {
  const plugin = usePlugin();
  // const rem = useRunAsync(async () => await plugin.rem.createRem(), []);

  // let name = useTracker(() => plugin.settings.getSetting<string>('name'));

  return (
    <div
      className="rounded bg-red-50 h-[100%] text-green-90"
      onClick={async (e) => {
        const focusRem = await plugin.focus.getFocusedRem();
        console.log(focusRem);
        focusRem &&
          generateWordChildRems({
            plugin,
            parentRem: focusRem,
            text: `
          \`\`\`
          - 发音：[ˈkɑnstənsi]
          - 释义：1. n. 常数，恒定；坚定不移 2. n. 不变性，稳定性
          - 同义词：1. steadfastness（坚定不移，强调持久性）；2. stability（稳定性，指维持不变的状态）
          - 例句：1. She admired his **constancy** in the face of adversity.（她敬佩他在逆境中的坚定不移。）；2. The **constancy** of her love never wavered.（她的爱从未动摇。）
          - 常用词组：无
          - 词根词源：来自拉丁词constans，意为“不变的”，由con-（一起）+ stans（站立）组成，指坚定不移、不变的状态。
          - 派生词：无
          \`\`\`
                  `,
          });
      }}
    >
      插入翻译
    </div>
  );
};

renderWidget(SampleWidget);
