import React, { useEffect, useRef, useState } from 'react';

const BreakoutGame = () => {
  // Game constants
  const BRICK_ROWS = 5;
  const BRICK_COLUMNS = 7;
  const BRICK_WIDTH = 75;
  const BRICK_HEIGHT = 20;
  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 10;
  const BALL_RADIUS = 10;

  // Powerup types
  const POWERUP_TYPES = {
    EXPAND_PADDLE: 'expand_paddle',
    SLOW_BALL: 'slow_ball',
    SPLIT_BALL: 'split_ball',
  };

  // Level designs
  const LEVELS = [
    // Level 1: Basic layout
    [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    // Level 2: Checkerboard pattern
    [
      [1, 0, 1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 1],
    ],
    // Level 3: Pyramid pattern
    [
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 0, 0],
    ],
  ];

  const canvasRef = useRef(null);
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isLevelStarted, setIsLevelStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Refs to track state
  const ballsRef = useRef([{ x: 400, y: 300, dx: 4, dy: -4 }]);
  const paddleXRef = useRef(400);
  const bricksRef = useRef([]);
  const powerupsRef = useRef([]);
  const paddleWidthRef = useRef(PADDLE_WIDTH);
  const ballSpeedRef = useRef(4);
  const stageRef = useRef(stage);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const gameOverRef = useRef(gameOver);

  // Update refs when state changes
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('breakoutHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('breakoutHighScore', score.toString());
    }
  }, [score, highScore]);

  

  // Initialize bricks based on the current stage
  const initBricks = () => {
    if (stageRef.current > LEVELS.length) {
      setGameOver(true); // No more levels, game completed
      return;
    }
    else if (isLevelStarted)
    {
        return;
    }
    
    const level = LEVELS[stageRef.current - 1]; // Get the current level design
    bricksRef.current = [];
    for (let i = 0; i < BRICK_ROWS; i++) {
      bricksRef.current[i] = [];
      for (let j = 0; j < BRICK_COLUMNS; j++) {
        bricksRef.current[i][j] = { x: 0, y: 0, status: level[i][j] };
      }
    }
    setIsLevelStarted(true);
  };

  // Reset ball and paddle position
  const resetBallAndPaddle = () => {
    ballsRef.current = [{ x: 400, y: 300, dx: 4, dy: -4 }]; // Reset to one ball
    paddleXRef.current = (canvasRef.current.width - paddleWidthRef.current) / 2;
    ballSpeedRef.current = 4; // Reset ball speed
  };

   // Reset the entire game
   const resetGame = () => {
    setStage(1);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsLevelStarted(false);
    stageRef.current = 1;
    scoreRef.current = 0;
    livesRef.current = 3;
    gameOverRef.current = false;
    ballsRef.current = [{ x: 400, y: 300, dx: 4, dy: -4 }];
    paddleXRef.current = 400;
    bricksRef.current = [];
    powerupsRef.current = [];
    paddleWidthRef.current = PADDLE_WIDTH;
    ballSpeedRef.current = 4;
    initBricks();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleXRef.current, canvas.height - PADDLE_HEIGHT, paddleWidthRef.current, PADDLE_HEIGHT);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    };

    const drawBalls = () => {
      ballsRef.current.forEach((ball) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      });
    };

    const drawBricks = () => {
      const offsetX = (canvas.width - (BRICK_COLUMNS * (BRICK_WIDTH + 10))) / 2; // Center bricks horizontally
      for (let i = 0; i < BRICK_ROWS; i++) {
        for (let j = 0; j < BRICK_COLUMNS; j++) {
          if (bricksRef.current[i][j].status === 1) {
            const brickX = j * (BRICK_WIDTH + 10) + offsetX;
            const brickY = i * (BRICK_HEIGHT + 10) + 30;
            bricksRef.current[i][j].x = brickX;
            bricksRef.current[i][j].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const drawPowerups = () => {
      powerupsRef.current.forEach((powerup) => {
        ctx.beginPath();
        ctx.rect(powerup.x, powerup.y, 20, 20);
        ctx.fillStyle = powerup.color;
        ctx.fill();
        ctx.closePath();
      });
    };

    const collisionDetection = () => {
      ballsRef.current.forEach((ball) => {
        for (let i = 0; i < BRICK_ROWS; i++) {
          for (let j = 0; j < BRICK_COLUMNS; j++) {
            const brick = bricksRef.current[i][j];
            if (brick.status === 1) {
              if (
                ball.x > brick.x &&
                ball.x < brick.x + BRICK_WIDTH &&
                ball.y > brick.y &&
                ball.y < brick.y + BRICK_HEIGHT
              ) {
                ball.dy = -ball.dy;
                brick.status = 0;
                setScore((prevScore) => prevScore + 1);

                // Spawn powerup randomly
                if (Math.random() < 0.2) {
                  const powerupType = Object.values(POWERUP_TYPES)[Math.floor(Math.random() * 3)];
                  powerupsRef.current.push({
                    x: brick.x + BRICK_WIDTH / 2,
                    y: brick.y + BRICK_HEIGHT / 2,
                    type: powerupType,
                    color: getPowerupColor(powerupType),
                  });
                }
              }
            }
          }
        }
      });
    };

    const applyPowerup = (powerup) => {
      switch (powerup.type) {
        case POWERUP_TYPES.EXPAND_PADDLE:
          paddleWidthRef.current = PADDLE_WIDTH * 1.5;
          setTimeout(() => (paddleWidthRef.current = PADDLE_WIDTH), 5000); // Reset after 5 seconds
          break;
        case POWERUP_TYPES.SLOW_BALL:
          ballSpeedRef.current = 2;
          setTimeout(() => (ballSpeedRef.current = 4), 5000); // Reset after 5 seconds
          break;
        case POWERUP_TYPES.SPLIT_BALL:
          if (ballsRef.current.length < 4) {
            const newBall = { ...ballsRef.current[0], dx: -ballsRef.current[0].dx }; // Create a new ball with opposite direction
            ballsRef.current.push(newBall);
          }
          break;
        default:
          break;
      }
    };

    const getPowerupColor = (type) => {
      switch (type) {
        case POWERUP_TYPES.EXPAND_PADDLE:
          return 'green';
        case POWERUP_TYPES.SLOW_BALL:
          return 'blue';
        case POWERUP_TYPES.SPLIT_BALL:
          return 'purple';
        default:
          return 'black';
      }
    };

    const checkStageCompletion = () => {
      if (bricksRef.current.every((row) => row.every((brick) => brick.status === 0))) {
        console.log("stage: " + stage + " level: " + LEVELS.length)
        if (stageRef.current <= LEVELS.length) {
          setIsLevelStarted(false);
          setStage((prevStage) => prevStage + 1); // Move to the next stage
          resetBallAndPaddle(); // Reset ball and paddle
        } else {
          setGameOver(true); // Game completed
        }
      }
    };

    // Draw function is responsible for drawing the entire canvas
    const draw = () => {
      // Stop if game is over or canvas is null
      if (gameOverRef.current || !canvasRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw a solid background
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawBricks();
      drawBalls();
      drawPaddle();
      drawPowerups();
      collisionDetection();
      checkStageCompletion();

      // Ball movement
      ballsRef.current.forEach((ball) => {
        ball.x += ball.dx * (ballSpeedRef.current / 4);
        ball.y += ball.dy * (ballSpeedRef.current / 4);

        // Wall collision
        if (ball.x + ball.dx > canvas.width - BALL_RADIUS || ball.x + ball.dx < BALL_RADIUS) {
          ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < BALL_RADIUS) {
          ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - BALL_RADIUS) {
          if (ball.x > paddleXRef.current && ball.x < paddleXRef.current + paddleWidthRef.current) {
            ball.dy = -ball.dy;
          } else {
            // Remove the ball if it hits the bottom
            ballsRef.current = ballsRef.current.filter((b) => b !== ball);
            if (ballsRef.current.length === 0) {
              setLives((prevLives) => {
                if (prevLives === 1) {
                  setGameOver(true);
                  return 0;
                }
                return prevLives - 1;
              });
              if (livesRef.current === 0) {
                setGameOver(true);
              } else {
                resetBallAndPaddle();
              }
            }
          }
        }
      });

      // Powerup movement and collision
      powerupsRef.current.forEach((powerup, index) => {
        powerup.y += 2; // Move powerup down
        if (
          powerup.y + 20 > canvas.height - PADDLE_HEIGHT &&
          powerup.x > paddleXRef.current &&
          powerup.x < paddleXRef.current + paddleWidthRef.current
        ) {
          applyPowerup(powerup);
          powerupsRef.current.splice(index, 1); // Remove powerup after collection
        }
      });

      // Paddle movement
      const handleMouseMove = (e) => {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
          paddleXRef.current = relativeX - paddleWidthRef.current / 2;
        }
      };

      // Paddle movement (touch)
      const handleTouchMove = (e) => {
        const touch = e.touches[0]; // Get the first touch
        const relativeX = touch.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
          paddleXRef.current = relativeX - paddleWidthRef.current / 2;
        }
      };

      // Add event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);

      requestAnimationFrame(draw);

      // Cleanup event listeners on unmount
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
      };
    };

    initBricks();
    resetBallAndPaddle();

    const animationFrameId = requestAnimationFrame(draw);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stage, lives, gameOver]);

  return (
    <div>
      <h1>Breakout - Stage {stage}.</h1>
      <p>Score: {score} | Lives: {lives} | High Score: {highScore}</p>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: "1px solid black", position: "relative" }} />
      {gameOver && (
        <div>
          <p>Game Over! Refresh or click to play again.</p>
          <div className="btn-bar">
            <button className="px-btn px-btn-theme"  onClick={resetGame}>
            Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakoutGame;