class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
        this.wallA
        this.wallB
    }

    init() 
    {
        // useful variables
        this.SHOT_VELOCITY_X = 200

        this.SHOT_VELOCITY_Y_MIN = 700

        this.SHOT_VELOCITY_Y_MAX = 1100

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, "cup")
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, "ball")
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        this.wallA = this.physics.add.sprite(0, height / 4, "wall")
        this.wallA.setX(Phaser.Math.Between(-this.wallA.width / 2, width - this.wallA.width / 2))
        this.wallA.body.setCollideWorldBounds(true)
        this.wallA.body.setBounce(1)
        this.wallA.body.setImmovable(true)


        this.wallB = this.physics.add.sprite(0, height / 4, "wall")
        this.wallB.setX(Phaser.Math.Between(-this.wallB.width / 2, width - this.wallB.width / 2))
        this.wallB.setY(500)
        this.wallB.body.setVelocityX(-50)
        this.wallB.body.setCollideWorldBounds(true)
        this.wallB.body.setBounce(1)
        this.wallB.body.setImmovable(true)


        // add one-way
        this.oneWay = this.physics.add.sprite(width / 2,  height / 4, "oneway")
        this.oneWay.setX(Phaser.Math.Between(this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.setY(300)
        this.oneWay.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on("pointerdown", (pointer) => 
        {
            let shotDirection = pointer.y <= this.ball.y ? -1 : 1
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX))
        })


        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => 
        {
            ball.destroy()
            //ball reset logic
            this.ball.setX(width / 2)
            this.ball.setY(height - height / 10)
        })

        // ball/wall collision
        this.walls = this.add.group([this.wallA, this.wallB])
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

    }

    update() 
    {
        //make wall B move bounce on screen edges
        if (this.wallB.x <= 0 || this.wallB.x + this.wallB.width >= this.sys.config.width) 
        {
            this.wallB.body.velocity.x  *= -1
        }
        
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[x] Add ball reset logic on successful shot
[x] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[x] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/