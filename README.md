# Windows 11 in React!

[![Follow me](https://img.shields.io/github/followers/blueedgetechno?label=follow%20me&style=social)](https://github.com/blueedgetechno)
[![Follow Twitter](https://img.shields.io/twitter/follow/blueedgetechno?label=Follow%20me&style=social)](https://twitter.com/blueedgetechno)
[![Join](https://img.shields.io/discord/868499076432408627.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/qmEZwUhb4b)
[![Build](https://github.com/blueedgetechno/windows11/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/blueedgetechno/windows11/actions/workflows/deploy.yml)
This open source project is made in the hope to replicate the Windows 11 desktop experience on web, using standard web technologies like React, CSS (SCSS), and Js.

 #### Live Experience🌈: [win11.blueedge.me](https://win11.blueedge.me)

![home](./public/img/home.png)

# Gallery
![pic1](./public/img/gallery1.png)

![pic1](./public/img/gallery2.png)

![pic1](./public/img/gallery3.png)

# Why

WHY NOT? Why not just waste a week of your life creating a react project just to coverup your insecurities of how incompetent you are. Just Why not!

# Features
- [x] Start Menu, Search Menu and Widgets
- [x] Desktop and Right Click action
- [x] Side Navigation and Calendar View
- [x] Snap windows in different layouts
- [x] Browser, Store, Terminal, Calculator
- [x] Notepad, Vscode, Whiteboard
- [ ] File Explorer + other apps
- [ ] Drag and Resize windows
- [ ] Startup and Lock screen
- [ ] Themes and Background

📑 [suggest more](https://github.com/blueedgetechno/windows11/issues/new/choose)

# Stack

- Framework - React (^17.0.2) + Redux
- Component/UI Library - None!!
- Styling Solution - SCSS and CSS Modules (tailwind).
- Icons - fontawesome

## FAQ

- How long it took?
  - Honestly It took 2-3 days collecting assets, 2-3 planning and about 6 days programming it.


- Did you use any UI/Library?
  - No.


- Can I contribute?
  - Yes, you can! Open an issue, create a pull request, head over to [discussions](https://github.com/blueedgetechno/windows11/discussions) or join the [discord](https://discord.gg/qmEZwUhb4b).


- Where did you get the inspiration from, if you have?
  - I got the inspiration from [this youtube video](https://www.youtube.com/watch?v=OtOmxa9UMe8).


- What is the answer of Life, the Universe, and Everything?
  - 42

    ![answer](./public/answer.png)
## Docker

To use docker use the following command ``` docker run -d  --restart unless-stopped --name windows11 -p 3000:3000 ghcr.io/blueedgetechno/windows11:master ```

## Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Contributors
<a href="https://github.com/blueedgetechno/windows11/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=blueedgetechno/windows11" />
</a>

### Known Issues

- Blur not working in Firefox browser.

###### Solution:

1. Open `about:config` in your firefox browser.
2. Search for `layout.css.backdrop-filter.enabled` and set it to `true`.

## License

⚖️ CC0-1.0 License
