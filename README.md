# Win11 in React!

[![Follow me](https://img.shields.io/github/followers/blueedgetechno?label=follow%20me&style=social)](https://github.com/blueedgetechno)
[![Follow Twitter](https://img.shields.io/twitter/follow/blueedgetechno?label=Follow%20me&style=social)](https://twitter.com/blueedgetechno)
[![Join](https://img.shields.io/discord/868499076432408627.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/mT3MTpeZ)
[![Build](https://github.com/blueedgetechno/win11React/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/blueedgetechno/win11React/actions/workflows/deploy.yml)
![Uptime](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/win11react/status/master/api/win11-react/uptime.json)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/blueedgetechno)

This open source project is made in the hope to replicate the Windows 11 desktop experience on web, using standard web technologies like React, CSS (SCSS), and JS.

## Notice
>#### This project is **not in anyway affiliated with Microsoft** and **should not be confused with Microsoft’s Operating System** or Products.
>#### This is also not Windows 365 cloud PC.

**THIS IS NOT THE APP STORE REPO**

[App Store](https://github.com/win11react/store)

 #### Live Experience🌈: [win11.blueedge.me](https://win11.blueedge.me)

![home](./public/img/home.jpg)

# Gallery

![image](https://user-images.githubusercontent.com/89068816/154832868-6ec81a0b-0bc3-4e77-a4bf-3391b852fe9c.png)

![pic1](./public/img/gallery2.jpg)

![image](https://user-images.githubusercontent.com/89068816/154832942-b3e435dd-5fe4-4bc1-a9be-34262698625d.png)

# Why

WHY NOT? Why not just waste a week of your life creating a React project, just to cover up your insecurities of how incompetent you are. Just why not!

# Features
- [x] Start Menu, Search Menu and Widgets
- [x] Desktop and Right Click action
- [x] Side Navigation and Calendar View
- [x] Snap windows in different layouts
- [x] Browser, Store, Terminal, Calculator
- [x] Notepad, Vscode, Whiteboard
- [x] File Explorer + Setting
- [x] Drag and Resize windows
- [x] Startup and Lock screen
- [x] Themes and Background

📑 [suggest more](https://github.com/blueedgetechno/win11React/issues/new/choose)

# Stack

- Framework - React (^17.0.2) + Redux
- Component/UI Library - None!!
- Styling Solution - SCSS and CSS Modules (tailwind).
- Icons - fontawesome

## FAQ

- Is this the full operating system?
  - No, This is not a full operating system and It is also not affiliated by Microsoft in anyway.

- How long did it take? 
  - Honestly It took 2-3 days collecting assets, 2-3 planning and about 6 days programming it.


- Did you use any UI/Library?
  - No.


- Can I contribute?
  - Yes, you can! Open an issue, create a pull request, head over to [discussions](https://github.com/blueedgetechno/win11React/discussions) or join the [discord](https://discord.gg/qmEZwUhb4b).


- Where did you get the inspiration from, if you have?
  - I got the inspiration from [this youtube video](https://www.youtube.com/watch?v=OtOmxa9UMe8).


- What is the answer of Life, the Universe, and Everything?
  - 42

    ![answer](./public/answer.png)
## Local Deployment

# Docker

To use docker use the following command ``` docker run -d  --restart unless-stopped --name win11react -p 3000:3000 blueedge/win11react:latest ```

# Homeassistant

[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Funofficial-skills%2Faddons)

# Balena-Cloud

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/blueedgetechno/win11React)

--------------------------------------------------------------------------------------------------------

# Compiled

You can find a compiled `.exe` in the **Releases** section or via clicking [HERE](https://github.com/blueedgetechno/win11React/releases)

**WINGET - WINDOWS PACKAGE MANAGER**

If you have one of the latest windows builds then you can enter the command below in **CMD**

``` winget install blueedge.win11react ```

-----------------------------------------

**APT/DEBIAN/UBUNTU**

AMD64 ONLY

``` curl -s --compressed "https://projects.asylum-os.com/apt/KEY.gpg" | sudo apt-key add - ```

``` sudo curl -s --compressed -o /etc/apt/sources.list.d/asylum.list "https://projects.asylum-os.com/apt/apt.list" ```

``` sudo apt update ```

``` sudo apt install win11in-react ```



## Online Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fblueedgetechno%2Fwin11React&envs=PORT&PORTDesc=Port+of+the+application&PORTDefault=3000&referralCode=BatemaDevelopment)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/blueedgetechno/win11React)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fblueedgetechno%2Fwindows11%2F&project-name=windows11&repo-name=windows11-react&demo-title=Windows%2011%20Demo&demo-description=Static&demo-url=https%3A%2F%2Fwin11.blueedge.me%2F)

## Contributors
<a href="https://github.com/blueedgetechno/win11React/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=blueedgetechno/win11React" />
</a>

### Known Issues

- Blur not working in Firefox browser.

###### Solution:

1. Open `about:config` in your firefox browser.
2. Search for `layout.css.backdrop-filter.enabled` and set it to `true`.

## License

⚖️ CC0-1.0 License
