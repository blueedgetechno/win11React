
export const combineText = (input) => {
	const result = []

	const textSplited = input.split('_')
	textSplited.forEach((text) => {
		const char = text.split('')
		char[0] = char[0].toUpperCase()
		const charResult = char.join((''))
		result.push(charResult)

	})
	return result.join(' ')
}

