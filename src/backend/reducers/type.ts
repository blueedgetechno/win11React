export type Reducer = {
    params: any;
    user: any;
    wallpaper: any;
    taskbar: any;
    desktop: any;
    startmenu: any;
    sidepane: any;
    apps: any;
    menus: any;
    globals: any;
    setting: any;
    files: any;
    worker: any;
    modal: any;
};

export type Action = {
    type: string;
    name?: string;
    dim?: string;
    payload: any;
};
