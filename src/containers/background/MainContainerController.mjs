import ComponentController from 'neo.mjs/src/controller/Component.mjs';
import { Component } from 'react';

/**
 * @class SharedDialog2.view.MainContainerController
 * @extends Neo.controller.Component
 */
class MainContainerController extends ComponentController {
  static getConfig() {
    return {
      /**
       * @member { String } className='SharedDialog2.view.MainContainerController'
       * @protected
       */
      className: 'SharedDialog2.view.MainContainerController'
    }
  }

  /**
   * 
   * @param { Object } data
   * @param { String } appName
   */
  createDialog(data, appName) {
    let me = this;

    me.enableOpenDialogButtons(false);

    me.dialog = Neo.create(DemoDialog, {
      animateTargetId: data.component.id,
      appName: appName,
      boundaryContainerId: null,
      cls: [me.currentTheme, 'neo-dialog', 'neo-panel', 'neo-container'],
      
      dragZoneConfig: {
        alwaysFireDragMove: true
      },

      listeners: {
        close: me.onDialogClose,
        dragZoneCreated: me.onDragZoneCreated,
        scope: me
      }
    });
  }

  /**
   * 
   * @param { Boolean } enable
   */
  enableOpenDialogButtons(enable) {
    this.getOpenDialogButtons().forEach(button => {
      button.disabled = !enable;
    });
  }

  /**
   * 
   */
   getOpenDialogButtons() {
    return ComponentManager.find({
      flag: 'open-dialog-button'
    });
  }

  /**
   * 
   * @param { Object } data
   */
  onDragZoneCreated(data) {
    let me = this;

    data.dragZone.on({
      dragEnd: me.onDragEnd,
      dragMove: me.onDragMove,
      dragStart: me.onDragStart,
      scope: me
    });
  }

  /**
   * 
   * @param { Object } data
   */
  onDragStart(data) {
    if (this.hasDockedWindow()) {
      let me = this,
          appName = me.view.appName,
          dockedHorizontal = me.dockedWindowSide === 'left' || me.dockedWindowSide === 'right';

      me.dialogRect = data.dragElementRect;

      for (let item of data.eventData.path) {
        if (item.tagName === 'body') {
          me.dragStartWindowRect = item.rect;
          break;
        }
      }

      if (me.hasDockedWindow()) {
        Neo.Main.getWindowData({
          appName: me.dialog.appName === appName ? me.dockedWindowAppName: appName
        }).then(data => {
          me.targetWindowSize = dockedHorizontal ? data.innerWidth: data.innerHeight;
        });
      }
    }
  }

  /**
   * 
   * @param { Object } data
   */
  onDragMove(data) {
    if (this.hasDockedWindow()) {
      let me = this,
          dialogRect = me.dialogRect,
          dockedWindowAppName = me.dockedWindowAppName,
          dragStartWindowRect = me.dragStartWindowRect,
          proxyRect = Rectangle.moveTo(dialogRect, data.clientX - data.offsetX, data.clientY - data.offsetY),
          side = me.dockedWindowSide,
          proxyPosition, vdom;

      // In case that we trigger the drag:start inside of the docked window,
      // we can keep the same logic with just flipping the side.
      if (me.dialog.appName === dockedWindowAppName) {
        dockedWindowAppName = me.view.appName;
        side = me.getOppositeSide(me.dockedWindowSide);
      }

      if (Rectangle.leavesSide(dragStartWindowRect, proxyRect, side)) {
        proxyPosition = me.getProxyPosition(proxyRect, side);

        if (!me.dockedWindowProxy) {
          vdom = Neo.clone(me.dialog.dragZone.dragProxy.vdom, true);

          delete vdom.id;

          Object.assign(vdom.style, {
            ...proxyPosition,
            transform: 'none',
            transitionProperty: 'none'
          });

          me.dockedWindowProxy = Neo.create({
            module: Component,
            appName: dockedWindowAppName,
            autoMount: true,
            autoRender: true,
            cls: ['neo-dialog-wrapper'],
            renderTo: 'document.body',
            vdom: vdom
          });
        } else {
          me.updateDockedWindowProxyStyle({
            ...proxyPosition,
            visibility: null,
          });
        }
      } else {
        me.updateDockedWindowProxyStyle({ visibility: 'hidden' });
      }
    }
  }

  onDragEnd(data) {
    if (this.hasDockedWindow()) {
      let me = this,
          dialog = me.dialog,
          dragStartWindowRect = me.dragStartWindowRect,
          proxyRect = Rectangle.moveTo(me.dialogRect, data.clientX - data.offsetX, data.clientY - data.offsetY),
          side = me.dockedWindowSide;

      if (dialog.appName === me.dockedWindowAppName) {
        side = me.getOppositeSide(me.dockedWindowSide);
      }

      if (Rectangle.leavesSide(dragStartWindowRect, proxyRect, side)) {
        if (Rectangle.excludes(dragStartWindowRect, proxyRect)) {
          me.mountDialogInOtherWindow({
            proxyRect: proxyRect
          });
        } else {
          me.dropDialogBetweenWindows(proxyRect);
        }
      }
    }
  }

  /**
   * 
   * @param { Object } data
   * @param { Object } data.proxyRect
   * @param { Boolean } [data.fullyIncludeIntoWindow]
   */
  mountDialogInOtherWindow(data) {
    let me = this,
        appName = me.view.appName,
        dialog = me.dialog,
        dragEndWindowAppName = me.dockedWindowAppName,
        side = me.dockedWindowSide,
        proxyPosition, wrapperStyle;

    if(dialog.appName === dragEndWindowAppName) {
      dragEndWindowAppName = me.view.appName;
      side = me.getOppositeSide(me.dockedWindowSide);
    }

    proxyPosition = me.getProxyPosition(data.proxyRect, side, data.fullyIncludeIntoWindow);

    dialog.unmount();

    // We need a delay to ensure that dialog.Base:onDragEnd() is most certainly done.
    // We could use the dragEnd event of the dragZone instead.
    setTimeout(() => {
      dialog.appName = dialog.appName === dragEndWindowAppName ? appName: dragEndWindowAppName;
      me.getOpenDialogButtons().forEach(button => {
        if (button.appName === dialog.appName) {
          dialog.animateTargetId = button.id;
        }
      });

      wrapperStyle = dialog.wrapperStyle;

      wrapperStyle.left = proxyPosition.left;
      wrapperStyle.top = proxyPosition.top;

      dialog.wrapperStyle = wrapperStyle;

      me.destroyDockedWindowProxy();

      dialog.mount();
    }, 70);
  }
}

Neo.applyClassConfig(MainContainerController);

export { MainContainerController as default };