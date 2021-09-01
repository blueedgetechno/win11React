import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

export const MicroStore = ()=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps.store);
  const dispatch = useDispatch();
  const ribbon = useSelector(state => state.globals.ribbon);
  const apprib = useSelector(state => state.globals.apprib);
  const gamerib = useSelector(state => state.globals.gamerib);
  const movrib = useSelector(state => state.globals.movrib);
  const [tab, setTab] = useState("sthome");

  const clickDispatch = (event)=>{
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };
    if(action.type) dispatch(action);
  }

  const action = (e)=>{
    var x = e.target && e.target.dataset.action;
    if(x){
      var target = document.getElementById(x);
      if(target){
        setTab(x);
        target.parentNode.parentNode.scrollTop = target.offsetTop;
      }
    }
  }

  return (
    <div
      className="wnstore floatTab dpShad" data-size={wnapp.size}
      data-max={wnapp.max} style={{
       ...(wnapp.size=="cstm"?wnapp.dim:null),
       zIndex: wnapp.z
     }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon}
        name="Microsoft Store"/>
      <div className="windowScreen flex">
        <div className="storeNav h-full w-16 flex flex-col">
          <Icon fafa="faHome" onClick={action} click="sthome" width={20} payload={tab=="sthome"}/>
          <Icon fafa="faThLarge" onClick={action} click="apprib" width={18} payload={tab=="apprib"}/>
          <Icon fafa="faGamepad" onClick={action} click="gamerib" width={20} payload={tab=="gamerib"}/>
          <Icon fafa="faFilm" onClick={action} click="movrib" width={20} payload={tab=="movrib"}/>
        </div>
        <div className="restWindow msfull thinScroll">
          <div className="storeSection w-full absolute top-0">
            <Image id="sthome" className="frontPage w-full" src="store/lucacover"/>
            <div className="panelName absolute m-6 text-xl top-0">Home</div>
            <div className="w-full overflow-x-scroll thinScroll overflow-y-hidden -mt-16">
              <div className="storeRibbon">
                {ribbon && ribbon.map(x=>{
                  return x=="unescape"?(
                    <a href="https://blueedge.me/unescape" target="_blank">
                    <Image className="mx-1 dpShad rounded overflow-hidden"
                      var={x} h={100} dir="store/float" src={x}/>
                    </a>
                  ):(
                    <Image className="mx-1 dpShad rounded overflow-hidden"
                      var={x} h={100} dir="store/float" src={x}/>
                  )
                })}
              </div>
            </div>
            <div id="apprib" className="frontCont amzApps my-8 py-20 w-auto mx-8 flex justify-between noscroll overflow-x-scroll overflow-y-hidden">
              <div className="flex w-64 flex-col text-gray-100 h-full px-8">
                <div className="text-xl">Windows Apps</div>
                <div className="text-xs mt-2">Take your windows experience to new heights with these must-have apps</div>
              </div>
              <div className="flex w-max pr-8">
                {apprib && apprib.map(x=>{
                  var stars = 3 + (x.charCodeAt(0)+x.charCodeAt(1))%3;
                  return (
                    <div className="ribcont rounded my-auto p-2 pb-2">
                      <Image className="mx-1 py-1 mb-2 rounded overflow-hidden"
                        w={120} dir="store/apps" src={x}/>
                      <div className="capitalize text-xs font-semibold">{x}</div>
                      <div className="flex mt-2 items-center">
                        <Icon className="bluestar" fafa="faStar" width={6}/>
                        <Icon className="bluestar" fafa="faStar" width={6}/>
                        <Icon className="bluestar" fafa="faStar" width={6}/>
                        <Icon className={stars>3?"bluestar":""} fafa="faStar" width={6}/>
                        <Icon className={stars>4?"bluestar":""} fafa="faStar" width={6}/>
                        <div className="text-xss text-gray-800">{1+x.charCodeAt(3)%5}k</div>
                      </div>
                      <div className="text-xss mt-8">{x.charCodeAt(4)%2?"Free":"Owned"}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div id="gamerib" className="frontCont amzGames my-8 py-20 w-auto mx-8 flex justify-between noscroll overflow-x-scroll overflow-y-hidden">
              <div className="flex w-64 flex-col text-gray-100 h-full px-8">
                <div className="text-xl">Featured Games</div>
                <div className="text-xs mt-2">Explore fun to play xbox games and find a new favorite</div>
              </div>
              <div className="flex w-max pr-8">
                {gamerib && gamerib.map(x=>{
                  var stars = 3 + (x.charCodeAt(0)+x.charCodeAt(1))%3;
                  return (
                    <div className="ribcont rounded my-auto p-2 pb-2">
                      <Image className="mx-1 py-1 mb-2 rounded overflow-hidden"
                        w={120} dir="store/games" src={x}/>
                      <div className="capitalize text-xs font-semibold">{x}</div>
                      <div className="flex mt-2 items-center">
                        <Icon className="bluestar" fafa="faStar" width={6}/>
                        <Icon className="bluestar" fafa="faStar" width={6}/>
                        <Icon className="bluestar" fafa="faStar" width={6}/>
                        <Icon className={stars>3?"bluestar":""} fafa="faStar" width={6}/>
                        <Icon className={stars>4?"bluestar":""} fafa="faStar" width={6}/>
                        <div className="text-xss text-gray-800">{1+x.charCodeAt(3)%5}k</div>
                      </div>
                      <div className="text-xss mt-8">{x.charCodeAt(4)%2?"Free":"Owned"}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div id="movrib" className="frontCont amzMovies my-8 py-20 w-auto mx-8 flex justify-between noscroll overflow-x-scroll overflow-y-hidden">
              <div className="flex w-64 flex-col text-gray-100 h-full px-8">
                <div className="text-xl">Featured Films</div>
                <div className="text-xs mt-2">Rent or buy the latest hit films and watch them at home or on the go</div>
              </div>
              <div className="flex w-max pr-8">
                {movrib && movrib.map(x=>{
                  var stars = 3 + (x.charCodeAt(0)+x.charCodeAt(1))%3;
                  return (
                    <div className="ribcont rounded my-auto p-2 pb-2">
                      <Image className="mx-1 py-1 mb-2 rounded overflow-hidden"
                        w={120} dir="store/movies" src={x}/>
                      <div className="capitalize text-xs font-semibold">{x}</div>
                      <div className="flex mt-2 items-center">
                        <Icon className="bluestar" fafa="faStar" width={6}/>
                        <Icon className="bluestar" fafa="faStar" width={6}/>
                        <Icon className="bluestar" fafa="faStar" width={6}/>
                        <Icon className={stars>3?"bluestar":""} fafa="faStar" width={6}/>
                        <Icon className={stars>4?"bluestar":""} fafa="faStar" width={6}/>
                        <div className="text-xss text-gray-800">{1+x.charCodeAt(3)%5}k</div>
                      </div>
                      <div className="text-xss mt-8">{x.charCodeAt(4)%2?"Rent":"Owned"}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
