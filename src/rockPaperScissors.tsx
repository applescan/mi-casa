import { k } from "./kaboomCtx";

export const rockPaperScissors = () => {
  k.scene("rockPaperScissors", () => {
    const choices = ["Rock", "Paper", "Scissors"] as const;

    // Load assets
    k.loadSprite("Rock", "/assets/rock.png");
    k.loadSprite("Paper", "/assets/paper.png");
    k.loadSprite("Scissors", "/assets/scissors.png");
    k.loadSprite("fish", "/assets/fish.png");
    k.loadSprite("background", "/assets/tank.jpg");

    const SPRITE_SIZE = 64;

    // Game state
    let playerChoice: (typeof choices)[number] | null = null;
    let computerChoice: (typeof choices)[number] | null = null;

    let playerScore = 0;
    let computerScore = 0;
    let roundsPlayed = 0;

    const maxRounds = 3;

    // Background
    k.add([
      k.sprite("background", { width: k.width(), height: k.height() }),
      k.pos(0, 0),
    ]);

    // UI Elements
    const playerScoreText = k.add([
      k.text(`Player: ${playerScore}`, { size: 24 }),
      k.pos(k.width() / 4, 50),
      k.anchor("center"),
      k.color(0, 0, 0),
    ]);

    const computerScoreText = k.add([
      k.text(`Fish: ${computerScore}`, { size: 24 }),
      k.pos((3 * k.width()) / 4, 50),
      k.anchor("center"),
      k.color(0, 0, 0),
    ]);

    const resultText = k.add([
      k.text("Choose your move!", { size: 24 }),
      k.pos(k.width() / 2, 100),
      k.anchor("center"),
      k.color(0, 0, 0),
    ]);

    // Fish sprite
    k.add([
      k.sprite("fish", { width: SPRITE_SIZE * 5, height: SPRITE_SIZE * 5 }),
      k.pos(k.width() / 2 - SPRITE_SIZE * 2.5, 80),
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
          width: SPRITE_SIZE * 2,
          height: SPRITE_SIZE * 2,
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
          resultText.text = `You win this round! ${playerChoice} beats ${computerChoice}`;
        } else {
          computerScore++;
          resultText.text = `Rafayel wins this round! ${computerChoice} beats ${playerChoice}`;
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

    // End game
    const endGame = () => {
      if (playerScore > computerScore) {
        resultText.text = `You win the game! Final Score: ${playerScore}-${computerScore}`;
      } else if (computerScore > playerScore) {
        resultText.text = `Rafayel the Fish wins the game! Final Score: ${playerScore}-${computerScore}`;
      } else {
        resultText.text = `It's a tie game! Final Score: ${playerScore}-${computerScore}`;
      }

      k.add([
        k.text("Press ESC to return to the main game.", { size: 16 }),
        k.pos(k.width() / 2, k.height() - 90),
        k.anchor("center"),
        k.color(0, 0, 0),
      ]);

      k.onKeyPress("escape", () => {
        k.go("main", { fromMiniGame: true, movePlayerBack: true });
      });
      k.destroyAll("button");
    };

    // Create buttons
    const createButton = (
      label: (typeof choices)[number],
      x: number,
      onClick: () => void
    ) => {
      k.add([
        k.sprite(label, { width: SPRITE_SIZE * 2, height: SPRITE_SIZE * 2 }),
        k.pos(x - SPRITE_SIZE, k.height() / 2 + 150),
        "button",
        k.area(),
        {
          clickAction: onClick,
        },
      ]);
    };

    // Add buttons for choices
    const centerX = k.width() / 2;
    createButton("Rock", centerX - 200, () => {
      playerChoice = "Rock";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    createButton("Paper", centerX, () => {
      playerChoice = "Paper";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    createButton("Scissors", centerX + 200, () => {
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
