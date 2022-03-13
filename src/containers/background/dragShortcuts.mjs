import shortcuts from './../../../src/utils/index.js';
import Dialog from 'neo.mjs/src/dialog/Base.mjs';
import TextField from 'neo.mjs/src/form/field/Text.mjs';

/**
 * @class win11React.src.containers.background.dragShortcuts
 * @extends Neo.dialog.Base
 */
class dragShortcuts extends Dialog {
  static getConfig() {
    return {
      className: 'win11React.src.containers.background.dragShortcuts',
      title: 'joe mama\'s test one'
    }
  }
}