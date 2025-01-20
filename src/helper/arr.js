export function arrToKeyObj(arr,key){
    let res = {}
    arr.forEach(i=>{
        res[i[key]] = i
    })
    return res;
};