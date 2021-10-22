import store from '../reducers'

export const refresh = (pl, menu) =>{
  if(menu.menus.desk[0].opts[4].check){
    store.dispatch({type: 'DESKHIDE'});
    setTimeout(()=>store.dispatch({type: 'DESKSHOW'}), 100);
  }
}

export const changeIconSize = (size, menu) =>{
  var tmpMenu = {...menu};
  tmpMenu.menus.desk[0].opts[0].dot = false;
  tmpMenu.menus.desk[0].opts[1].dot = false;
  tmpMenu.menus.desk[0].opts[2].dot = false;
  var isize = 1;

  if(size=="large"){
    tmpMenu.menus.desk[0].opts[0].dot = true;
    isize = 1.5;
  }else if (size=="medium") {
    tmpMenu.menus.desk[0].opts[1].dot = true;
    isize = 1.2;
  }else{
    tmpMenu.menus.desk[0].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({type: "DESKSIZE", payload: isize});
  store.dispatch({type: "MENUCHNG", payload: tmpMenu});
}

export const deskHide = (payload, menu) =>{
  var tmpMenu = {...menu};
  tmpMenu.menus.desk[0].opts[4].check ^= 1;

  store.dispatch({type: "DESKTOGG"});
  store.dispatch({type: "MENUCHNG", payload: tmpMenu});
}

export const changeSort = (sort, menu) =>{
  var tmpMenu = {...menu};
  tmpMenu.menus.desk[1].opts[0].dot = false;
  tmpMenu.menus.desk[1].opts[1].dot = false;
  tmpMenu.menus.desk[1].opts[2].dot = false;
  if(sort=="name"){
    tmpMenu.menus.desk[1].opts[0].dot = true;
  }else if (sort=="size") {
    tmpMenu.menus.desk[1].opts[1].dot = true;
  }else{
    tmpMenu.menus.desk[1].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({type: "DESKSORT", payload: sort});
  store.dispatch({type: "MENUCHNG", payload: tmpMenu});
}

export const changeTaskAlign = (align, menu) =>{
  var tmpMenu = {...menu};
  if(
    tmpMenu.menus.task[0].opts[align=="left"?0:1].dot
  ) return;

  tmpMenu.menus.task[0].opts[0].dot = false;
  tmpMenu.menus.task[0].opts[1].dot = false;

  if(align=="left"){
    tmpMenu.menus.task[0].opts[0].dot = true;
  }else{
    tmpMenu.menus.task[0].opts[1].dot = true;
  }

  store.dispatch({type: "TASKTOG"});
  store.dispatch({type: "MENUCHNG", payload: tmpMenu});
}

export const performApp = (act, menu)=>{
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload
  }

  if(act=="open"){
    if(data.type) store.dispatch(data)
  }else if (act=="delshort") {
    if(data.type) store.dispatch({
      type: "DESKREM",
      payload: data
    })
  }
}
