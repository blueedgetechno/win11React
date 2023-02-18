import { VirtualOSBrowserCore } from 'virtualos-core/dist/src/index';
const key = import.meta.env.VITE_SUPABASE_KEY;
const url = import.meta.env.VITE_SUPABASE_URL;
console.log(key);
console.log(url);

const defineState = {
  name: '',
  value: ''
};
const core = new VirtualOSBrowserCore(url, key);
const userReducer = (state = defineState, action) => {
  switch (action.type) {
    case 'LOGIN': {
      console.log(action.payload);
      return {
        user: state
      };
    }

    case 'GETINFO': {
      console.log(action.payload);
      return {
        ...action.payload
      };
    }
    default:
      return state;
  }
};
export default userReducer;
