import { k } from "./kaboomCtx";

export const rockPaperScissors = () => {
  k.scene("rockPaperScissors", () => {
    const choices = ["Rock", "Paper", "Scissors"] as const;

    // Global asset loading for faster access
    k.loadRoot("/assets/");
    k.loadSprite("Rock", "rock.webp");
    k.loadSprite("Paper", "paper.webp");
    k.loadSprite("Scissors", "scissors.webp");
    k.loadSprite("fish", "fish.webp");
    k.loadSprite("background", "tank.webp");

    const SPRITE_SIZE = 64;

    // Responsive scaling for mobile
    const scaleFactor = Math.min(window.innerWidth / 640, 1);

    // Game state
    let playerChoice: (typeof choices)[number] | null = null;
    let computerChoice: (typeof choices)[number] | null = null;

    let playerScore = 0;
    let computerScore = 0;
    let roundsPlayed = 0;

    const maxRounds = 3;

    // Background with responsive scaling and centering
    const background = k.add([
      k.sprite("background", { width: k.width(), height: k.height() }),
      k.pos(0, 0),
    ]);
    background.use(k.scale(scaleFactor));

    // UI Elements (centered text)
    const playerScoreText = k.add([
      k.text(`Player: ${playerScore}`, { size: 24 * scaleFactor, width: 300 }),
      k.pos(k.width() / 4, 50 * scaleFactor),
      k.anchor("center"),
      k.color(0, 0, 0),
    ]);

    const computerScoreText = k.add([
      k.text(`Fish: ${computerScore}`, { size: 24 * scaleFactor, width: 300 }),
      k.pos((3 * k.width()) / 4, 50 * scaleFactor),
      k.anchor("center"),
      k.color(0, 0, 0),
    ]);

    const resultText = k.add([
      k.text("Choose your move!", { size: 24 * scaleFactor, width: 300 }),
      k.pos(k.width() / 2, 100 * scaleFactor),
      k.anchor("center"),
      k.color(0, 0, 0),
    ]);

    // Fish sprite
    k.add([
      k.sprite("fish", {
        width: SPRITE_SIZE * 5 * scaleFactor,
        height: SPRITE_SIZE * 5 * scaleFactor,
      }),
      k.pos(k.width() / 2 - SPRITE_SIZE * 2.5 * scaleFactor, 80),
    ]);

    // Fish choice sprite
    const fishChoiceSprite = k.add([
      k.pos(k.width() / 2 - SPRITE_SIZE / 2, 290),
      { visible: false },
    ]);

    const handleResult = () => {
      if (!playerChoice || !computerChoice) return;

      roundsPlayed++;

      // Show the fish's choice
      fishChoiceSprite.use(
        k.sprite(computerChoice, {
          width: SPRITE_SIZE * 2 * scaleFactor,
          height: SPRITE_SIZE * 2 * scaleFactor,
        })
      );
      fishChoiceSprite.visible = true;

      // Determine the round result
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

        // Update scores
        playerScoreText.text = `Player: ${playerScore}`;
        computerScoreText.text = `Rafayel the Fish: ${computerScore}`;

        // Check if the game is over
        if (roundsPlayed >= maxRounds) {
          endGame();
        }
      }, 1000);
    };

    const endGame = () => {
      if (playerScore > computerScore) {
        resultText.text = `You win the game!\nFinal Score: ${playerScore}-${computerScore}`;
      } else if (computerScore > playerScore) {
        resultText.text = `Rafayel the Fish wins the game!\nFinal Score: ${playerScore}-${computerScore}`;
      } else {
        resultText.text = `It's a tie game!\nFinal Score: ${playerScore}-${computerScore}`;
      }

      k.add([
        k.text("Press ESC to return to the main game.", {
          size: 16 * scaleFactor,
        }),
        k.pos(k.width() / 2, k.height() - 90 * scaleFactor),
        k.anchor("center"),
        k.color(0, 0, 0),
      ]);

      k.onKeyPress("escape", () => {
        k.go("main", { fromMiniGame: true, movePlayerBack: true });
      });
      k.destroyAll("button");
    };

    // Button creation
    const createButton = (
      label: (typeof choices)[number],
      x: number,
      onClick: () => void
    ) => {
      k.add([
        k.sprite(label, {
          width: SPRITE_SIZE * 2 * scaleFactor,
          height: SPRITE_SIZE * 2 * scaleFactor,
        }),
        k.pos(
          x - SPRITE_SIZE * scaleFactor,
          k.height() / 2 + 150 * scaleFactor
        ),
        "button",
        k.area(),
        {
          clickAction: onClick,
        },
      ]);
    };

    // Add buttons for choices
    const centerX = k.width() / 2;
    createButton("Rock", centerX - 200 * scaleFactor, () => {
      playerChoice = "Rock";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    createButton("Paper", centerX, () => {
      playerChoice = "Paper";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    createButton("Scissors", centerX + 200 * scaleFactor, () => {
      playerChoice = "Scissors";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    // Handle button clicks
    k.onClick("button", (button) => {
      button.clickAction?.();
    });

    // Escape to main menu
    k.onKeyPress("escape", () => {
      k.go("main", { fromMiniGame: true, movePlayerBack: true });
    });
  });
};
