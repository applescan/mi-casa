import { KaboomCtx } from "kaboom";

export const scaleFactor = 4;

export const dialogueData = {
  pc: `This is my PC, where I dive into the world of TypeScript, Angular, and Next.js. I enjoy watching K-pop videos and immersing myself in games during my downtime!`,
  "cs-degree": `Here's my Bachelor's degree, proudly displayed on the wall. My background is in 3D animation and VFX, and transitioning to software development has been an exciting journey for me.`,
  "sofa-table": `That's my cozy sofa, the perfect spot for relaxation while I binge-watch YouTube videos.`,
  tv: `I love catching up on shows on Netflix. Two of my favorites are 'Midnight Mass' and 'Neighbor from Hell'—I highly recommend giving them a watch!`,
  bed: `This is my bed, where I find inspiration and great ideas. I often watch YouTube before sleeping, and my favorite channel is <a href="https://www.youtube.com/@veritasium" target="_blank">Veritasium</a>.`,
  resume: `This is my desk, featuring my resume. <a href="https://felicia-portfolio.netlify.app/" target="_blank">Check it out!</a> Feel free to contact me at feliu.ren@gmail.com if you have any exciting job opportunities!`,
  projects: `Here’s some info about my portfolio: it’s built using the Kaboom.js library, a powerful tool for creating games in JavaScript. The text you’re reading now is rendered using HTML and CSS, not within the canvas. Discover more about my projects <a href="https://felicia-portfolio.netlify.app/#projects" target="_blank">here</a>.`,
  library: `My shelves are filled with a variety of art and comic books—I used to have over 300 comic books in my collection! Nowadays, I mostly read books online.`,
  exit: `If you're ready to leave my house, simply close this tab. Goodbye!`,
};

export function setCamScale(k: KaboomCtx) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.camScale(k.vec2(1));
  } else {
    k.camScale(k.vec2(1.5));
  }
}
