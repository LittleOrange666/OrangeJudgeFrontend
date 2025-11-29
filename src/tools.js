export const toForm = function (obj){
    let f = new FormData();
    for(let key in obj){
        f.append(key, obj[key]);
    }
    return f;
};