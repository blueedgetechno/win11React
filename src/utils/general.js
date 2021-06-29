import React from 'react';

const Icon = (props)=>{
  return (
    <div className="wnicon">
      <div
        className="uicon"
        style={{
          backgroundImage: `url(${`/img/icon/ui/${props.src}`})`
        }}></div>
    </div>
  );
}

export const Icon;
