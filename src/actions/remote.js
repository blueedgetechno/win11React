import { isScanCodeApp } from "../utils/checking";
import { sleep } from "../utils/sleep";

export function openRemotePage(url, appName, type) {
    const open = `${url}&turn=true&no_stretch=true&scancode=${isScanCodeApp(appName)}`

    if (type == 'new_tab') {
        setTimeout(() => {
            window.open(open, '_blank');
        }, 0);
        return
    }
    document.location.href = open;

}