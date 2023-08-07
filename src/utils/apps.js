import { externalLink } from "../data/constant";

export const gene_name = () =>
  Math.random().toString(36).substring(2, 10).toUpperCase();

let installed = [];
const apps = [
  {
    name: "Visual Studio Code",
    icon: "https://raw.githubusercontent.com/blueedgetechno/win11React/master/public/img/icon/code.png",
    type: "app",
    action: gene_name(),
    data: {
      type: "IFrame",
      url: "https://github1s.com/thinkonmay/thinkshare-v2",
      invert: true,
    },
    hide: true,
    pwa: true,
    full: true,
  },
  {
    name: "Python Compiler",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png",
    type: "app",
    action: gene_name(),
    data: {
      type: "IFrame",
      url: "https://www.programiz.com/python-programming/online-compiler/",
    },
    hide: true,
    pwa: true,
    full: true,
  },

  {
    name: "Start",
    icon: "home",
    type: "action",
    action: "STARTMENU",
  },
  {
    name: "Search",
    icon: "search",
    type: "action",
    action: "SEARCHMENU",
  },
  {
    name: "Widget",
    icon: "widget",
    type: "action",
    action: "WIDGETS",
  },
  {
    name: "Settings",
    icon: "settings",
    type: "app",
    action: "SETTINGS",
  },
  {
    name: "Task Manager",
    icon: "taskmanager",
    type: "app",
    action: "TASKMANAGER",
  },
  {
    name: "File Explorer",
    icon: "explorer",
    type: "app",
    action: "EXPLORER",
  },
  {
    name: "Worker Profile",
    icon: "worker",
    type: "app",
    action: "WORKER",
  },
  {
    name: "Browser",
    icon: "edge",
    type: "app",
    action: "MSEDGE",
  },
  {
    name: "Store",
    icon: "store",
    type: "app",
    action: "WNSTORE",
  },
  {
    name: "Recycle Bin",
    icon: "bin0",
    type: "app",
  },
  {
    name: "Blue",
    icon: "win/user",
    type: "short",
  },
  {
    name: "Alarms",
    icon: "alarm",
    type: "app",
  },
  {
    name: "Calculator",
    icon: "calculator",
    type: "app",
    action: "CALCUAPP",
  },
  {
    name: "Calendar",
    icon: "calendar",
    type: "app",
  },
  {
    name: "Camera",
    icon: "camera",
    type: "app",
    action: "CAMERA",
  },
  {
    name: "Your Phone",
    icon: "yphone",
    type: "app",
  },
  {
    name: "Feedback",
    icon: "feedback",
    type: "app",
  },
  {
    name: "Get Started",
    icon: "getstarted",
    type: "app",
    action: "OOBE",
  },
  {
    name: "Groove Music",
    icon: "groove",
    type: "app",
  },
  {
    name: "Help",
    icon: "help",
    type: "app",
    action: "EXTERNAL",
    payload: externalLink.DOCUMENT_LINK,
  },
  {
    name: "Our Service",
    icon: "doc",
    type: "app",
    action: "EXTERNAL",
    payload: externalLink.SERVICE_LINK,
  },
  {
    name: "Document",
    icon: "doc",
    type: "app",
    action: "EXTERNAL",
    payload: externalLink.DOCUMENT_LINK,
  },
  {
    name: "Pricing",
    icon: "pricing",
    type: "app",
    action: "EXTERNAL",
    payload: externalLink.PRICING_LINK,
  },
  {
    name: "Contact Us",
    icon: "mail",
    type: "app",
    action: "EXTERNAL",
    payload: externalLink.MAILTO_ADDRESS,
  },
  {
    name: "About Us",
    icon: "about",
    type: "app",
    action: "DESKABOUT",
  },
  {
    name: "Yammer",
    icon: "yammer",
    type: "app",
  },
  {
    name: "Movies",
    icon: "movies",
    type: "app",
  },
  {
    name: "Xbox",
    icon: "xbox",
    type: "app",
  },
  {
    name: "Office",
    icon: "msoffice",
    type: "app",
  },
  {
    name: "Narrator",
    icon: "narrator",
    type: "app",
  },
  {
    name: "News",
    icon: "news",
    type: "app",
  },
  {
    name: "Notepad",
    icon: "notepad",
    type: "app",
    action: "NOTEPAD",
  },
  {
    name: "Sticky Notes",
    icon: "notes",
    type: "app",
  },
  {
    name: "OneDrive",
    icon: "oneDrive",
    type: "app",
  },
  {
    name: "OneNote",
    icon: "onenote",
    type: "app",
  },
  {
    name: "Outlook",
    icon: "outlook",
    type: "app",
  },
  {
    name: "People",
    icon: "people",
    type: "app",
  },
  {
    name: "Photos",
    icon: "photos",
    type: "app",
  },
  {
    name: "Security",
    icon: "security",
    type: "app",
  },
  {
    name: "Spotify",
    icon: "spotify",
    type: "app",
    action: "SPOTIFY",
  },
  {
    name: "Sharepoint",
    icon: "share",
    type: "app",
  },
  {
    name: "Skype",
    icon: "skype",
    type: "app",
  },
  {
    name: "Snipping Tool",
    icon: "snip",
    type: "app",
  },
  {
    name: "Teams",
    icon: "teams",
    type: "app",
  },
  {
    name: "Terminal",
    icon: "terminal",
    type: "app",
    action: "TERMINAL",
  },
  {
    name: "Tips",
    icon: "tips",
    type: "app",
  },
  {
    name: "To Do",
    icon: "todo",
    type: "app",
  },
  {
    name: "Maps",
    icon: "maps",
    type: "app",
  },
  {
    name: "Voice Recorder",
    icon: "voice",
    type: "app",
  },
  {
    name: "Weather",
    icon: "weather",
    type: "app",
  },
  {
    name: "Whiteboard",
    icon: "board",
    type: "app",
    action: "WHITEBOARD",
  },
  {
    name: "Cortana",
    icon: "cortana",
    type: "app",
  },
  {
    name: "Github",
    icon: "github",
    type: "app",
    action: "EXTERNAL",
    payload: externalLink.GITHUB_LINK,
  },
  //TODO: change discord channel.
  {
    name: "Discord",
    icon: "discord",
    type: "app",
    action: "EXTERNAL",
    payload: externalLink.DISCORD_LINK,
  },
  {
    name: "Thinkmay Fanpage",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png",
    type: "app",
    action: "EXTERNAL",
    payload: externalLink.FACEBOOK_LINK,
  }
];

for (let i = 0; i < installed.length; i++) {
  installed[i].action = gene_name();
  apps.push(installed[i]);
}

export default apps;
