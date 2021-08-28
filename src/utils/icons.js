'use babel';
import React from 'react'

export const home = (props) => {
  return (
    <svg
    viewBox="0 0 512 512"
    width={24}
    height={24}
    {...props}>
    <path
      d="M448 463.746H298.667V314.413h-85.334v149.333H64V148.318L256 36.572l192 110.984v316.19z"
      fill="currentColor"
    />
  </svg>
  )
}

export const shuffle = (props) => {
  return (
    <svg
      viewBox="0 0 16 16"
      height={16}
      width={16}
      {...props}>
      <path d="M4.5 6.8l.7-.8C4.1 4.7 2.5 4 .9 4v1c1.3 0 2.6.6 3.5 1.6l.1.2zm7.5 4.7c-1.2 0-2.3-.5-3.2-1.3l-.6.8c1 1 2.4 1.5 3.8 1.5V14l3.5-2-3.5-2v1.5zm0-6V7l3.5-2L12 3v1.5c-1.6 0-3.2.7-4.2 2l-3.4 3.9c-.9 1-2.2 1.6-3.5 1.6v1c1.6 0 3.2-.7 4.2-2l3.4-3.9c.9-1 2.2-1.6 3.5-1.6z" />
    </svg>
  )
}

export const previous = (props) => {
  return (
    <svg
      height={16}
      width={16}
      viewBox="0 0 16 16"
      {...props}>
      <path d="M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z" />
    </svg>
  )
}

export const next = (props) => {
  return (
    <svg
      height={16}
      width={16}
      viewBox="0 0 16 16"
      {...props}>
      <path d="M11 3v4.119L3 2.5v11l8-4.619V13h2V3z" />
    </svg>
  )
}

export const repeat = (props) => {
  return (
    <svg
      height={16}
      width={16}
      viewBox="0 0 16 16"
      {...props}>
      <path d="M5.5 5H10v1.5l3.5-2-3.5-2V4H5.5C3 4 1 6 1 8.5c0 .6.1 1.2.4 1.8l.9-.5C2.1 9.4 2 9 2 8.5 2 6.6 3.6 5 5.5 5zm9.1 1.7l-.9.5c.2.4.3.8.3 1.3 0 1.9-1.6 3.5-3.5 3.5H6v-1.5l-3.5 2 3.5 2V13h4.5C13 13 15 11 15 8.5c0-.6-.1-1.2-.4-1.8z" />
    </svg>
  )
}

export const play = (props) => {
  return (
    <svg
      height={16}
      width={16}
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M4.018 14L14.41 8 4.018 2z" />
    </svg>
  )
}

export const pause = (props) => {
  return (
    <svg
      height={16}
      width={16}
      viewBox="0 0 16 16"
      {...props}
    >
      <path fill="none" d="M0 0h16v16H0z" />
      <path d="M3 2h3v12H3zm7 0h3v12h-3z" />
    </svg>
  )
}

export const search = (props) => {
  return (
    <svg
      height={24}
      width={24}
      viewBox="0 0 512 512"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M349.714 347.937l93.714 109.969-16.254 13.969-93.969-109.969q-48.508 36.825-109.207 36.825-36.826 0-70.476-14.349t-57.905-38.603-38.603-57.905-14.349-70.476 14.349-70.476 38.603-57.905 57.905-38.603 70.476-14.349 70.476 14.349 57.905 38.603 38.603 57.905 14.349 70.476q0 37.841-14.73 71.619t-40.889 58.921zM224 377.397q43.428 0 80.254-21.461t58.286-58.286 21.461-80.254-21.461-80.254-58.286-58.285T224 57.397t-80.254 21.46-58.285 58.285-21.46 80.254 21.46 80.254 58.285 58.286T224 377.397z"
        fill="currentColor"
      />
    </svg>
  )
}
