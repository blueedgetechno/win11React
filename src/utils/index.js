import icons from "./apps";

var { taskbar, desktop, pinned, recent } = {
  taskbar: ["Store"],
  desktop: [
    "Worker Profile",
    "Guideline",
    "Browser",
    "FeedBack",
    "Discord",
    "Thinkmay Fanpage",
    "Store",
    "Payment"
  ],
  pinned: [
    "Browser",
    "Get Started",
    "Mail",
    "Store",
    "Notepad",
    "Whiteboard",
    "Calculator",
    "Spotify",
    "Twitter",
    "Terminal",
    "Github",
    "Discord",
    "Camera",
    "Thinkmay Fanpage",
  ],
  recent: [
    "Mail",
    "Twitter",
    "Terminal",
    "Github",
    "File Explorer",
    "Spotify",
    "Edge",
  ],
};

// if (desktop.includes("Buy me a coffee") === false) {
//   desktop.push("Buy me a coffee");
// }

export const taskApps = icons.filter((x) => taskbar.includes(x.name));

export const desktopApps = icons
  .filter((x) => desktop.includes(x.name))
  .sort((a, b) => {
    return desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1;
  });

export const pinnedApps = icons
  .filter((x) => pinned.includes(x.name))
  .sort((a, b) => {
    return pinned.indexOf(a.name) > pinned.indexOf(b.name) ? 1 : -1;
  });

export const recentApps = icons
  .filter((x) => recent.includes(x.name))
  .sort((a, b) => {
    return recent.indexOf(a.name) > recent.indexOf(b.name) ? 1 : -1;
  });

export const allApps = icons.filter((app) => {
  return app.type === "app";
});

export const dfApps = {
  taskbar,
  desktop,
  pinned,
  recent,
};
