export function formatError(err) {
	let formated = "unknown"
	err.includes('reference is not valid')
	formated = "wrong reference key"
	if (err.includes('timeout 1 minutes waiting for server session'))
		formated = "worker is not running?"
	if (err.includes(`error validate session`))
		formated = "database error"
	if (err.includes(`error insert user session`))
		formated = "database error"
	if (err.includes(`error update user session`))
		formated = "database error"
	if (err.includes(`error add relationship`))
		formated = "database error"
	if (err.includes(`error fetch worker config`))
		formated = "database error"
	if (err.includes(`error get worker session`))
		formated = "database error"

	return formated
}