import icons from './icons';

var iconIdx = {
  taskbar: [3,4,5,6],
  desktop: [8,7,4,6,5,54,55],
  pinned: [5,51,37,31,21,48,6,35,15,28,52,10,11,44,39,13,46,54],
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
