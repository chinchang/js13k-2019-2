export const W = window.innerWidth;
export const H = window.innerHeight;

export function random(a, b) {
  return a + ~~(Math.random() * (b - a));
}
export function randomf(a, b) {
  return a + Math.random() * (b - a);
}

export function setStyle(el, styles) {
  Object.keys(styles).map(key => {
    el.style[key] = styles[key];
  });
}

export function createElement(tag, classes) {
  const el = document.createElement(tag);
  el.className = classes;
  return el;
}
