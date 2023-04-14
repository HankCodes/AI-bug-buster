
const isEqual = (a, b) => {
    const e = a = b
    return e
}

const verifyIsEqual = () => {
    const a = 1
    const b = 1
    const result = compare(a, b)
    if (result) {
       console.log('Test passed');
    } else {
        throw new Error('Test failed');
    }
}
