import Dialog from 'neo.mjs/src/dialog/Base.mjs';
import TextField from 'neo.mjs/src/form/field/Text.mjs';

/**
 * @class SharedDialog.view.DemoDialog
 * @extends Neo.dialog.Base
 */
class DemoDialog extends Dialog {
  static getConfig() {
    return {
      className: 'SharedDialog.view.DemoWindow',
      title: 'Drag me across Windows!',

      containerConfig: {
        style: {
          padding: '20px'
        }
      },

      itemDefaults: {
        labelWidth: 70
      },

      items: [{
        module: TextField,
        flex: 'none',
        labelText: 'Field 1'
      }, {
        module: TextField,
        flex: 'none',
        labelText: 'Field 2'
      }],

      wrapperStyle: {
        height: '40%',
        width: '40%'
      }
    }
  }
}

Neo.applyClassConfig(DemoDialog);

export { DemoDialog as default };