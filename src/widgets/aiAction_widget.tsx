import { WidgetLocation, renderWidget, usePlugin, useRunAsync } from '@remnote/plugin-sdk';
import { AI_ACTION_POWERUP_CODE, AI_ENABLED_POWERUP_CODE, getAiStatusRem } from '../plugins/ai';
import { findAsync } from '../utils/common';

export const SampleWidget = () => {
  const plugin = usePlugin();

  const widgetContext = useRunAsync(
    () => plugin.widget.getWidgetContext<WidgetLocation.RightSideOfEditor>(),
    []
  );

  return (
    <div
      className="bg-green-10 hover:bg-green-20 rounded-lg cursor-pointer w-6 h-6 flex justify-center items-center transition-colors shadow-lg"
      onClick={async () => {
        const rem = await plugin.rem.findOne(widgetContext?.remId);
        if (!rem) return;
        const editingSelectionRem = await findAsync(
          (await rem.getTagRems()) || [],
          async (a) => (await a.isPowerupEnum()) && a.text?.[0] === 'editingSelection'
        );
        const parentRem = (await rem.getParentRem())!;
        parentRem.removePowerup(AI_ENABLED_POWERUP_CODE); // turn off ai

        // selection
        if (editingSelectionRem) {
          const replacedRem = await plugin.richText.replaceAllRichText(
            parentRem.text!,
            [{ i: 'q', _id: rem._id }],
            rem.text!
          );
          parentRem.setText(replacedRem);
          rem.remove();
        } else {
          const childRems = await parentRem!.getChildrenRem();
          const optionRem = await getAiStatusRem({ plugin, status: 'option' })!;
          // whole rem
          rem.text && parentRem?.setText(rem.text);
          childRems.forEach(async (a) => {
            if (await a.hasPowerup(AI_ACTION_POWERUP_CODE)) {
              a.remove();
            }
            const tags = await a.getTagRems();
            const hasOptionTag = tags.some((a) => a._id === optionRem?._id);
            if (hasOptionTag) a.remove();
          });
        }
      }}
    >
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path
          className="transition-colors hover:stroke-green-80"
          fill="none"
          stroke="#059669"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12 l4 4 L18 8"
        />
      </svg>
    </div>
  );
};

renderWidget(SampleWidget);
