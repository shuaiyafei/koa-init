export default (fn, time = 500) => {
    let timeout;
    return function () {
        let args = [...arguments];
        clearTimeout(timeout);
        timeout = null;
        timeout = setTimeout(() => {
            fn.apply(this, args);
        }, time);
    }
};