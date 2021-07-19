export const refresh = (dispatch) =>{
  dispatch({type: 'MENUHIDE'});
  dispatch({type: 'DESKHIDE'});
  setTimeout(()=>dispatch({type: 'DESKSHOW'}), 100);
}
