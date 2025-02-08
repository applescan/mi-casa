import { createRoot } from "react-dom/client";
import GameScene from "./gameScene";

if (document.getElementById("root")) {
  const root = createRoot(document.getElementById("root")!);
  root.render(<GameScene />);
}
