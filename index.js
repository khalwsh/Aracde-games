const gameCards = document.querySelectorAll(".game-card");


let descriptions = [
    // 1. XO 
    "A classic two-player game where you take turns placing Xs and Os on a 3×3 grid. Be the first to get three in a row—horizontally, vertically, or diagonally—to win!",
  
    // 2. Snake Game
    "Control a growing snake as it slithers around the board eating food. Each bite makes you longer—avoid hitting the walls or your own tail to keep going!",
  
    // 3. Rock Paper Scissor
    "Face off against the computer in this hand-gesture duel. Choose rock, paper, or scissors—paper beats rock, scissors beat paper, and rock beats scissors!",
  
    // 4. Pong Game
    "The original arcade classic: bounce the ball past your opponent’s paddle to score. Play solo against AI or head-to-head with a friend!",
  
    // 5. Minesweeper Game
    "Reveal empty squares while avoiding hidden mines. Use the numbers you uncover as clues to flag where mines are lurking—clear the board without triggering one!",
  
    // 6. Memory Flip Game
    "Flip over cards two at a time to find matching pairs. Train your concentration and recall—clear all the cards in as few moves as possible!",
  
    // 7. Flappy Bird Game
    "Tap to keep the bird airborne and navigate through a series of tightly spaced pipes. Timing and precision are everything—how far can you go?",
  
    // 8. Code Brick Game
    "A twist on Breakout: use your paddle to bounce a ball and break bricks. Collect power-ups, avoid pitfalls, and clear all bricks to advance!",
  
    // 9. 2048
    "Slide numbered tiles on a 4×4 grid, combining matching numbers to create higher values. Reach the 2048 tile to win—but watch out, the board fills up fast!",
  
    // 10. Tetris
    "Rotate and drop falling tetrominoes to form full horizontal lines. Clear lines to score points and keep the stack from reaching the top!",
  
    // 11. Fish
    "Swim through an underwater maze as a hungry fish, gobbling up smaller prey to grow larger—just don't become someone else’s dinner!",
  
    // 12. Ludo
    "Race your four tokens from start to finish by rolling dice. Move strategically, send opponents’ tokens back to start, and be the first to get all home!"
  ];
  
  

gameCards.forEach((card, index) => {
    const img = card.querySelector("img");

    // Create the description box
    const descBox = document.createElement("div");
    descBox.style.position = "absolute";
    descBox.style.width = "200px";
    descBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    descBox.style.color = "white";
    descBox.style.textAlign = "center";
    descBox.style.fontSize = "12px";
    descBox.style.padding = "5px";
    descBox.style.borderRadius = "5px";
    descBox.style.display = "none";
    descBox.style.zIndex = "100";
    descBox.textContent = descriptions[index]; 
    document.body.appendChild(descBox);

    // Show description on hover
    img.addEventListener("mouseenter", (e) => {
        const rect = img.getBoundingClientRect();
        descBox.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 50}px`;
        descBox.style.top = `${rect.top + window.scrollY - 75}px`;
        descBox.style.display = "block";
    });

    img.addEventListener("mouseleave", () => {
        descBox.style.display = "none";
    });
})



  