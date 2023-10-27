import { isScanCodeApp } from "../utils/checking";
import { sleep } from "../utils/sleep";

export function openRemotePage(url, appName, type = "current_tab") {
  const open = `${url}&turn=true&no_stretch=true&page=${appName}&scancode=${isScanCodeApp(
    appName,
  )}`;

  if (type != "new_tab") {
    document.location.href = open;
    return;
  }
  setTimeout(() => {
    window.open(open, "_blank");
  }, 0);
}
