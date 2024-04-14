import { RNPlugin, Rem } from '@remnote/plugin-sdk';

export const generateMdToChildRems = async ({
  plugin,
  topRem,
  md,
}: {
  plugin: RNPlugin;
  topRem: Rem;
  md?: string;
}) => {
  const lines = md?.split('\n').filter(Boolean);
  if (!lines?.length) return;
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

export const traverseRemTree = async (
  rem: Rem,
  cb: (rem: Rem) => boolean | void | Promise<void | boolean>
) => {
  const res = await cb(rem);
  if (res === false) return false;
  const children = await rem.getChildrenRem();
  for (const child of children) {
    const res = await traverseRemTree(child, cb);
    if (res === false) break;
  }
};

export const findRem = async (
  rem: Rem,
  cb: (rem: Rem) => boolean | void | Promise<void | boolean>
) => {
  try {
    const res = await cb(rem);

    if (res) return rem;
    const children = await rem.getChildrenRem();
    for (const child of children) {
      const res = await findRem(child, cb);
      if (res) {
        return child;
      }
    }
  } catch (error) {
    console.log('fineRem cb error', error);
    return false;
  }
};

export const getRemChildrenText = async function (rem: Rem, plugin: RNPlugin) {
  return await Promise.all(
    (await rem?.getChildrenRem()).map(async (a) => await plugin.richText.toString(a.text!)) || []
  );
};
