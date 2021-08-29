import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image} from '../../utils/general';

import './back.css';

export const Background = ()=>{
  const wallpaper = useSelector(state => state.wallpaper);
  const dispatch = useDispatch();

  return (
    <div className="background" style={{
      backgroundImage: `url(${`/img/wallpaper/${wallpaper.theme}/${wallpaper.src}`})`
    }}>
    </div>
  );
}

export const BootScreen = ()=>{
  const wallpaper = useSelector(state => state.wallpaper);
  const dispatch = useDispatch();

  return (
    <div className="bootscreen">
      <Image src="asset/bootlogo" w={160}/>
    </div>
  );
}
