import { k } from "./kaboomCtx";

export const preloadAssets = () => {
  k.loadRoot("/assets/");
  k.loadSprite("Rock", "rock.webp");
  k.loadSprite("Paper", "paper.webp");
  k.loadSprite("Scissors", "scissors.webp");
  k.loadSprite("fish", "fish.webp");
  k.loadSprite("background", "tank.webp");
  k.loadSprite("quit", "quit.webp");
};

export const rockPaperScissors = () => {
  preloadAssets();

  k.scene("rockPaperScissors", () => {
    const choices = ["Rock", "Paper", "Scissors"] as const;

    const SPRITE_SIZE = 64;

    // Responsive scaling
    const scaleFactor = Math.min(k.width() / 640, k.height() / 480);
    const isPortrait = k.height() > k.width();

    // Game state
    let playerChoice: (typeof choices)[number] | null = null;
    let computerChoice: (typeof choices)[number] | null = null;
    let playerScore = 0;
    let computerScore = 0;
    let roundsPlayed = 0;
    const maxRounds = 3;
    let gameLocked = false;

    // Background (cropped for mobile)
    k.add([
      k.sprite("background"),
      k.pos(isPortrait ? -k.width() * 0.25 : 0, 0),
      k.scale(isPortrait ? 1.5 : 1), // Crop effect
    ]);

    // Text sizes
    const textSize = Math.max(18 * scaleFactor, 16);

    // UI Elements (Centered)
    const playerScoreText = k.add([
      k.text(`Player: ${playerScore}`, { size: textSize }),
      k.pos(k.width() / 4, 50 * scaleFactor),
      k.anchor("center"),
      k.color(0, 0, 0),
    ]);

    const computerScoreText = k.add([
      k.text(`Fish: ${computerScore}`, { size: textSize }),
      k.pos((3 * k.width()) / 4, 50 * scaleFactor),
      k.anchor("center"),
      k.color(0, 0, 0),
    ]);

    const fishY = isPortrait ? 320 * scaleFactor : 180 * scaleFactor;
    const resultTextY = isPortrait ? 170 * scaleFactor : 80 * scaleFactor;
    const fishChoiceY = isPortrait ? 370 * scaleFactor : 240 * scaleFactor;

    const resultText = k.add([
      k.text("Choose your move!", { size: textSize }),
      k.pos(k.width() / 2, resultTextY),
      k.anchor("center"),
      k.color(0, 0, 0),
    ]);

    // Fish sprite
    k.add([
      k.sprite("fish", {
        width: SPRITE_SIZE * 3.5 * scaleFactor,
        height: SPRITE_SIZE * 3.5 * scaleFactor,
      }),
      k.pos(k.width() / 2, fishY),
      k.anchor("center"),
    ]);

    // Fish choice sprite
    const fishChoiceSprite = k.add([
      k.pos(k.width() / 2, fishChoiceY),
      k.anchor("center"),
      { visible: false },
    ]);

    // Handle round results
    const handleResult = () => {
      if (!playerChoice || !computerChoice) return;
      roundsPlayed++;

      // Show fish's choice
      fishChoiceSprite.use(
        k.sprite(computerChoice, {
          width: SPRITE_SIZE * 1.5 * scaleFactor,
          height: SPRITE_SIZE * 1.5 * scaleFactor,
        })
      );
      fishChoiceSprite.visible = true;

      setTimeout(() => {
        if (playerChoice === computerChoice) {
          resultText.text = `It's a tie! Both chose ${playerChoice}`;
        } else if (
          (playerChoice === "Rock" && computerChoice === "Scissors") ||
          (playerChoice === "Paper" && computerChoice === "Rock") ||
          (playerChoice === "Scissors" && computerChoice === "Paper")
        ) {
          playerScore++;
          resultText.text = `You win this round!\n${playerChoice} beats ${computerChoice}`;
        } else {
          computerScore++;
          resultText.text = `Rafayel wins this round!\n${computerChoice} beats ${playerChoice}`;
        }

        playerScoreText.text = `Player: ${playerScore}`;
        computerScoreText.text = `Fish: ${computerScore}`;

        if (roundsPlayed === maxRounds) {
          endGame();
        }
      }, 1000);
    };

    // End game function
    const endGame = () => {
      if (playerScore > computerScore) {
        resultText.text = `You win the game!\nFinal Score: ${playerScore}-${computerScore}`;
      } else if (computerScore > playerScore) {
        resultText.text = `Rafayel the Fish wins!\nFinal Score: ${playerScore}-${computerScore}`;
      } else {
        resultText.text = `It's a tie game!\nFinal Score: ${playerScore}-${computerScore}`;
      }

      k.onKeyPress("escape", () => {
        k.go("main", { fromMiniGame: true, movePlayerBack: true });
      });

      k.get("button").forEach((button) => {
        if (!button.hasLabel || button.label !== "quit") {
          button.destroy();
        }
      });

      createQuitButton(
        k.width() / 2,
        isPortrait
          ? k.height() - 350 * scaleFactor
          : k.height() - 70 * scaleFactor
      );
    };

    const createQuitButton = (x: number, y: number) => {
      k.add([
        k.sprite("quit", {
          width: 200 * scaleFactor,
          height: 100 * scaleFactor,
        }),
        k.pos(x, y),
        k.anchor("center"),
        "button",
        k.area(),
        {
          clickAction: () => {
            k.go("main", { fromMiniGame: true, movePlayerBack: true });
          },
        },
      ]);
    };

    // Button creation
    const createButton = (
      label: (typeof choices)[number],
      x: number,
      y: number,
      onClick: () => void
    ) => {
      k.add([
        k.sprite(label, {
          width: SPRITE_SIZE * 1.5 * scaleFactor,
          height: SPRITE_SIZE * 1.5 * scaleFactor,
        }),
        k.pos(x, y),
        k.anchor("center"),
        "button",
        k.area(),
        { clickAction: onClick },
      ]);
    };

    // Button layout
    const centerX = k.width() / 2;
    const buttonSpacing = Math.min(200 * scaleFactor, k.width() / 5);
    const buttonY = k.height() / 2 + 120 * scaleFactor;

    createButton("Rock", centerX - buttonSpacing, buttonY, () => {
      playerChoice = "Rock";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    createButton("Paper", centerX, buttonY, () => {
      playerChoice = "Paper";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    createButton("Scissors", centerX + buttonSpacing, buttonY, () => {
      playerChoice = "Scissors";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    // Mouse click support
    k.onClick("button", (button) => {
      if (gameLocked) return;
      gameLocked = true;
      button.clickAction?.();
      setTimeout(() => {
        gameLocked = false;
      }, 500);
    });

    // Touch support (Prevent multiple taps)
    k.onTouchStart((pos) => {
      if (gameLocked) return;
      gameLocked = true;

      const clickedButton = k.get("button").find((b) => b.hasPoint(pos));
      if (clickedButton) {
        clickedButton.clickAction?.();
      }

      setTimeout(() => {
        gameLocked = false;
      }, 500);
    });

    // Escape key to return to main menu
    k.onKeyPress("escape", () => {
      k.go("main", { fromMiniGame: true, movePlayerBack: true });
    });
  });
};
