export const randomColorGenerator = () => {
    return `rgb(${Math.floor(100 * Math.random())}, ${Math.floor(
        100 * Math.random(),
    )}, ${Math.floor(100 * Math.random())})`;
};
