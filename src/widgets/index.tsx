import { declareIndexPlugin, ReactRNPlugin, WidgetLocation, AppEvents } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';
import { extractInterviewProcess } from '../commands/interview';
import { initAiPlugin } from '../plugins/ai';

let lastFloatingWidgetId: string;
export const POPUP_Y_OFFSET = 25;
async function onActivate(plugin: ReactRNPlugin) {
  await plugin.app.toast('ai helper loaded!');

  await plugin.app.registerWidget('aiTools', WidgetLocation.SelectedTextMenu, {
    dimensions: { height: 150, width: '100%' },
  });

  await plugin.app.registerWidget('prompt', WidgetLocation.SelectedTextMenu, {
    dimensions: { height: 'auto', width: '100%' },
  });
  // await plugin.app.registerWidget('floating_widget', WidgetLocation.FloatingWidget, {
  //   dimensions: { height: 'auto', width: 'auto' },
  // });

  await initAiPlugin({ plugin });
  await extractInterviewProcess({ plugin });

  const openAutocompleteWindow = async () => {
    const caret = await plugin.editor.getCaretPosition();
    lastFloatingWidgetId = await plugin.window.openFloatingWidget('floating_widget', {
      top: caret ? caret.y + POPUP_Y_OFFSET : undefined,
      left: caret?.x,
    });
  };

  await plugin.app.registerCommand({
    id: 'ai',
    name: 'AI',
    action: async () => {
      // const rem = await plugin.focus.getFocusedRem();
      await openAutocompleteWindow();

      // const res = await plugin.editor.
    },
  });

  // await openAutocompleteWindow();

  plugin.event.addListener(AppEvents.EditorTextEdited, undefined, async () => {
    if (lastFloatingWidgetId && (await plugin.window.isFloatingWidgetOpen(lastFloatingWidgetId))) {
      const caret = await plugin.editor.getCaretPosition();
      await plugin.window.setFloatingWidgetPosition(lastFloatingWidgetId, {
        top: caret ? caret.y + POPUP_Y_OFFSET : undefined,
        left: caret?.x,
      });
      return;
    }
    // await openAutocompleteWindow();
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
