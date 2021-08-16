import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';
import ReactPlayer from 'react-player'
import jiosaavn from './assets/jiosaavn';
import data from './assets/songs.json';

const {round,floor,max,min,random,ceil,abs} = Math;

export const Spotify = ()=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps.spotify);
  const [tab, setTab] = useState(5);
  const [paused, setPause] = useState(true);
  const [shfle, setShuffle] = useState(0);
  const [mxqueue, setMxq] = useState([]);
  const [repeat, setRepeat] = useState(0);
  const [prog, setProg] = useState(0);
  const [perProg, setPerProg] = useState(0);
  const [volume, setVolume] = useState(50);
  const [queue, setQueue] = useState([{}]);
  const [curr, setCurr] = useState(0);
  const [playd, setPlay] = useState({}); // {type: "album",tdata: "23601363"}
  const dispatch = useDispatch();

  const libr = ["Made For You","Recently Played","Favorite Songs","Albums","Artist"];
  const plays = ["Hip Hop","Hindi","English"];
  const action = (e)=>{
    var act = e.target.dataset.action,
        payload = e.target.dataset.payload;

    // console.log(act, payload);
    if(act=="discv"){
      setTab(payload);
    }else if (act=="play") setPause(false);
    else if (act=="pause") setPause(true);
    else if (act=="shuffle"){
      var n = queue.length
      if(shfle) setShuffle(0)
      else {
        setShuffle(1)
        setMxq(jiosaavn.mixQueue(n))
      }
    }else if (act=="repeat") setRepeat((repeat+1)%3);
    else if (act=="volume") setVolume(e.target.value);
    else if (act=="mute") setVolume(volume!=0?0:100);
    else if (act=="next"){
      setPause(false);
      setProg(0);
      setPerProg(0);
      var ip = (curr+1)%queue.length;
      if(shfle) ip=mxqueue[curr];
      setCurr(ip);
    }else if (act=="prev"){
      setPause(false);
      setProg(0);
      setPerProg(0);
      var ip = (curr-1+queue.length)%queue.length;
      if(shfle) ip=mxqueue[curr];
      setCurr(ip);
    }else if (act=="album") {
      setTab(39);
      setPlay({
        type: act,
        tdata: JSON.parse(payload || "{}")
      })
    }
  }

  const handleProg = (e)=>{
    setProg(floor(e.playedSeconds));
    setPerProg(e.played);
  }

  const handleChange = (e)=>{
    var audiosrc = document.getElementById('audiosrc');
    var ip = e.target.value;
    audiosrc.currentTime = ip;
    setPerProg(ip/queue[curr].duration);
    setProg(floor(ip));
  }

  const handleFinish = (e)=>{
    setPause(true);
    if(repeat==1){
      action({target: {dataset: {action: "next"}}});
    }
  }

  useEffect(()=>{
    if(queue[curr].name==null){
      jiosaavn.getDefault().then(data=> setQueue(data)).catch(err=>{
        console.log(err);
      })
    }
  })

  return (
    <div
      className="spotify floatTab dpShad" data-size={wnapp.size}
      data-max={wnapp.max} style={{
        ...(wnapp.size=="cstm"?wnapp.dim:null),
        zIndex: wnapp.z
      }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon}
        name="Spotify Music" invert/>
      <div className="windowScreen flex flex-col">
        <div className="restWindow flex-grow flex">
          <div className="w-50 spnav">
            <div className="mx-6">
              <div className="mt-16"></div>
              <div className="snav my-4 handcr font-semibold" data-act={tab==0}
                onClick={action} data-action="discv" data-payload="0">
                <Icon icon="home" width={24}/>
                <div className="ml-4 text-sm">Home</div>
              </div>
              <div className="snav my-4 handcr font-semibold" data-act={tab==1} onClick={action}
                data-action="discv" data-payload="1">
                <Icon fafa="faCompactDisc" width={24}/>
                <div className="ml-4 text-sm">Browse</div>
              </div>
              <div className="text-gray-500 text-xs font-semibold tracking-widest mt-10 mb-4">
                YOUR LIBRARY
              </div>
              <div className="navcont overflow-y-scroll thinScroll lightScroll">
                <div className="w-full h-max">
                  {libr.map((lib, i)=>(
                    <div className="snav mb-4 handcr text-sm font-semibold" key={i}
                      data-act={tab==(i+2)} onClick={action} data-action="discv"
                      data-payload={i+2}>{lib}</div>
                  ))}
                  <div className="text-gray-500 font-semibold text-xs tracking-widest mt-12 mb-4">
                    PLAYLISTS
                  </div>
                  {plays.map((play, i)=>(
                    <div className="snav mb-4 handcr text-sm font-semibold" key={i}
                      data-act={tab==(i+2+libr.length)} onClick={action}
                      data-action="discv" data-payload={i+2+libr.length}>{play}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="spscreen thinScroll lightScroll" id="sphome">
            <div className="h-max relative">
              <div className="absolute w-full pb-8">
                {tab==10?<Queue queue={queue} curr={curr} paused={paused}/>:null}
                {tab==0?<Home tab={tab} action={action}/>:null}
                {tab>1 && tab<2+libr.length?<Home tab={tab} action={action}/>:null}
                {tab>6 && tab<10?<Playlist/>:null}
                {tab==39?<Playlist {...playd}/>:null}
              </div>
            </div>
          </div>
          <div className="splayer">
            <div className="snfo flex items-center">
              {queue[curr].albumArt?<Image src={queue[curr].albumArt} w={56} ext/>:
                  <Icon src="./img/asset/album.png" ext width={56}/>}
              <div className="ml-3">
                <div className="text-sm mb-2 text-gray-100 font-semibold">
                  {queue[curr].name || "Album"}
                </div>
                <div className="text-xss tracking-wider text-gray-400">
                  {queue[curr].artist || "Artist"}
                </div>
              </div>
            </div>
            <div className="songAct" data-prtclk={!queue[curr].name}>
              <div className="flex items-center">
                <Icon className="cticon sficon" icon="shuffle" onClick={action}
                  click="shuffle" payload={shfle!=0 | 0}/>
                <Icon className="cticon" icon="previous" onClick={action} click="prev"/>
                <div className="cborder handcr">
                  {paused?(
                    <Icon className="play" icon="play" onClick={action}
                      click="play" width={18} height={28} invert/>
                  ): <Icon className="pause" icon="pause" onClick={action}
                    click="pause" width={18} height={28} invert/>}
                </div>
                <Icon className="cticon" icon="next" onClick={action} click="next"/>
                <Icon className="cticon rpicon" icon="repeat" onClick={action}
                  click="repeat" payload={repeat}/>
              </div>
              <div className="w-full flex items-center mt-2 justify-center">
                <div className="progTime">{jiosaavn.formatTime(prog)}</div>
                <div className="sdivider">
                  <ReactPlayer className="playbody" url={queue[curr].src} config={{
                      file: {
                        forceAudio: true,
                        attributes: {id: "audiosrc"}
                      }
                    }} loop={repeat==2} playing={!paused} volume={volume/100}
                    onProgress={handleProg} onEnded={handleFinish}/>
                  <input className="cleanInput" type="range" min={0} max={queue[curr].duration}
                    value={prog} onChange={handleChange}/>
                  <div className="songprog" style={{width: (perProg*100)+"%"}}></div>
                </div>
                <div className="progTime">{jiosaavn.formatTime(queue[curr].duration)}</div>
              </div>
            </div>
            <div className="sctrl flex items-center justify-between">
              <div className="prtclk handcr mr-6" onClick={action} data-action="discv"
                data-payload="10">
                <Icon className="sficon" fafa="faListUl" width={14} payload={tab==10?1:0}/>
              </div>
              <div className="rctrl flex items-center">
                <Icon className="sficon mr-2" width={16} fafa={[
                  "faVolumeMute","faVolumeDown","faVolumeUp"][ceil(volume/50)]}
                  onClick={action} click="mute"></Icon>
                <div className="relative flex items-center">
                  <input className="cleanInput volInp" type="range" min={0} max={100}
                    value={volume} onChange={action} data-action="volume"/>
                  <div className="songprog" style={{width: floor(0.8*volume)}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Playlist = ({type, tdata})=>{
  const [data, setData] = useState({fake: true});
  const [loaded, setLoaded] = useState(false);
  const [ptype, setPtype] = useState(true);
  const [totTime, setTotime] = useState(0);
  const src = "https://i.scdn.co/image/ab67706c0000bebb5b59fe8de92d65b0becde7ef";
  const abart = "https://c.saavncdn.com/432/Raincoat-Hindi-2004-20210125130707-150x150.jpg";

  useEffect(()=>{
    if(data.fake){
      var prt = document.getElementById('sphome');
      if(prt){
        prt.scrollTop = 0;
      }

      if(type=="album"){
        setPtype(false);
        jiosaavn.getAlbum(typeof(tdata)=="string"?tdata:"").then(res=>{
          setData(res);
          var tmptot = 0;
          for (var i = 0; i < res.songs.length; i++) {
            tmptot += parseInt(res.songs[i].song_duration);
          }

          setTotime(tmptot)
        }).catch(err=> {
          console.log(err);
        })
      }
    }
  },[data])

  return(
    <div className="relative">
      <div className="playinfo">
        <Image className="dpShad" src={data.album_image || "/img/asset/mixdef.jpg"}
          ext w={232} h={232}/>
        <div className="playdet ml-6 text-gray-100 flex flex-col justify-end">
          <div className="text-xs font-bold uppercase">{type}</div>
          <div className="playtitle">{data.album_name}</div>
          <div className="text-sm font-semibold">
            {data.album_artist && data.album_artist.split(", ").join(" • ")
              || ""}{" "}
            <span className="text-gray-400 text-xs">
              • {data.year || "2020"} • {(data.songs && data.songs.length) || "0"}{" "}
              songs, {jiosaavn.formatPeriod(totTime)}
            </span>
          </div>
          <div className="playbtn">
            PLAY
          </div>
        </div>
      </div>
      <div className="infph"></div>
      <div className="alsongs">
        <div className="srow">
          <div className="font-bold text-right">#</div>
          <div className="scol1 text-xs">TITLE</div>
          <div className="text-xs">{ptype?"ALBUM":null}</div>
          <div className="text-xs">{ptype?"DATE ADDED":null}</div>
          <div className="flex justify-end">
            <Icon fafa="faClock" width={16} reg/>
          </div>
        </div>
        <div className="hr"></div>
        {data.songs && data.songs.map((song,i)=>(
          <div className="srow handcr">
            <div className="sidx">{i+1}</div>
            <div className="scol1">
              {ptype?<Image src={song.song_image}
                w={40} h={40} ext err='/img/asset/mixdef.jpg'/>:null}
              <div className="scolsong flex flex-col" data-play={ptype}>
                <div className="font-semibold capitalize text-gray-100">
                  {song.song_name}
                </div>
                <div className="font-semibold capitalize text-xs mt-1">
                  {song.song_artist}
                </div>
              </div>
            </div>
            <div className="scol2 font-semibold">{ptype?"Raincoat":null}</div>
            <div className="scol3 font-semibold">{ptype?"Apr 14, 2021":null}</div>
            <div className="font-semibold flex justify-end">
              {jiosaavn.formatTime(song.song_duration)}
            </div>
          </div>
        ))}
      </div>
      {type!="play"?(
        <div className="text-xss font-semibold acol mt-6">
          {data.songs && data.songs[0] && data.songs[0].copyright}
        </div>
      ):null}
    </div>
  )
}

const Home = ({tab, action})=>{

  const randomHue = (idx)=>{
    var date = new Date();
    var val = date.getHours();
    val = val**(date.getDay()+2);
    return floor(((val*(idx+2))%360)/1.6);
  }

  const scaction = (e)=>{
    var txt = e.target.innerText;
    var toScroll = e.target.parentElement.parentElement.children[4];
    var val = round((toScroll.scrollLeft)/224);
    if(txt=="<"){
      toScroll.scrollLeft = max(0,224*(val-4));
    }else{
      var wd = getComputedStyle(toScroll).getPropertyValue('width').replace("px","");
      toScroll.scrollLeft = 224*(val+4) + (224 - wd%224);
    }
  }

  useEffect(()=>{
    var prt = document.getElementById('sphome');
    if(prt){
      prt.scrollTop = (80 + max(0,tab-2)*360)*(tab!=0);
    }
  })

  return(
    <div className="spHome mt-12">
      {data.home.map((bar,ix)=>(
        <div className="sitem w-full mb-8" id={"tab"+(ix+2)}>
          <div className="scbCont" data-var={!bar.desc}>
            <div className="mx-2" onClick={scaction}>{"<"}</div>
            <div className="mx-2" onClick={scaction}>{">"}</div>
          </div>
          <div className="text-gray-100 font-bold">{bar.name}</div>
          <div className="text-xs font-semibold tracking-wider">
            {bar.desc}
          </div>
          <div className="w-full h-px mt-2"></div>
          <div className="w-full pt-1 overflow-x-scroll thinScroll lightScroll -ml-3">
            <div className="w-max flex">
              {bar.cards.map((card,idx)=>(
                <div className={"scard pt-3 px-3" +
                  (card.type=="artist"?" text-center":"")} style={{
                  "--rot1": randomHue(idx)+'deg'
                }}>
                  <Image className={
                    (card.type=="mix"?"coverImg":" ")+
                    (card.type=="artist"?"artImg":" ")
                  } src={card.img} ext w={200} err='/img/asset/mixdef.jpg'
                  onClick={action} click={card.type} payload={JSON.stringify(card.data)}/>
                  <div className="sover p-4 nopt">
                    {card.type=="mix"?card.name:null}
                  </div>
                  {card.type=="song"?<div className="fplay"><div className="tria"></div></div>:null}
                  <div className="mt-4 mb-1 text-gray-100 text-sm font-semibold">{card.name}</div>
                  <div className="my-1 leading-5 text-xs font-semibold tracking-wider">
                    {card.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const Queue = ({queue, curr, paused})=>{
  return(
    <div className="mt-12">
      <div className="text-5xl text-gray-100 font-bold">
        Play Queue
      </div>
      <div className="text-gray-400 font-semibold my-4">Now playing</div>
      <div className="songCont acol flex items-center py-2 pr-12">
        <div className="w-10 text-center mr-2 gcol">
          {paused?"1":<Icon src="./img/asset/equaliser.gif" ext width={16}/>}
        </div>
        <Image src={queue[curr].albumArt} w={40} ext/>
        <div className="flex flex-col ml-4">
          <div className="capitalize font-semibold gcol">{queue[curr].name}</div>
          <div className="capitalize font-medium text-sm">{queue[curr].artist}</div>
        </div>
        <div className="mx-auto font-medium w-36">{queue[curr].album}</div>
        <div className="ml-auto font-medium">{jiosaavn.formatTime(queue[curr].duration)}</div>
      </div>
      <div className="text-gray-400 font-semibold mt-12 mb-6">Next up</div>
      {jiosaavn.sliceArr(queue, curr).map((qs,i)=>{
        return (
          <div className="songCont acol flex items-center pr-12 py-2">
            <div className="mr-2 w-10 text-center">{i+2}</div>
            <Image src={qs.albumArt} w={40} ext/>
            <div className="flex flex-col ml-4">
              <div className="capitalize font-semibold text-gray-100">{qs.name}</div>
              <div className="capitalize font-semibold text-sm">{qs.artist}</div>
            </div>
            <div className="mx-auto font-medium">{qs.album}</div>
            <div className="ml-auto font-medium">{jiosaavn.formatTime(qs.duration)}</div>
          </div>
        )
      })}
    </div>
  )
}
