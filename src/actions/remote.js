export function openRemotePage(url) {
    const open = `${url}&turn=true&no_stretch=true`
    window.open(open, "_blank");
}