import shortcuts from './../../../src/utils/index.js';
import Dialog from 'neo.mjs/src/dialog/Base.mjs';
import TextField from 'neo.mjs/src/form/field/Text.mjs';

/**
 * @class win11React.src.containers.background.DragShortcuts
 * @extends Neo.dialog.Base
 */
class DragShortcuts extends Dialog {
  static getConfig() {
    return {
      className: 'win11React.src.containers.background.DragShortcuts',
      title: 'Shortcut Drag Test',

      items: [{
        module: TextField,
        labelText: `${shortcuts.desktop[0]}`
      }, {
        module: TextField,
        labelText: `${shortcuts.desktop[1]}`
      }, {
        module: TextField,
        labelText: `${shortcuts.desktop[2]}`
      }, {
        module: TextField,
        labelText: `${shortcuts.desktop[3]}`
      }, {
        module: TextField,
        labelText: `${shortcuts.desktop[4]}`
      }, {
        module: TextField,
        labelText: `${shortcuts.desktop[5]}`
      }, {
        module: TextField,
        labelText: `${shortcuts.desktop[6]}`
      }, {
        module: TextField,
        labelText: `${shortcuts.desktop[7]}`
      }, {
        module: TextField,
        labelText: `${shortcuts.desktop[8]}`
      }]
    }
  }
}

Neo.applyClassConfig(DragShortcuts);

export { DragShortcuts as default };