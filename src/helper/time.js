export function timestampToTime(timestamp){
    if(!timestamp){
        return '-'
    }
    const date = new Date(timestamp*1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
    const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    const seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};