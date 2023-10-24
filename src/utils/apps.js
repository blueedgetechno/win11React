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
    name: "Landing page",
    icon: "thinkmay",
    type: "app",
    action: gene_name(),
    data: {
      type: "IFrame",
      url: "https://landing.thinkmay.net",
    },
    hide: true,
    pwa: true,
    full: false,
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
    name: "Time Manager",
    icon: "timemanager",
    type: "app",
    action: "TIMEMANAGER",
  },
  //{
  //  name: "FeedBack",
  //  icon: "feedback",
  //  type: "app",
  //  action: "FEEDBACK",
  //},
  {
    name: "Blue",
    icon: "win/user",
    type: "short",
  },
  {
    name: "Calculator",
    icon: "calculator",
    type: "app",
    action: "CALCUAPP",
  },
  {
    name: "Get Started",
    icon: "getstarted",
    type: "app",
    action: "OOBE",
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
    name: "Guideline",
    icon: "about",
    type: "app",
    action: "DESKABOUT",
  },
  {
    name: "Terminal",
    icon: "terminal",
    type: "app",
    action: "TERMINAL",
  },
  {
    name: "Github",
    icon: "github",
    type: "app",
    action: "EXTERNAL",
    payload: externalLink.GITHUB_LINK,
  },
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
  },
  {
    name: "Demo",
    icon: "https://www.gstatic.com/images/branding/product/1x/forms_512dp.png",
    type: "app",
    action: gene_name(),
    data: {
      type: "IFrame",
      url: "https://forms.gle/ej7RPwGMWqJG3S7p7",
    },
    hide: true,
    pwa: true,
    full: true,
  },
];

for (let i = 0; i < installed.length; i++) {
  installed[i].action = gene_name();
  apps.push(installed[i]);
}

export default apps;
