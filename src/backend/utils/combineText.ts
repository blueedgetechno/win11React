export const combineText = (input: string): string => {
    const result : string[] = [];

    const textSplited = input.split('_');
    textSplited.forEach((text) => {
        const char = text.split('');
        char[0] = char[0].toUpperCase();
        const charResult = char.join('');
        result.push(charResult);
    });
    return result.join(' ');
};
