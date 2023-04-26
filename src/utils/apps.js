import { installApp } from "../actions";
import store from "../containers/applications/apps/assets/advancedstore.json";
import { externalLink } from "../data/constant";

export const gene_name = () =>
  Math.random().toString(36).substring(2, 10).toUpperCase();

// let installed = JSON.parse(localStorage.getItem("installed") || "[]");
// console.log(installed);
// let installed = [store.at(1)]
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
      desc: "Visual Studio Code is a free, lightweight, and extensible code editor for building web, desktop, and mobile applications, using any programming language and framework.\nVisual Studio Code has built-in support for Git source control management and powerful integrations with GitHub, an integrated debugger, and smart code completion with IntelliSense and with Al-driven IntelliCode. With over 30,000 extensions and themes in the Visual Studio Code Marketplace, you can customize the features and the look of Visual Studio Code to fit your needs, preferences, and style.\nYou can use Visual Studio Code to build any kind of app, for web, desktop, and mobile. Visual Studio Code supports JavaScript and TypeScript natively and offers extensions for coding in languages such as Python, Java, C/C++, C#, Go, Rust, PHP, and many more.",
      feat: "Fast, Powerful Editing-Linting, multi-cursor editing, parameter hints, and other powerful editing features.\nOver 30,000 extensions, and growing - Enable additional languages, themes, debuggers, commands, and more. VS Code's growing community shares their secret sauce to improve your workflow.\nBuild any app type, using any programming language and framework, including JavaScript and TypeScript, Python, Java, C/C++, C#, Go, Rust, PHP, and many more, as well as many popular technologies.\nSupport for notebooks including Jupyter, for data science and Al development.\nBuilt-in support for Git source control management and integrations with GitHub for managing issues and pull requests.\nIntelligent Code Completion - IntelliSense and Al-driven IntelliCode offer completions for variables, methods, and imported modules.\nRich Debugging-Print debugging is a thing of the past. Use debugging tools directly in VS Code.\nWrite code from anywhere with the Visual Studio Code Remote extensions and support for GitHub Codespaces.",
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
    type: "any",
    action: "EXTERNAL",
    payload: externalLink.SERVICE_LINK,
  },
  {
    name: "Document",
    icon: "doc",
    type: "any",
    action: "EXTERNAL",
    payload: externalLink.DOCUMENT_LINK,
  },
  {
    name: "Pricing",
    icon: "pricing",
    type: "any",
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
    type: "any",
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
    action: "DISCORD",
  },
];

for (let i = 0; i < installed.length; i++) {
  installed[i].action = gene_name();
  apps.push(installed[i]);
}

export default apps;
