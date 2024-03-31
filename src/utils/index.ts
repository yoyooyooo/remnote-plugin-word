import { RNPlugin, Rem } from '@remnote/plugin-sdk';

/**
 * 在 parentRem 的子级生成文本
 * 原文 text 格式如下：
 * ```
- 发音：[ˈkɑnstənsi]
- 释义：1. n. 常数，恒定；坚定不移 2. n. 不变性，稳定性
- 同义词：1. steadfastness（坚定不移，强调持久性）；2. stability（稳定性，指维持不变的状态）
- 例句：1. She admired his **constancy** in the face of adversity.（她敬佩他在逆境中的坚定不移。）；2. The **constancy** of her love never wavered.（她的爱从未动摇。）
- 常用词组：无
- 词根词源：来自拉丁词constans，意为“不变的”，由con-（一起）+ stans（站立）组成，指坚定不移、不变的状态。
- 派生词：无
```
 */
export const generateWordChildRems = async ({
  plugin,
  parentRem,
  text,
}: {
  plugin: RNPlugin;
  text: string;
  parentRem: Rem;
}) => {
  let md =
    text
      .trim()
      .match(/```[\r\n]*([\s\S]*)[\r\n]*```/)?.[1]
      ?.split('\n')
      .filter(Boolean)
      .map((a) => {
        console.log(a);
        a = a.replace(/^\s*-\s/, '');
        let match = a.match(/(.*?)(?:[:：]\s?)(.*)/);
        // 把: 后面的内容根据 (\d.) 分割，最终，>=第二项为：后的内容
        const res = match ? [match[1], ...match[2].split(/(?=\d\.\s?)/)] : [a];
        return res.map((a) => a.replace(/\s*[;；]\s*$/, ''));
      })

      .filter(Boolean) || [];

  if (md.length) {
    for (const lineElements of md) {
      if (!lineElements[1] || lineElements[1] === '无') continue;
      const rem = await plugin.rem.createRem();
      const rt = plugin.richText.text('');
      for (const [i, t] of lineElements.entries()) {
        // 如['发音', '/hei/']，第一项为分类
        if (i === 0) {
          rt.text(`${t}: `);
        } else {
          // >=第二项的内容有多项时，需要换行，表示冒号后的内容会有1,2,3很多点
          if (lineElements.length > 2) {
            rt.newline().text(' '.repeat(4));
          } else {
            // rt.text(' '.repeat(4));
          }
          t.split(/(\*\*[^\*]+\*\*)/)
            .filter(Boolean)
            .forEach((a) => {
              const m = a.match(/\*\*([^\*]+)\*\*/);
              if (m) {
                rt.text(m[1], ['bold']);
              } else {
                rt.text(a);
              }
            });
        }
      }
      await rem?.setText(await rt.value());
      parentRem && (await rem?.setParent(parentRem));
    }
  }
};
