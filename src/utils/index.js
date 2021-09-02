import icons from './apps';

var iconIdx = {
  taskbar: [3,4,5,6,39],
  desktop: [8,55,7,4,6,5,54,39,57,58,59],
  pinned: [5,51,37,31,21,48,6,35,15,28,52,10,39,44,13,46,54,56],
  recent: [21,44,46,54,13,39,5]
};

export const desktopApps = iconIdx.desktop.map(x=>{
  return icons[x]
});

export const pinnedApps = iconIdx.pinned.map(x=>{
  return icons[x]
});

export const recentApps = iconIdx.recent.map(x=>{
  var obj = icons[x];
  obj.lastUsed = Math.floor(Math.random()*400) - 40;
  return obj
});

export const allApps = icons.filter(app=>{
  return app.type=='app'
});

export const taskApps = iconIdx.taskbar.map(x=>{
  return icons[x]
});
