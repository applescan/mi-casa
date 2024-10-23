import kaboom from "kaboom";

export let k = kaboom({
  global: false,
  touchToMouse: true,
  canvas: undefined,
  debug: false,
});

export const initKaboomWithCanvas = (canvas: HTMLCanvasElement) => {
  k = kaboom({
    global: false,
    touchToMouse: true,
    canvas: canvas,
    debug: false,
  });
};
