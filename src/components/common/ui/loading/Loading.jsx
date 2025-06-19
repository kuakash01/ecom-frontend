import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center h-full fixed top-0 left-0 right-0 bottom-0 z-99999 bg-[rgba(0,0,0,0.5)]">
      {/* <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute w-full h-full bg-blue-500 opacity-75 animate-ping rounded-lg"></div>
        <div className="relative w-16 h-16  bg-white shadow-lg rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div> */}
      

<div className="spinner"></div>
      <style>{`
.spinner {
 --size: 30px;
 --first-block-clr: #03fcf8;
 --second-block-clr: #ff9900;
 --clr: #111;
 width: 100px;
 height: 100px;
 position: relative;
}

.spinner::after,.spinner::before {
 box-sizing: border-box;
 position: absolute;
 content: "";
 width: var(--size);
 height: var(--size);
 top: 50%;
 animation: up 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
 left: 50%;
 background: var(--first-block-clr);
}

.spinner::after {
 background: var(--second-block-clr);
 top: calc(50% - var(--size));
 left: calc(50% - var(--size));
 animation: down 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
}

@keyframes down {
 0%, 100% {
  transform: none;
 }

 25% {
  transform: translateX(100%);
 }

 50% {
  transform: translateX(100%) translateY(100%);
 }

 75% {
  transform: translateY(100%);
 }
}

@keyframes up {
 0%, 100% {
  transform: none;
 }

 25% {
  transform: translateX(-100%);
 }

 50% {
  transform: translateX(-100%) translateY(-100%);
 }

 75% {
  transform: translateY(-100%);
 }
}
`}</style>
    </div>
  );
}

export default Loading;
