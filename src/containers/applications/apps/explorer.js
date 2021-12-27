import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';
import {dispatchAction, handleFileOpen} from '../../../actions';
import './assets/fileexpo.scss';

const NavTitle = (props)=>{
  var src = props.icon || "folder"

  return(
    <div className="navtitle flex prtclk" data-action={props.action}
      data-payload={props.payload} onClick={dispatchAction}>
      <Icon className="mr-1" src={"win/"+src+"-sm"} width={props.isize || 16}/>
      <span>{props.title}</span>
    </div>
  )
}

const FolderDrop = ({dir})=>{
  const files = useSelector(state => state.files);
  const folder = files.data.getId(dir);

  return (
    <>
      {folder.data && folder.data.map(item=>{
        if(item.type=="folder"){
          return <Dropdown icon={item.info && item.info.icon}
            title={item.name} notoggle={item.data.length==0} dir={item.id}/>
        }
      })}
    </>
  )
}

const Dropdown = (props)=>{
  const [open, setOpen] = useState(props.isDropped!=null);
  const special = useSelector(state => state.files.data.special);
  const [fid, setFID] = useState(()=>{
    if(props.spid) return special[props.spid]
    else return props.dir
  })
  const toggle = ()=> setOpen(!open)

  return (
    <div className="dropdownmenu">
      <div className="droptitle">
        {!props.notoggle?(
          <Icon className="arrUi" fafa={open?"faChevronDown":"faChevronRight"}
            width={10} onClick={toggle} pr/>
        ):<Icon className="arrUi opacity-0" fafa="faCircle" width={10}/>}
        <NavTitle icon={props.icon} title={props.title} isize={props.isize}
          action={props.action!=""?(props.action || "FILEDIR"):null} payload={fid}/>
        {props.pinned!=null?(
          <Icon className="pinUi" src="win/pinned" width={16}/>
        ):null}
      </div>
      {!props.notoggle?(
        <div className="dropcontent">
          {open?props.children:null}
          {open&&fid!=null?<FolderDrop dir={fid}/>:null}
        </div>
      ):null}
    </div>
  )
}

export const Explorer = ()=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps.explorer);
  const files = useSelector(state => state.files);
  const [cpath, setPath] = useState(files.cpath);
  const dispatch = useDispatch();

  const handleChange = (e)=>{
    setPath(e.target.value)
  }

  const handleEnter = (e)=>{
    if(e.key==="Enter"){
      dispatch({type: "FILEPATH", payload: cpath})
    }
  }

  useEffect(()=>{
    setPath(files.cpath)
  }, [files.cpath])

  return (
    <div className="msfiles floatTab dpShad" data-size={wnapp.size}
      data-max={wnapp.max} style={{
        ...(wnapp.size=="cstm"?wnapp.dim:null),
        zIndex: wnapp.z
      }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon} size={wnapp.size}
        name="File Explorer"/>
      <div className="windowScreen flex flex-col">
        <Ribbon/>
        <div className="restWindow flex-grow flex flex-col">
          <div className="sec1">
            <Icon fafa="faArrowLeft" width={14}/>
            <Icon fafa="faArrowRight" width={14}/>
            <Icon fafa="faArrowUp" width={14}/>
            <div className="path-bar">
              <input className="path-field" type="text" value={cpath}
                  onChange={handleChange} onKeyDown={handleEnter}/>
            </div>
            <div className="srchbar">
              Search
            </div>
          </div>
          <div className="sec2">
            <NavPane/>
            <ContentArea/>
          </div>
        </div>
      </div>
    </div>
  );
}

const ContentArea = ({})=>{
  const files = useSelector(state => state.files);
  const special = useSelector(state => state.files.data.special);
  const [selected, setSelect] = useState(null);
  const fdata = files.data.getId(files.cdir);

  const handleClick = (e)=>{
    setSelect(e.target.dataset.id);
  }

  const handleDouble = (e)=>{
    handleFileOpen(e.target.dataset.id);
  }

  return(
    <div className="contentarea">
      <div className="contentwrap medScroll">
        <div className="gridshow" data-size="lg">
          {fdata.data.map(item=>{
            var icon = (item.info && item.info.icon) || item.type
            return (
              <div className="gridele flex flex-col items-center prtclk"
                data-id={item.id} data-focus={selected==item.id}
                onClick={handleClick} onDoubleClick={handleDouble}>
                <Image src={`icon/win/${icon}`}/>
                <span>{item.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const NavPane = ({})=>{
  const files = useSelector(state => state.files);
  const special = useSelector(state => state.files.data.special);

  return (
    <div className="navpane medScroll">
      <div className="extcont">
        <Dropdown icon="star" title="Quick access" action="" isDropped>
          <Dropdown icon="down" title="Downloads" spid="%downloads%" notoggle pinned/>
          <Dropdown icon="docs" title="Documents" spid="%documents%" notoggle pinned/>
          <Dropdown title="Github" spid="%github%" notoggle/>
        </Dropdown>
        <Dropdown icon="onedrive" title="OneDrive" spid="%onedrive%"/>
        <Dropdown icon="thispc" title="This PC" action="" isDropped>
          <Dropdown icon="desk" title="Desktop" spid="%desktop%"/>
          <Dropdown icon="docs" title="Documents" spid="%documents%"/>
          <Dropdown icon="down" title="Downloads" spid="%downloads%"/>
          <Dropdown icon="music" title="Music" spid="%music%"/>
          <Dropdown icon="pics" title="Pictures" spid="%pictures%"/>
          <Dropdown icon="vid" title="Videos" spid="%videos%"/>
          <Dropdown icon="disc" title="OS (C:)" spid="%cdrive%"/>
          <Dropdown icon="disk" title="Blue (D:)"/>
        </Dropdown>
      </div>
    </div>
  )
}

const Ribbon = ({})=>{
  return (
    <div className="msribbon flex">
      <div className="ribsec">
        <div className="drdwcont flex">
          <Icon src="new" ui width={18} margin="0 6px"/>
          <span>New</span>
        </div>
      </div>
      <div className="ribsec">
        <Icon src="cut" ui width={18} margin="0 6px"/>
        <Icon src="copy" ui width={18} margin="0 6px"/>
        <Icon src="paste" ui width={18} margin="0 6px"/>
        <Icon src="rename" ui width={18} margin="0 6px"/>
      </div>
      <div className="ribsec">
        <div className="drdwcont flex">
          <Icon src="sort" ui width={18} margin="0 6px"/>
          <span>Sort</span>
        </div>
        <div className="drdwcont flex">
          <Icon src="view" ui width={18} margin="0 6px"/>
          <span>View</span>
        </div>
      </div>
    </div>
  )
}
