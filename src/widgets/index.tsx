import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.app.toast("I'm a toast!");

  await plugin.app.registerWidget('sample_widget', WidgetLocation.SelectedTextMenu, {
    dimensions: { height: 150, width: '100%' },
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
