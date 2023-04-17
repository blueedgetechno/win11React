

export const isActive = (lastcheck) => {
	return Date.now() - Date.parse(lastcheck) > 10 * 1000
}