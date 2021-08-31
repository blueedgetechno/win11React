import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Image, ToolBar} from '../../../utils/general';

export const EdgeMenu = ()=>{
  const apps = useSelector(state => state.apps);
  const wnapp = useSelector(state => state.apps.edge);
  const [url, setUrl] = useState(["https://bing.com"]);
  const [hist, setHist] = useState([["https://bing.com","https://bing.com"]]);
  const dispatch = useDispatch();

  const [devtool,setDevtool]=useState(false);
  

  const[console,setConsole]=useState(false);
 

  const [tabs,setTabs]=useState([0]);

  const [activeTab,setActiveTab]=useState(0);

 const consoleUrl="https://jsconsole.com/";
  
 const element='<html lang="en" dir="ltr" crosspilot=""><head><meta name="theme-color" content="#4F4F4F"><meta name="description" content="Bing helps you turn information into action, making it faster and easier to go from searching to doing."><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
 

  const clickDispatch = (event)=>{
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload
    };
    if(action.type) dispatch(action);
  }

  const isValidURL = (string)=>{
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };

  const action = (e)=>{
    var iframe = document.getElementById('isite');
    var x = e.target && e.target.dataset.payload;

    
     
    //iframe.src=url[activeTab];

    if(iframe && x==0){                  //reload
      iframe.src = iframe.src;
    }else if(iframe && x==1){               //home
      
     // setActiveTab(id);

     var tmp_hist=hist.map(row=>[...row]);
      

      tmp_hist[activeTab] = [url[activeTab],"https://www.bing.com"];  //++
      setHist(tmp_hist);

      var tmp=[...url];

      tmp[activeTab]="https://www.bing.com";
      setUrl(tmp);

      
    }else if(iframe && x==2){
                              //googling
      //setActiveTab(id);    

      hist[activeTab]= [url, "https://www.google.com/webhp?igu=1"] ;                      
      setHist(hist);

      url[activeTab]="https://www.google.com/webhp?igu=1";
      setUrl(url);

    }else if(iframe && x==3){                         //browsing
      if(e.key==="Enter"){
       // console.log("Wow");
        var qry = e.target.value;

        if(isValidURL(qry)){
          if(!qry.startsWith("http")){
            qry = "https://"+qry
          }

        }else{
          qry = "https://www.bing.com/search?q="+qry;
        }

        e.target.value = qry;

        

        var tmp_hist=hist.map(row=>[...row]);
      


      tmp_hist[activeTab] = [url[activeTab], qry];  //++
      setHist(tmp_hist);

      var tmp=[...url];

      tmp[activeTab]=qry;
      setUrl(tmp);

       
      }
    }else if(x==4){             //left 
      

      var tmp=[...url];

      tmp[activeTab]=hist[activeTab][0];
      setUrl(tmp);
    
     

    }else if(x==5){          //right
      

      var tmp=[...url];

      tmp[activeTab]=hist[activeTab][1];
      setUrl(tmp);
      
    }
    else if(x==6){


                             // adding new tab

      
      
      var temp=[...url];
      temp.push("https://bing.com");
      setUrl(temp);
       
      window.console.log(url[activeTab]);
      
      setActiveTab(tabs.length);
     
      
      var tmp_hist=hist.map(row=>[...row]);
      
      tmp_hist.push(["https://bing.com","https://bing.com"]);
      setHist(tmp_hist);
      
      tabs.push(tabs.length);
      setTabs(tabs);
     

    }
    else if(x==7)
    {
                              // removing a tab
      
           
        url.splice(id,1);
         
        var tmp=[...url];
        setUrl(tmp);
        hist.splice(id,1);

        var tmp_hist=[...hist]
        setHist(tmp_hist);      

       tabs.splice(id,1);
      // tabs.pop();
        var tmp_tab=[...tabs];
       setTabs(tmp_tab);

       
    }
    else if(x==8)       //switching tab
    {
      var id=e.target.key;
      setActiveTab(id);
      e.target.value=url[activeTab];

    }


  }

  useEffect(()=>{
    if(wnapp.url){
      setUrl(wnapp.url);
      dispatch({type: "EDGELINK"});
    }
  })


  





  return (
    <div
      className="edgeBrowser floatTab dpShad" data-size={wnapp.size}
      data-max={wnapp.max} style={{
        ...(wnapp.size=="cstm"?wnapp.dim:null),
        zIndex: wnapp.z
      }} data-hide={wnapp.hide} id={wnapp.icon+"App"}>
      <ToolBar app={wnapp.action} icon={wnapp.icon}
        name="Microsoft Edge" float/>
      <div className="windowScreen flex flex-col">
        <div className="overTool flex">
         <Icon src={wnapp.icon} width={14} margin="0 6px"/>
         <div className="btab bg-gray-100">
                    <div>New Tab</div>
                    <Icon fafa="faTimes" click={wnapp.action} payload="close" width={10}/>
                    
           </div>



          {
             
             tabs.map((i)=>

                 
                   
                  <div key={i} >
                    <div className="btab bg-gray-100" onClick={action} payload={8}>
                      <div>New Tab</div>
                      <Icon fafa="faTimes" onClick={action} payload={7} width={10}/>
                    
                    </div>
                  </div>
            
                 
             )
          }

          <Icon fafa="faPlus" onClick={action} payload={6} width={10} margin="0 5"/>
        </div>
        <div className="restWindow flex-grow flex flex-col">
          <div
            className="addressBar w-full bg-gray-100 h-10 flex items-center">
            <Icon src="left" onClick={action} payload={4} width={14} ui margin="0 8px"/>
            <Icon src="right" onClick={action} payload={5} width={14} ui margin="0 8px"/>
            <Icon fafa="faRedo" onClick={action} payload={0} width={14} color="#343434" margin="0 8px"/>
            <Icon fafa="faHome" onClick={action} payload={1} width={18} color="#343434" margin="0 16px"/>
            <div className="addCont relative flex items-center">
              <input
                className="ltShad w-full bg-gray-0 h-6 px-4 text-gray-900"
                onKeyDown={action}
                data-payload={3}
                defaultValue={url[activeTab]}
                placeholder="Type url or a query to search"
                type="text"/>
                <Icon className="z-1 handcr"
                  src="google" ui onClick={action}
                  payload={2} width={14} margin="0 10px"/>

              <Icon className="z-1 handcr" fafa="faCode" onClick={()=>{setDevtool(!devtool)}}  width={14} margin="0 5"/>
            </div>
          </div>
          <div className="siteFrame flex flex-grow overflow-hidden">
            {wnapp.hide || devtool?null:(
                <iframe src={url[activeTab]} id="isite" className="w-full h-full"
                  frameborder="0">
                </iframe>
                
              )}



             {devtool?(
                
                <iframe src={url[activeTab]} id="isite" className="w-4/5 h-full"
                frameborder="0">
                </iframe> 
                  
                )

              :null}
             
             {devtool?(<div className="w-1/5"> 

               <div class="grid grid-cols-2 gap-4">
                   <button class="w-15 h-10 items-center   border-gray-300 " onClick={()=>setConsole(!console)}>Element</button>
                   <button class="w-15 h-10  items-center   border border-gray-300"  onClick={()=>setConsole(!console)} >Console</button>
               </div>

               

               {!console?(
                 <div id='element' className="w-full h-full ">
                         {element}
                 </div>
               ):null

               }
               {console?(
                 
                   <iframe src={consoleUrl} className="w-full h-full"></iframe>
                 
               ):null

               }
          
             </div>):null}
             



            
            
          </div>
        </div>
      </div>
    </div>
  );
}
