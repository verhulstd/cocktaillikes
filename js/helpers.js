export const preloadImage = (src) =>
  new Promise(function (res, rej) {
    const myImage = new Image();
    myImage.src = src;
    myImage.onload = res;
    myImage.error = rej;
  });
