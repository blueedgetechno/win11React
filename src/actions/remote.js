import { isScanCodeApp } from "../utils/checking";
import { sleep } from "../utils/sleep";

export function openRemotePage(url, appName) {

    const open = `${url}&turn=true&no_stretch=true&scancode=${isScanCodeApp(appName) ? 'true' : 'false'}`
    //var windowReference = window.open();
    ////window.open(open, "_blank");

    //return sleep(100).then(function (url) {
    //    windowReference.location = open;
    //});
    setTimeout(() => {
        window.open(open, '_blank');
    }, 0);
}