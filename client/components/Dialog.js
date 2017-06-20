import React from 'react'
import { render } from 'react-dom'
export function open(content) {
  const target = document.body.querySelector('[name=reactDialog]');
  if(target){
    render(content,target);
  }else{
    var div = document.createElement('div');
    div.setAttribute('name','reactDialog');
    document.body.appendChild(div);
    render(content,div);
  }
}

export function rightClickMenu(content){
  let div = document.querySelector('.context-modal');
  if(!div){
    div = document.createElement('div');
    div.className = 'context-modal';
    document.body.appendChild(div);
  }else{
    if(div.firstChild){
      div.removeChild(div.firstChild);
    }
  }
  render(content,div);
}

export function closeWin(selector){
  let div = document.querySelector(selector);
  if(div && div.firstChild){
    div.removeChild(div.firstChild);
  }
}