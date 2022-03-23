import Phaser from 'phaser'
import * as SceneKeys from '../constants/SceneKeys'
import * as Colors from '../constants/Colors'
import * as Audio from '../constants/Audio'

const GameState = {
    Running: 'running',
    PlayerWon: 'player-won',
    AIWon: 'ai-won'
}

export default class Game extends Phaser.Scene {

    init() {
        this.gameState = GameState.Running 
        this.paddleRightVelocity = new Phaser.Math.Vector2(0,0)
        this.rightScore = 0
        this.leftScore = 0
        this.paused = false
    }

    create() {
        console.log(wagmiballz[0].image);
        this.load.image('wagmiball', wagmiballz[0].image);


        
        this.scene.run(SceneKeys.GameBackground)
        this.scene.sendToBack(SceneKeys.GameBackground)

        this.physics.world.setBounds(-100, 0, 1000, 500)
        // this.physics.world.
        // this.add.text(400, 250, 'Game')

        this.ball = this.add.image(100, 100, 'wagmiball'); // this.add.circle(400, 250, 20, Colors.white, 10)
        this.physics.add.existing(this.ball)
        this.ball.body.setCircle(10)
        this.ball.body.setBounce(1, 1)

        this.ball.body.setCollideWorldBounds(true, 1, 1)

        this.time.delayedCall(1500, () => {
            this.resetBall()
        })

        
        this.paddleLeft = this.add.rectangle(50, 250, 20, 100, 0xffffff, 1)
        this.physics.add.existing(this.paddleLeft, true) // true makes it static and not move back when ball collides
        this.physics.add.collider(this.paddleLeft, this.ball, this.handdlePaddleBallCollision, undefined, this)
        
        this.paddleRight = this.add.rectangle(750, 250, 20, 100, 0xffffff, 1)
        this.physics.add.existing(this.paddleRight, true) // true makes it static and not move back when ball collides
        this.physics.add.collider(this.paddleRight, this.ball, this.handdlePaddleBallCollision, undefined, this)
        
        const scoreStyle = {
            fontSize: 48,
            fontFamily: SceneKeys.Font
        }

        this.leftScoreLabel = this.add.text(300, 125, '0', scoreStyle)
        .setOrigin(0.5, 0.5)

        this.rightScoreLabel = this.add.text(500, 375, '0', scoreStyle)
        .setOrigin(0.5, 0.5)

        this.cursors = this.input.keyboard.createCursorKeys()

    }   

    handdlePaddleBallCollision(paddle, ball) {
        // console.log(ball);
        this.sound.play(Audio.Paddle)
    }

    update() {

        // pause or finish game
        if (this.paused || this.gameState !== GameState.Running) {
            return
        }
        
        // player 1 input 
        this.player1()

        // AI paddle logic
        this.updateAI()

        // Update score if ball passes edges
        this.updateScore()


       
    }

    updateAI() {
        const diff = this.ball.y - this.paddleRight.y

        if (Math.abs(diff) < 10) {
            return
        }

        const aiSpeed = 3
        // console.log(diff);
        if (diff < 0 ) {

            //  ball above paddle
            this.paddleRightVelocity.y = -aiSpeed
            
            if (this.paddleRightVelocity.y < -10) {
                this.paddleRightVelocity.y = -10
            }
        } else if (diff > 0) {
            this.load.audio(Audio.Score, 'assets/score.wav')

            // ball below paddle
            this.paddleRightVelocity.y = aiSpeed

            if (this.paddleRightVelocity.y > 10) {
                this.paddleRightVelocity.y = 10
            }

        }

        this.paddleRight.y += this.paddleRightVelocity.y
        this.paddleRight.body.updateFromGameObject()
    }

    updateScore() {

        const x = this.ball.x
        const leftBounds = -30
        const rightBounds = 830

        if (x >= leftBounds && x <= rightBounds)  {
            return
        }

        if(this.ball.x < leftBounds) {
            this.sound.play(Audio.Score)

            // left side score, 
            this.resetBall()
            this.incrementRightScore()

        } else if (this.ball.x > rightBounds) {
            this.sound.play(Audio.Score)

            this.resetBall()
            this.incrementLeftScore()

        }


        const maxScore = 7



        if (this.leftScore >= maxScore) {
            //player one
            console.log('player one wns');
            // this.paused = true  
            this.gameState = GameState.PlayerWon
          } else if (this.rightScore >= maxScore) {
            console.log('AI  won');
            // this.paused = true
            this.gameState = GameState.AIWon

        }

        if (this.gameState === GameState.Running)  {
            this.resetBall()
        } else {
            // game over
            this.ball.active = false
            this.physics.world.remove(this.ball.body)

            this.scene.stop(SceneKeys.GameBackground)

            // play game over scene
            this.scene.start(SceneKeys.GameOver, {
                leftScore: this.leftScore,
                rightScore: this.rightScore     
            })
        }
    }

    player1() {
        // this tells vscode that body is of type  Phaser.Physics.Arcade.Body
        /** @type { Phaser.Physics.Arcade.Body } */
        const body = this.paddleLeft.body 

        if(this.cursors.up.isDown) {
            this.paddleLeft.y += -10
            body.updateFromGameObject()

        } else if (this.cursors.down.isDown) {
            this.paddleLeft.y += 10
            body.updateFromGameObject()
        } 
    }

    incrementLeftScore() {
        this.leftScore += 1
        this.leftScoreLabel.text = this.leftScore
    }

    incrementRightScore() {
        this.rightScore += 1
        this.rightScoreLabel.text = this.rightScore
    }


    resetBall() {
        this.ball.setPosition(400, 250)
        const angle = Phaser.Math.Between(0, 360)
        const vec = this.physics.velocityFromAngle(angle, 300)

        this.ball.body.setVelocity(vec.x, vec.y)
    }
}

// export default Game