import {
  WidgetLocation,
  renderWidget,
  usePlugin,
  useRunAsync,
  AppEvent,
  useAPIEventListener,
  AppEvents,
  useTracker,
} from '@remnote/plugin-sdk';
import {
  AI_ACTION_POWERUP_CODE,
  AI_ENABLED_POWERUP_CODE,
  getAiPromptSceneRem,
  getAiStatusRem,
} from '../plugins/ai';
import { findAsync } from '../utils/common';

export const SampleWidget = () => {
  const plugin = usePlugin();

  const widgetRem = useTracker(async (plugin) => {
    const widgetContext = await plugin.widget.getWidgetContext<WidgetLocation.RightSideOfEditor>();
    return widgetContext?.remId ? await plugin.rem.findOne(widgetContext?.remId) : undefined;
  }, []);
  const likeRem = useRunAsync(async () => {
    if (widgetRem) {
      const likeRem = await findAsync(
        (await widgetRem.getTagRems()) || [],
        async (a) => (await a.isPowerupEnum()) && a.text?.[0] === 'like'
      );
      return likeRem;
    }
  }, [widgetRem]);
  console.log({ likeRem });

  return (
    <div className="flex gap-2">
      <div
        className={`bg-green-10 hover:bg-white rounded-lg cursor-pointer w-6 h-6 flex justify-center items-center transition-colors shadow-lg ${
          likeRem ? 'text-red-60' : 'text-gray-20'
        }`}
        onClick={async () => {
          const likeRem = (await getAiStatusRem({ plugin, status: 'like' }))!;
          const tags = await widgetRem?.getTagRems();
          if (tags?.some((a) => a._id === likeRem._id)) {
            widgetRem?.removeTag(likeRem._id);
          } else {
            widgetRem?.addTag(likeRem);
          }
        }}
      >
        <svg width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </div>
      <div
        className="bg-green-10 hover:bg-green-20 rounded-lg cursor-pointer w-6 h-6 flex justify-center items-center transition-colors shadow-lg"
        onClick={async () => {
          if (!widgetRem) return;
          const editingSelectionRem = await findAsync(
            (await widgetRem.getTagRems()) || [],
            async (a) => (await a.isPowerupEnum()) && a.text?.[0] === 'editingSelection'
          );
          const parentRem = (await widgetRem.getParentRem())!;
          parentRem.removePowerup(AI_ENABLED_POWERUP_CODE); // turn off ai
          const selectedRem = await getAiPromptSceneRem({ plugin, scene: 'selectedRem' })!;
          selectedRem && (await parentRem?.removeTag(selectedRem._id));

          // selection
          if (editingSelectionRem) {
            const replacedRem = await plugin.richText.replaceAllRichText(
              parentRem.text!,
              [{ i: 'q', _id: widgetRem._id }],
              widgetRem.text!
            );
            parentRem.setText(replacedRem);
            widgetRem.remove();
          } else {
            const childRems = await parentRem!.getChildrenRem();
            const optionRem = await getAiStatusRem({ plugin, status: 'option' })!;
            // whole rem
            widgetRem.text && parentRem?.setText(widgetRem.text);
            childRems.forEach(async (a) => {
              if (await a.hasPowerup(AI_ACTION_POWERUP_CODE)) {
                a.remove(); // remove self
              }
              const tags = await a.getTagRems();
              const hasOptionTag = tags.some((a) => a._id === optionRem?._id);
              if (hasOptionTag) a.remove(); // remove all option
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
    </div>
  );
};

renderWidget(SampleWidget);
