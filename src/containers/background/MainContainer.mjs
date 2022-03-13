import Button from 'neo.mjs/src/button/Base.mjs';
import mainContainerController from './mainContainerController.mjs';
import Toolbar from 'neo.mjs/src/container/Toolbar.mjs';
import Viewport from 'neo.mjs/src/container/Viewport.mjs';

/**
 * @class win11React.src.containers.background.MainContainer
 * @extends Neo.container.Viewport
 */
class mainContainer extends Viewport {
  static getConfig() {
    return {
      className: 'win11React.src.containers.background.mainContainer',
      autoMount: true,
      controller: mainContainerController,
      layout: { ntype: 'vbox', align: 'stretch' },
      style: { padding: '20px' },

      items: [{
        module: Toolbar,
        flex: 'none',
        items: [{
          module: Button,
          disabled: true,
          flag: 'open-dialog-button',
          handler: 'onCreateDialogButtonClick',
          iconCls: 'far fa-window-maximize',
          text: 'Create Dialog'
        }]
      }, {
        ntype: 'component',
        flex: 1,
        html: '#2',

        style: {
          alignItems: 'center',
          color: '#bbb',
          display: 'flex',
          fontSize: '200px',
          justifyContent: 'center',
          userSelect: 'none'
        }
      }]
    }
  }
}

Neo.applyClassConfig(mainContainer);

export { mainContainer as default };