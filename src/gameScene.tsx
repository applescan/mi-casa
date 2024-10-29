import React, { useEffect, useRef, useState } from "react";
import { dialogueData, scaleFactor, setCamScale } from "./constants";
import { initKaboomWithCanvas, k } from "./kaboomCtx";
import DialogueBox from "./dialogBox";

type DialogueKeys = keyof typeof dialogueData;

const GameScene: React.FC = () => {
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [isDialogueVisible, setIsDialogueVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initKaboomWithCanvas(canvasRef.current);
    }

    k.loadSprite("spritesheet", "./Itty_Bitty_6_Walk_sprites.png", {
      sliceX: 15,
      sliceY: 8,
      anims: {
        "idle-down": 63,
        "walk-down": { from: 63, to: 65, loop: true, speed: 6 },
        "idle-side": 93,
        "walk-side": { from: 93, to: 95, loop: true, speed: 6 },
        "idle-up": 108,
        "walk-up": { from: 108, to: 110, loop: true, speed: 6 },
      },
    });

    k.loadSprite("map", "./mi-casa.png");
    k.setBackground(k.Color.fromHex("#3a403b"));

    k.scene("main", async () => {
      const mapData = await (await fetch("./mi-casa.json")).json();
      const layers = mapData.layers;

      const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

      const playerScaleFactor = 6;

      const player = k.make([
        k.sprite("spritesheet", { anim: "idle-down" }),
        k.area({
          shape: new k.Rect(k.vec2(0, 3), 10, 10),
        }),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(playerScaleFactor),
        {
          speed: 250,
          direction: "down",
          isInDialogue: false,
        },
        "player",
      ]);

      const handleDialogue = (boundaryName: DialogueKeys) => {
        if (boundaryName && dialogueData[boundaryName]) {
          setDialogue(dialogueData[boundaryName]);
          setIsDialogueVisible(true);
        }
      };

      for (const layer of layers) {
        if (layer.name === "boundaries") {
          for (const boundary of layer.objects) {
            map.add([
              k.area({
                shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
              }),
              k.body({ isStatic: true }),
              k.pos(boundary.x, boundary.y),
              { name: boundary.name },
            ]);

            player.onCollide((obj) => {
              const boundaryName = obj.name as DialogueKeys;

              if (boundaryName && dialogueData[boundaryName]) {
                if (!player.isInDialogue) {
                  handleDialogue(boundaryName);
                }
              }
            });
          }
        }

        if (layer.name === "spawnpoints") {
          for (const entity of layer.objects) {
            if (entity.name === "player") {
              player.pos = k.vec2(
                (map.pos.x + entity.x) * scaleFactor,
                (map.pos.y + entity.y) * scaleFactor
              );
              k.add(player);
            }
          }
        }
      }

      setCamScale(k);

      k.onResize(() => {
        setCamScale(k);
      });

      k.onUpdate(() => {
        k.camPos(player.worldPos().x, player.worldPos().y - 100);
      });

      const stopAnims = () => {
        if (player.direction === "down") {
          player.play("idle-down");
        } else if (player.direction === "up") {
          player.play("idle-up");
        } else {
          player.play("idle-side");
        }
      };

      k.onMouseRelease(stopAnims);
      k.onKeyRelease(stopAnims);

      k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== "left" || player.isInDialogue) return;

        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);

        const mouseAngle = player.pos.angle(worldMousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if (
          mouseAngle > lowerBound &&
          mouseAngle < upperBound &&
          player.curAnim() !== "walk-up"
        ) {
          player.play("walk-up");
          player.direction = "up";
        } else if (
          mouseAngle < -lowerBound &&
          mouseAngle > -upperBound &&
          player.curAnim() !== "walk-down"
        ) {
          player.play("walk-down");
          player.direction = "down";
        } else if (Math.abs(mouseAngle) > upperBound) {
          player.flipX = false;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "right";
        } else if (Math.abs(mouseAngle) < lowerBound) {
          player.flipX = true;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "left";
        }
      });

      k.onKeyDown(() => {
        const keyMap = [
          k.isKeyDown("right"),
          k.isKeyDown("left"),
          k.isKeyDown("up"),
          k.isKeyDown("down"),
        ];

        let nbOfKeyPressed = 0;
        keyMap.forEach((isKeyDown) => {
          if (isKeyDown) nbOfKeyPressed++;
        });

        if (nbOfKeyPressed > 1 || player.isInDialogue) {
          console.log("Movement blocked");
          return;
        }

        // Movement logic for keyboard inputs
        if (keyMap[0]) {
          player.flipX = false;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "right";
          player.move(player.speed, 0);
        } else if (keyMap[1]) {
          player.flipX = true;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "left";
          player.move(-player.speed, 0);
        } else if (keyMap[2]) {
          if (player.curAnim() !== "walk-up") player.play("walk-up");
          player.direction = "up";
          player.move(0, -player.speed);
        } else if (keyMap[3]) {
          if (player.curAnim() !== "walk-down") player.play("walk-down");
          player.direction = "down";
          player.move(0, player.speed);
        }
      });
    });

    k.go("main");

    return () => {
      k.go("");
    };
  }, []);

  const closeDialogue = () => {
    setIsDialogueVisible(false);
    setDialogue(null);
  };

  return (
    <div>
      <canvas ref={canvasRef} id="game-canvas"></canvas>
      <DialogueBox
        text={dialogue || ""}
        onDisplayEnd={closeDialogue}
        isVisible={isDialogueVisible}
      />
    </div>
  );
};

export default GameScene;
