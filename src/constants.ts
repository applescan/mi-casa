import { KaboomCtx } from "kaboom";

export const scaleFactor = 4;

export const dialogueData = {
  "kitchen-light": "The kitchen light adds a warm glow to the space.",
  kitchen:
    "The kitchen is where I keep my snacks. It’s cozy and well-organized, perfect for a quick bite.",
  fridge:
    "This fridge holds a mix of my favorite snacks for those late-night cravings.",
  stove:
    "While cooking isn't my favorite activity, this stove has seen many culinary experiments.",
  food: "A little stockpile of snacks for quick meals and midnight cravings.",
  records:
    "I enjoy listening to K-pop! Music is a big part of my relaxation time.",
  "plant-1":
    "Plants add a touch of life to the room. They’re small but make a big difference.",
  "plant-2":
    "A plant that’s been with me through thick and thin. Adds fresh vibes!",
  bed: `This is my bed, where I find inspiration and great ideas. I often watch YouTube before sleeping, and my favorite channel is <a href="https://www.youtube.com/@veritasium" target="_blank">Veritasium</a>.`,
  "side-table":
    "A small table where I keep essentials like my phone and a book for nighttime reading.",
  exit: `If you're ready to leave my house, simply close this tab. Goodbye!`,
  pet: "My favorite animal is a dog; I hope one day I can have one.",
  succulent:
    "A cute little succulent that’s easy to take care of and adds a nice touch.",
  wardrobe: "My wardrobe where I keep my clothes and some sentimental items.",
  clothes:
    "These are my clothes, arranged to make it easy to pick an outfit each day.",
  sink: "The sink, part of my daily routines in both mornings and evenings.",
  mirror:
    "This mirror is perfect for getting ready. It has seen all my styles.",
  toilet: "The most humble yet essential part of the home.",
  bath: "A comfortable bath for relaxation after a long day.",
  fish: "Fish are calming to watch; I love having them as silent companions.",
  "book-shelf": `My shelves are filled with a variety of art and comic books—I used to have over 300 comic books in my collection! Nowadays, I mostly read books online.`,
  clock:
    "A vintage clock that has been in the family for years. It’s a reminder of time’s flow.",
  fireplace: "The fireplace keeps the room warm and adds a touch of coziness.",
  sofa: `That's my cozy sofa, the perfect spot for relaxation while I binge-watch YouTube videos.`,
  "sofa-left":
    "The left section of my sofa, ideal for stretching out and relaxing.",
  table:
    "A central table where I enjoy coffee and sometimes work on small projects.",
  "book-1": `This is my desk, featuring my resume. <a href="https://felicia-portfolio.netlify.app/" target="_blank">Check it out!</a> Feel free to contact me at feliu.ren@gmail.com if you have any exciting job opportunities!`,
  "book-2": `Here’s some info about my portfolio: it’s built using the Kaboom.js library, a powerful tool for creating games in JavaScript. The text you’re reading now is rendered using HTML and CSS, not within the canvas. Discover more about my projects <a href="https://felicia-portfolio.netlify.app/#projects" target="_blank">here</a>.`,
};

export function setCamScale(k: KaboomCtx) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.camScale(k.vec2(1));
  } else {
    k.camScale(k.vec2(1.5));
  }
}
