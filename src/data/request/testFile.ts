
const isEqual = (a: number, b: number) => {
    if (a > 200) throw Error("cant be greater than 200")
    return Boolean(a === b)
}

export const verifyIsEqual = (int: number) => {
    const result = isEqual(int, 4)
    if (result) {
        console.log('Test passed');
    } else {
        throw new Error('Test failed');
    }
}
