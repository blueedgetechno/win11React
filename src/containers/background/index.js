import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import './back.css';

const Background = ()=>{
  const wallpaper = useSelector(state => state.wallpaper);
  const dispatch = useDispatch();

  return (
    <div className="background" style={{
      backgroundImage: `url(${`/img/wallpaper/${wallpaper.theme}/${wallpaper.src}`})`
    }}>
    </div>
  );
}

export default Background;
