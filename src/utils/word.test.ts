import { expect, test, describe } from 'vitest';
import { parseWordExplain, normalizeTextList } from './word';

describe('normalizeTextList', () => {
  test('1', () => {
    expect(normalizeTextList(['  - 1', '      - 2', '  - 3', '      - 4'])).toMatchInlineSnapshot(`
      [
        "  - 1",
        "    - 2",
        "  - 3",
        "    - 4",
      ]
    `);
  });
  test('多层', () => {
    expect(
      normalizeTextList(['  - 1', '    - 2', '  - 3', '    - 4', '      - 5', '          - 6'])
    ).toMatchInlineSnapshot(`
      [
        "  - 1",
        "    - 2",
        "  - 3",
        "    - 4",
        "      - 5",
        "        - 6",
      ]
    `);
  });
  test('参差不齐', () => {
    expect(normalizeTextList(['  - 1', '      - 2', '  - 3', '        - 4']))
      .toMatchInlineSnapshot(`
        [
          "  - 1",
          "    - 2",
          "  - 3",
          "    - 4",
        ]
      `);
  });
  test('完整', () => {
    expect(
      normalizeTextList(
        `\`\`\`
  - 发音：[ˈlʌuki]
  - 释义：
      - adj. 有幸的，主要指事物或人在特定环境中的幸运；favorable， fortunate
      - v. （使）发生幸运事件，使某人感到幸运
  - 同义词：
      - fortunate: 表示事物或人在情况中有幸，指的是事件的偶然性；lucky
      - lucky: 表示事物或人在特定环境中有幸，指的是偶然事件；幸运的
  - 例句：
      - adj. 他是一个幸运的人，因为他赢得了华斯奖。
          - He is a lucky person, as he won the Nobel Prizes.
      - v. 我要好心机，请祈福我一下，让我bles luckysxtimes。
          - I wish you good luck, and I hope you'll be drenched in lucks.
  - 常用词组：
      - a lucky chance: 幸运的机会
      - lucky escape: 幸运的逃脱
      - lucky break: 幸运的机会
  - 词根词源：
      - Originally from Old Norse, the word 'luky' is derived from 'lukr' which means 'luck'. It later came to mean 'fortune' in Old English, and then evolved into its current meaning.
  - 派生词：
      - luckily (adv.): 幸运地
      - unlucky (adj.): 不幸的
      \`\`\``.split('\n')
      )
    ).toMatchInlineSnapshot(`
      [
        "\`\`\`",
        "  - 发音：[ˈlʌuki]",
        "    - 释义：",
        "      - adj. 有幸的，主要指事物或人在特定环境中的幸运；favorable， fortunate",
        "      - v. （使）发生幸运事件，使某人感到幸运",
        "    - 同义词：",
        "      - fortunate: 表示事物或人在情况中有幸，指的是事件的偶然性；lucky",
        "      - lucky: 表示事物或人在特定环境中有幸，指的是偶然事件；幸运的",
        "    - 例句：",
        "      - adj. 他是一个幸运的人，因为他赢得了华斯奖。",
        "        - He is a lucky person, as he won the Nobel Prizes.",
        "      - v. 我要好心机，请祈福我一下，让我bles luckysxtimes。",
        "        - I wish you good luck, and I hope you'll be drenched in lucks.",
        "    - 常用词组：",
        "      - a lucky chance: 幸运的机会",
        "      - lucky escape: 幸运的逃脱",
        "      - lucky break: 幸运的机会",
        "    - 词根词源：",
        "      - Originally from Old Norse, the word 'luky' is derived from 'lukr' which means 'luck'. It later came to mean 'fortune' in Old English, and then evolved into its current meaning.",
        "    - 派生词：",
        "      - luckily (adv.): 幸运地",
        "      - unlucky (adj.): 不幸的",
        "      \`\`\`",
      ]
    `);
  });
});

describe('parseWordExplain', () => {
  test('换行多', () => {
    expect(
      parseWordExplain(`\`\`\`
  - 发音：[ˈlʌuki]
  - 释义：
      - adj. 有幸的，主要指事物或人在特定环境中的幸运；favorable， fortunate
      - v. （使）发生幸运事件，使某人感到幸运
  - 同义词：
      - fortunate: 表示事物或人在情况中有幸，指的是事件的偶然性；lucky
      - lucky: 表示事物或人在特定环境中有幸，指的是偶然事件；幸运的
  - 例句：
      - adj. 他是一个幸运的人，因为他赢得了华斯奖。
          - He is a lucky person, as he won the Nobel Prizes.
      - v. 我要好心机，请祈福我一下，让我bles luckysxtimes。
          - I wish you good luck, and I hope you'll be drenched in lucks.
  - 常用词组：
      - a lucky chance: 幸运的机会
      - lucky escape: 幸运的逃脱
      - lucky break: 幸运的机会
  - 词根词源：
      - Originally from Old Norse, the word 'luky' is derived from 'lukr' which means 'luck'. It later came to mean 'fortune' in Old English, and then evolved into its current meaning.
  - 派生词：
      - luckily (adv.): 幸运地
      - unlucky (adj.): 不幸的
  \`\`\``)
    ).toMatchInlineSnapshot(`
      [
        {
          "category": "发音",
          "text": "[ˈlʌuki]",
        },
        {
          "category": "释义",
          "children": [
            "  - adj. 有幸的，主要指事物或人在特定环境中的幸运；favorable， fortunate",
            "  - v. （使）发生幸运事件，使某人感到幸运",
          ],
          "text": "",
        },
        {
          "category": "同义词",
          "text": "",
        },
        {
          "category": "fortunate",
          "text": "表示事物或人在情况中有幸，指的是事件的偶然性；lucky",
        },
        {
          "category": "lucky",
          "text": "表示事物或人在特定环境中有幸，指的是偶然事件；幸运的",
        },
        {
          "category": "例句",
          "children": [
            "  - adj. 他是一个幸运的人，因为他赢得了华斯奖。",
            "    - He is a lucky person, as he won the Nobel Prizes.",
            "  - v. 我要好心机，请祈福我一下，让我bles luckysxtimes。",
            "    - I wish you good luck, and I hope you'll be drenched in lucks.",
          ],
          "text": "",
        },
        {
          "category": "常用词组",
          "text": "",
        },
        {
          "category": "a lucky chance",
          "text": "幸运的机会",
        },
        {
          "category": "lucky escape",
          "text": "幸运的逃脱",
        },
        {
          "category": "lucky break",
          "text": "幸运的机会",
        },
        {
          "category": "词根词源",
          "children": [
            "  - Originally from Old Norse, the word 'luky' is derived from 'lukr' which means 'luck'. It later came to mean 'fortune' in Old English, and then evolved into its current meaning.",
          ],
          "text": "",
        },
        {
          "category": "派生词",
          "text": "",
        },
        {
          "category": "luckily (adv.)",
          "text": "幸运地",
        },
        {
          "category": "unlucky (adj.)",
          "text": "不幸的",
        },
        {
          "text": "  ",
        },
      ]
    `);
  });
});

// test('每个分类一行显示完', () => {
//   expect(
//     parseWordExplain(`\`\`\`
//   - 发音：[ˈkɑnstənsi]
//   - 释义：1. n. 常数，恒定；坚定不移 2. n. 不变性，稳定性
//   - 同义词：1. steadfastness（坚定不移，强调持久性）；2. stability（稳定性，指维持不变的状态）
//   - 例句：1. She admired his **constancy** in the face of adversity.（她敬佩他在逆境中的坚定不移。）；2. The **constancy** of her love never wavered.（她的爱从未动摇。）
//   - 常用词组：无
//   - 词根词源：来自拉丁词constans，意为“不变的”，由con-（一起）+ stans（站立）组成，指坚定不移、不变的状态。
//   - 派生词：无
//   \`\`\``)
//   ).toMatchInlineSnapshot(`
//     [
//       {
//         "category": "发音",
//         "text": "[ˈkɑnstənsi]",
//       },
//       {
//         "category": "释义",
//         "text": "1. n. 常数，恒定；坚定不移 2. n. 不变性，稳定性",
//       },
//       {
//         "category": "同义词",
//         "text": "1. steadfastness（坚定不移，强调持久性）；2. stability（稳定性，指维持不变的状态）",
//       },
//       {
//         "category": "例句",
//         "text": "1. She admired his **constancy** in the face of adversity.（她敬佩他在逆境中的坚定不移。）；2. The **constancy** of her love never wavered.（她的爱从未动摇。）",
//       },
//       {
//         "category": "常用词组",
//         "text": "无",
//       },
//       {
//         "category": "词根词源",
//         "text": "来自拉丁词constans，意为“不变的”，由con-（一起）+ stans（站立）组成，指坚定不移、不变的状态。",
//       },
//       {
//         "category": "派生词",
//         "children": [
//           "",
//         ],
//         "text": "无",
//       },
//     ]
//   `);
// });

// test('每个分类可能有多个', () => {
//   expect(
//     parseWordExplain(`
// \`\`\`
// - 发音：[ˈlæk]
// - 释义：
//     1. n. 不足不plete，缺乏缺 lack
//     2. v. 缺乏没有have nothing of
// - 同义词：scarce(更罕有的), insufficient(不足的), inadequate(不足以的)
//     侧重含义：缺乏或不足
// - 例句：
//     1. n. 他的情趣感缺乏。(He lacks romanticism)
//     2. v. 这 Miles 没有任何生活经验，甚至没有工作经验，而且代码中无法去投资。(Miles has no life experience, let alone work experience, and he is not going to investing in the code.)
// - 常用词组：lack of, short of, in lack of
// - 词根词源：来自中老Έ英语, 词根“lack”
// - 派生词：nothing, lackluster'(不牵手似深情的), lackadaisical'(无 год沉湏的)
// \`\`\`
// `)
//   ).toMatchInlineSnapshot(`
//     [
//       {
//         "category": "发音",
//         "text": "[ˈlæk]",
//       },
//       {
//         "category": "释义",
//         "children": [
//           "1. n. 不足不plete，缺乏缺 lack",
//           "2. v. 缺乏没有have nothing of",
//         ],
//         "text": "",
//       },
//       {
//         "category": "同义词",
//         "children": [
//           "侧重含义：缺乏或不足",
//         ],
//         "text": "scarce(更罕有的), insufficient(不足的), inadequate(不足以的)",
//       },
//       {
//         "category": "例句",
//         "children": [
//           "1. n. 他的情趣感缺乏。(He lacks romanticism)",
//           "2. v. 这 Miles 没有任何生活经验，甚至没有工作经验，而且代码中无法去投资。(Miles has no life experience, let alone work experience, and he is not going to investing in the code.)",
//         ],
//         "text": "",
//       },
//       {
//         "category": "常用词组",
//         "text": "lack of, short of, in lack of",
//       },
//       {
//         "category": "词根词源",
//         "text": "来自中老Έ英语, 词根“lack”",
//       },
//       {
//         "category": "派生词",
//         "text": "nothing, lackluster'(不牵手似深情的), lackadaisical'(无 год沉湏的)",
//       },
//     ]
//   `);
// });
