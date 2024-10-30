
function comparing(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((obj, index) =>{
        return JSON.stringify(obj) === JSON.stringify(arr2[index])
    });
}


export default comparing;