import { k } from "./kaboomCtx";

export const rockPaperScissors = () => {
  k.scene("rockPaperScissors", () => {
    const choices = ["rock", "paper", "scissors"] as const;
    const choiceEmojis = { rock: "🪨", paper: "📄", scissors: "💇‍♂️" };
    const fishEmoji = "🐟";

    let playerChoice: "rock" | "paper" | "scissors" | null = null;
    let computerChoice: "rock" | "paper" | "scissors" | null = null;

    let playerScore = 0;
    let computerScore = 0;
    let roundsPlayed = 0;

    const maxRounds = 3;

    const resultText = k.add([
      k.text("Choose your move!", { size: 24 }),
      k.pos(k.width() / 2 - 120, 50),
    ]);

    const playerScoreText = k.add([
      k.text(`Player: ${playerScore}`, { size: 24 }),
      k.pos(20, 10),
    ]);

    const computerScoreText = k.add([
      k.text(`Fish: ${computerScore}`, { size: 24 }),
      k.pos(k.width() - 150, 10),
    ]);

    const fishText = k.add([
      k.text(fishEmoji, { size: 64 }),
      k.pos(k.width() / 2 - 32, 100),
    ]);

    const fishChoiceText = k.add([
      k.text("", { size: 64 }),
      k.pos(k.width() / 2 - 32, 200),
      { visible: false },
    ]);

    const handleResult = () => {
      if (!playerChoice || !computerChoice) return;

      roundsPlayed++;

      // Show the fish's choice
      fishChoiceText.text = choiceEmojis[computerChoice];
      fishChoiceText.visible = true;

      // Delay showing the result to give time to see the fish's choice
      setTimeout(() => {
        if (playerChoice === computerChoice) {
          resultText.text = `It's a tie! Both chose ${choiceEmojis[playerChoice]}`;
        } else if (
          (playerChoice === "rock" && computerChoice === "scissors") ||
          (playerChoice === "paper" && computerChoice === "rock") ||
          (playerChoice === "scissors" && computerChoice === "paper")
        ) {
          playerScore++;
          resultText.text = `You win this round! ${choiceEmojis[playerChoice]} beats ${choiceEmojis[computerChoice]}`;
        } else {
          computerScore++;
          resultText.text = `Fish wins this round! ${choiceEmojis[computerChoice]} beats ${choiceEmojis[playerChoice]}`;
        }

        playerScoreText.text = `Player: ${playerScore}`;
        computerScoreText.text = `Fish: ${computerScore}`;

        if (roundsPlayed >= maxRounds) {
          endGame();
        }
      }, 1000); // 1-second delay
    };

    const endGame = () => {
      if (playerScore > computerScore) {
        resultText.text = `🎉 You win the game!
        Final Score: ${playerScore}-${computerScore}`;
      } else if (computerScore > playerScore) {
        resultText.text = `🐟 The fish wins the game!
        Final Score: ${playerScore}-${computerScore}`;
      } else {
        resultText.text = `It's a tie game!
        Final Score: ${playerScore}-${computerScore}`;
      }

      k.add([
        k.text("Press ESC to return to the main game.", { size: 16 }),
        k.pos(k.width() / 2 - 150, k.height() - 50),
      ]);

      k.onKeyPress("escape", () => {
        k.go("main");
      });

      k.destroyAll("button");
    };

    const createButton = (
      label: "rock" | "paper" | "scissors",
      x: number,
      onClick: () => void
    ) => {
      k.add([
        k.text(choiceEmojis[label], { size: 64 }),
        k.pos(x, k.height() / 2),
        "button",
        k.area(),
        {
          clickAction: onClick,
        },
      ]);
    };

    const centerX = k.width() / 2;
    createButton("rock", centerX - 200, () => {
      playerChoice = "rock";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    createButton("paper", centerX, () => {
      playerChoice = "paper";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    createButton("scissors", centerX + 200, () => {
      playerChoice = "scissors";
      computerChoice = choices[Math.floor(Math.random() * choices.length)];
      handleResult();
    });

    k.onClick("button", (button) => {
      button.clickAction?.();
    });

    k.onKeyPress("escape", () => {
      k.go("main");
    });

    k.onDraw(() => {
      if (roundsPlayed < maxRounds) {
        k.drawText({
          text: "Press ESC to return to the main game.",
          size: 16,
          pos: k.vec2(10, k.height() - 30),
        });
      }
    });
  });
};
