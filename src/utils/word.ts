import { RNPlugin, Rem } from '@remnote/plugin-sdk';

// .split(/(?=\d\.\s?)/)
// .map((a) => a.replace(/\s*[;；]\s*$/, '').trim())
// .filter(Boolean)

export const generateWordChildRems = async ({
  plugin,
  topRem,
  md,
}: {
  plugin: RNPlugin;
  topRem: Rem;
  md: string;
}) => {
  const lines = md.split('\n');
  // 栈，用于跟踪当前的列表项和它们的层级，初始包含顶层元素 topRem
  const stack = [{ level: 0, rem: topRem }];

  // 遍历所有行以构建列表
  for (const line of lines) {
    if (line.trim() === '') continue; // 忽略空行

    // 计算当前行的缩进层级（每个‘-’前的空格数量），除以2是因为每个层级缩进2个空格
    const level = line.search(/\S|$/) / 2;

    // 提取Markdown行的内容，去掉前面的‘- ’
    const content = line.trim().replace(/^\s*-\s?/, '');

    // 当前行的层级应该小于或等于栈顶层级时，一直pop栈直到找到当前行的父层级
    while (stack.length > 1 && level <= stack[stack.length - 1].level) {
      stack.pop();
    }

    // 创建新的列表项，并设置其内容
    const newRem = await plugin.rem.createRem(); // 假设存在一个可以创建列表项的函数
    await newRem?.setText(await plugin.richText.parseFromMarkdown(content));

    // 如果栈不为空，设置新列表项的父级
    const parentRem = stack[stack.length - 1].rem;
    if (parentRem) {
      await newRem?.setParent(parentRem);
    }

    // 将新的列表项加入栈，以便后续行可以将其作为父级
    stack.push({ level, rem: newRem! });
  }
};

export const normalizeTextList = (list: string[]) => {
  const spacesList = list.map((a) => a.match(/^\s+/)?.[0].length || 0); // 每行开头的空格数量
  const array = [...new Set(spacesList)];
  const spaceMap = array.reduce(
    (memo, a, i) => ({ ...memo, [a]: i + 1 }),
    {} as Record<string, number>
  ); // 原来的空格数映射为

  return list
    .map((a) => a.replace(/\s+/, (m) => ' '.repeat(spaceMap[m.length] * 2)))
    .reduce((memo, a) => {
      const prevSpaceLen = memo[memo.length - 1]?.match(/\s+/)?.[0]?.length || 0;
      const currentSpaceLen = a.match(/\s+/)?.[0]?.length || 0;
      return [
        ...memo,
        currentSpaceLen > prevSpaceLen
          ? a.replace(/\s+/, (m) => ' '.repeat(prevSpaceLen) + '  ')
          : a,
      ];
    }, [] as string[]);
};

export const parseWordExplain = (text: string) => {
  const list = text
    .trim()
    .match(/```[\r\n]*([\s\S]*)[\r\n]*```/)?.[1]
    ?.split('\n')
    .filter(Boolean)
    .map((a) => {
      let m = a.match(/^\s*-\s(.*?)(?:[:：]\s?)(.*)/); //这里不应该把前面的空格都去掉，这样后面没层级了
      // 把: 后面的内容根据 (\d.) 分割，最终，>=第二项为：后的内容
      const res = m
        ? {
            category: m[1],
            text: m[2],
          }
        : {
            text: a,
          };
      return res;
    });

  const res = [] as { category?: string; text: string; children?: string[] }[];

  while (list?.length) {
    const item = list.shift()!;
    if (res[res.length - 1]) {
      const m = item.text.match(/^\s{4}(.*)/);
      if (m) {
        res[res.length - 1].children ||= [];
        res[res.length - 1].children!.push(m[1]);
      } else {
        res.push(item);
      }
    } else {
      res.push(item);
    }
  }

  return res.map((a) =>
    a.children?.length ? { ...a, children: normalizeTextList(a.children) } : a
  );
};

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
// export const generateWordChildRems = async ({
//   plugin,
//   parentRem,
//   text,
// }: {
//   plugin: RNPlugin;
//   text: string;
//   parentRem: Rem;
// }) => {
//   let list = parseWordExplain(text);

//   for (const item of list) {
//     const rem = await plugin.rem.createRem();
//     const rt = plugin.richText.text('');

//     // 如['发音', '/hei/']，第一项为分类
//     if (item.category) {
//       rt.text(`${item.category}: ${item.text}`);
//       for (const child of item.children || []) {
//         const rem2 = await plugin.rem.createRem();
//         rem2?.setText(await plugin.richText.parseFromMarkdown(child));
//         rem2?.setParent(rem!);
//       }
//       // t.split(/(\*\*[^\*]+\*\*)/)
//       //   .filter(Boolean)
//       //   .forEach((a) => {
//       //     const m = a.match(/\*\*([^\*]+)\*\*/);
//       //     if (m) {
//       //       rt.text(m[1], ['bold']);
//       //     } else {
//       //       rt.text(a);
//       //     }
//       //   });
//     }
//     await rem?.setText(await rt.value());
//     parentRem && (await rem?.setParent(parentRem));
//   }
// };
