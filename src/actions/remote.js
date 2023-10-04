import { sleep } from "../utils/sleep";

export function openRemotePage(url) {
    const open = `${url}&turn=true&no_stretch=true`
    var windowReference = window.open();
    //window.open(open, "_blank");

    return sleep(100).then(function (url) {
        windowReference.location = open;
    });
}