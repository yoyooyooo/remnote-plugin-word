import { renderWidget, usePlugin } from '@remnote/plugin-sdk';
import React, { useState } from 'react';
import { queryAi } from '../utils/openai';

export const floating_widget = () => {
  const plugin = usePlugin();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-wrap gap-4 h-min-[200px]">
      <div className="rn-clr-shadow-menu rounded">
        <input
          className="border border-gray-300 rounded-lg h-9 p-2 w-full"
          type="text"
          placeholder="请输入..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={async (e) => {
            if (!value) return;
            if (e.key === 'Enter') {
              setLoading(true);
              const [err, text] = await queryAi({
                prompt: `已知这段文本："""${value}"""。`,
              });
              if (!err) {
                await plugin.editor.delete();
                await plugin.editor.insertMarkdown(text);
              }

              setLoading(false);
            }
          }}
        />
      </div>
      {loading && 'loading'}
      <button
        onClick={async () => {
          await plugin.editor.deleteCharacters(3, 1);
        }}
      >
        xxx
      </button>
    </div>
  );
};

renderWidget(floating_widget);
