import icons from './apps';

var {taskbar,
  desktop,
  pinned,
  recent} = {
  taskbar: ["Settings","File Explorer","Edge","Store","Spotify"],
  desktop: ["Blue","Unescape","Recycle Bin","File Explorer","Store",
      "Edge","Github","Spotify","Minecraft","Krunker","Smash karts"],
  pinned: ["Edge","Word","PowerPoint","OneNote","Mail","To Do","Store",
          "Photos","Your Phone","Notepad","White Board","Calculator",
          "Spotify","Twitter","VS Code","Terminal","Github","Discord"],
  recent: ["Mail","Twitter","Terminal","Github","VS Code","Spotify","Edge"]
};

export const taskApps = icons.filter(x=>taskbar.includes(x.name));

export const desktopApps = icons.filter(x=>desktop.includes(x.name)).sort((a,b)=>{
  return desktop.indexOf(a.name)>desktop.indexOf(b.name)?1:-1;
});

export const pinnedApps = icons.filter(x=>pinned.includes(x.name)).sort((a,b)=>{
  return pinned.indexOf(a.name)>pinned.indexOf(b.name)?1:-1;
});

export const recentApps = icons.filter(x=>recent.includes(x.name)).sort((a,b)=>{
  return recent.indexOf(a.name)>recent.indexOf(b.name)?1:-1;
});;

export const allApps = icons.filter(app=>{
  return app.type=='app'
});
