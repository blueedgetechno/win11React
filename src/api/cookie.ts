/**
 * 
 * @param {String} cname 
 * * GetCookie from cname
 * ? Decode document.cookie to read
 * @returns {String} data 
 */
export function getCookie(cname: string): string {
	let name = cname + "="
	let decodedCookie = decodeURIComponent(document.cookie)
	let ca = decodedCookie.split(";")
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i]
		while (c.charAt(0) == " ") {
			c = c.substring(1)
		}
		if (c.indexOf(name) == 0) {
			return atob(c.substring(name.length, c.length))
		}
	}
	return ""
}

/**
 * * SetCookie with Name, Value, Expire Time
 * ? Set expire date and converted
 * ? saving in document.cookie
 * @param {String} name 
 * @param {String} value 
 * @param {Number} milis 
 */
export function setCookie(name: string, value: string | null, milis?: number) {
	var expires = ""
	if (milis) {
		var date = new Date(Date.now() + milis)
		expires = "; expires=" + date.toUTCString()
	}
	document.cookie = name + "=" + (btoa(value? value: "")  || "") + expires + "; path=/"
}

/**
 * * Delete Cookie with Name, Path, Domain
 * @param {String} name 
 * @param {String} path 
 * @param {String} domain 
 */
export function deleteCookie(name: string, path: string, domain: string) {
    if (getCookie(name)) document.cookie = name + '=' +
        ((path) ? ';path=' + path : '') +
        ((domain) ? ';domain=' + domain : '') +
        ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
}