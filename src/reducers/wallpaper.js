var wps = localStorage.getItem("wps") || 0;
var locked = localStorage.getItem("locked");

const walls = [
  "default/img0.jpg",
  "default/img1.jpg",
  "ThemeA/img0.jpg",
  "ThemeA/img1.jpg",
  "ThemeA/img2.jpg",
  "ThemeA/img3.jpg",
  "ThemeB/img0.jpg",
  "ThemeB/img1.jpg",
  "ThemeB/img2.jpg",
  "ThemeB/img3.jpg",
  "ThemeC/img0.jpg",
  "ThemeC/img1.jpg",
  "ThemeC/img2.jpg",
  "ThemeC/img3.jpg",
  "ThemeD/img0.jpg",
  "ThemeD/img1.jpg",
  "ThemeD/img2.jpg",
  "ThemeD/img3.jpg",
]

const defState = {
  wps: wps,
  src: walls[wps],
  locked: !(locked=='false'),
  booted: false,
  act: '',
  dir: 0
}

const wallReducer = (state = defState, action) => {
  switch (action.type) {
    case 'WALLUNLOCK':
      localStorage.setItem("locked", false)
      return {
        ...state, locked: false, dir: 0
      };
    case 'WALLNEXT':
      var twps = (state.wps + 1) % walls.length;
      localStorage.setItem("wps", twps)
      return {
        ...state, wps: twps,
          src: walls[twps]
      };
    case 'WALLALOCK':
      return {
        ...state, locked: true, dir: -1
      };
    case 'WALLBOOTED':
      return {
        ...state, booted: true, dir: 0, act: ''
      };
    case 'WALLRESTART':
      return {
        ...state, booted: false, dir: -1,
          locked: true, act: 'restart'
      };
    case 'WALLSHUTDN':
      return {
        ...state, booted: false, dir: -1,
          locked: true, act: 'shutdn'
      };
    default:
      return state
  }
}

export default wallReducer;
