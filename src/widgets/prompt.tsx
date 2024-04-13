import { renderWidget, usePlugin } from '@remnote/plugin-sdk';
import React, { useState } from 'react';
import { queryAi } from '../utils/openai';

export const floating_widget = () => {
  const plugin = usePlugin();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="flex p-5 flex-col">
      <div className="rounded w-full">
        <input
          // rows={2}
          type="text"
          className="border border-gray-30 rounded-lg h-9 p-2 w-full"
          placeholder="请输入prompt..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={async (e) => {
            if (!value || loading) return;

            const selection = await plugin.editor.getSelectedText();
            if (!selection) return;
            const selectedText = await plugin.richText.toString(selection.richText);

            if (e.key === 'Enter') {
              setLoading(true);
              setError('');
              // await plugin.editor.delete();
              // await plugin.editor.insertMarkdown(`abcdefghijklmn`);
              const [err, text] = await queryAi({
                prompt: `已知一段文本："""${selectedText}"""。根据以下要求：${value}`,
                // 重要：输出必须完全不包含引号、特殊字符或任何非文本元素，只包含纯文本内容
              });
              if (!err) {
                await plugin.editor.delete();
                await plugin.editor.insertMarkdown(text);
              } else {
                setError('请求出错');
              }
              setLoading(false);
            }
          }}
        />
      </div>
      {loading && 'loading...'}
    </div>
  );
};

renderWidget(floating_widget);
