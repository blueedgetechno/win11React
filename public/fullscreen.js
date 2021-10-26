 function full_screen()
            {
                // check if user allows full screen of elements. This can be enabled or disabled in browser config. By default its enabled.
                //its also used to check if browser supports full screen api.
                if("fullscreenEnabled" in document || "webkitFullscreenEnabled" in document || "mozFullScreenEnabled" in document || "msFullscreenEnabled" in document)
                {
                    if(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled)
                    {
                        console.log("User allows fullscreen");
                   
                        var element = document.getElementById("box");
                        //requestFullscreen is used to display an element in full screen mode.
                        if("requestFullscreen" in element)
                        {
                            element.requestFullscreen();
                        }
                        else if ("webkitRequestFullscreen" in element)
                        {
                            element.webkitRequestFullscreen();
                        }
                        else if ("mozRequestFullScreen" in element)
                        {
                            element.mozRequestFullScreen();
                        }
                        else if ("msRequestFullscreen" in element)
                        {
                            element.msRequestFullscreen();
                        }

                    }
                }
                else
                {
                    console.log("User doesn't allow full screen");
                }
            }

            function screen_change()
            {
                //fullscreenElement is assigned to html element if any element is in full screen mode.
                if(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)
                {
                    console.log("Current full screen element is : " + (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement))
                }
                else
                {
                    // exitFullscreen us used to exit full screen manually
                    if ("exitFullscreen" in document)
                    {
                        document.exitFullscreen();
                    }
                    else if ("webkitExitFullscreen" in document)
                    {
                        document.webkitExitFullscreen();
                    }
                    else if ("mozCancelFullScreen" in document)
                    {
                        document.mozCancelFullScreen();
                    }
                    else if ("msExitFullscreen" in document)
                    {
                        document.msExitFullscreen();
                    }
                }
            }

            //called when an event goes full screen and vice-versa.
            document.addEventListener("fullscreenchange", screen_change);
            document.addEventListener("webkitfullscreenchange", screen_change);
            document.addEventListener("mozfullscreenchange", screen_change);
            document.addEventListener("MSFullscreenChange", screen_change);

            //called when requestFullscreen(); fails. it may fail if iframe don't have allowfullscreen attribute enabled or for something else.
            document.addEventListener("fullscreenerror", function(){console.log("Full screen failed");});
            document.addEventListener("webkitfullscreenerror", function(){console.log("Full screen failed");});
            document.addEventListener("mozfullscreenerror", function(){console.log("Full screen failed");});
            document.addEventListener("MSFullscreenError", function(){console.log("Full screen failed");});
