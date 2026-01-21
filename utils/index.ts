export const debounce = (func: (...args: any[]) => any, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: any, ...args: []) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(this, args)
        }, delay);
    }
}

export const truncateContent = (content: string, charCount: number = 20) => {
    const newContent = content.replaceAll('\n', ' ');

    if (content.length <= charCount) return newContent;

    return newContent.substring(0, charCount);
};

export const truncateDecimals = (num: number, decimals: number) => {
  const multiplier = Math.pow(10, decimals);
  const multipliedNumber = Math.trunc(num * multiplier);
  return multipliedNumber / multiplier;
};
