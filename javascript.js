const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor() {
        this.position = {
            x: canvas.width / 2,
            y: canvas.height - 120
        };

        this.velocity = {
            x: 0,
            y: 0
        };
        this.rotation = 0;

        this.image = new Image();
        this.image.src = './Images/Money.png';
        this.image.onload = () => {
            const scale = 0.15;
            this.width = this.image.width * scale;
            this.height = this.image.height * scale;
            this.draw();
        };
    }

    draw() {
        if (this.image) {
            c.save();
            c.translate(this.position.x, this.position.y);
            c.rotate(this.rotation);

            c.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
            c.restore();
        }
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;

        this.radius = 3;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'red';
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Invader {
    constructor({ position }) {
        this.position = {
            x: position.x,
            y: position.y
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        this.image = new Image();
        this.image.src = './Images/pig-.png'; // Adjust the image path as needed
        this.image.onload = () => {
            const scale = .50 ; // Adjust the scale value as needed
            this.width = this.image.width * scale;
            this.height = this.image.height * scale;
            this.draw();
        };
    }

    draw() {
            c.drawImage(
                this.image,
                this.position.x - this.width / 2,
                this.position.y - this.height / 2,
                this.width,
                this.height
            );
    }

    update() {
        if (this.image) {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        }
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        this.invaders = [];
        
        let startX = 50;
        let startY = 300; // Adjust this value as needed
        let spacingX = 500; // Adjust this value to control horizontal spacing 

        for(let x = 0; x < 5; x++){
            for (let y = 0; y < 3; y++) {
                this.invaders.push(new Invader({
                    position: {
                        x: (x * 100) + canvas.width / 2.5,
                        y: (y * 100) + 100,
                    }
                }))
            }
        }
        
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.invaders.forEach(invader => {
            invader.update();
        });
    }
}

const player = new Player();
const projectiles = [];
const grids = [new Grid()];

const keys = {
    a: false,
    d: false
};

function animate() {
    requestAnimationFrame(animate);

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (keys.a && player.position.x >= 25) {
        player.velocity.x = -5;
        player.rotation = -0.15;
    } else if (keys.d && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 5;
        player.rotation = 0.15;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }

    player.update();
    player.draw();

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            projectiles.splice(index, 1);
        } else {
            projectile.update();
        }
    });

    grids.forEach(grid => {
        grid.update();
        grid.invaders.forEach((invader, i) => {
            invader.update();

            projectiles.forEach((projectile, j) => {
                if (
                    projectile.position.y - projectile.radius <=
                    invader.position.y + invader.height
                ){
                    setTimeout(() => {
                        grid.invaders.splice(i, 1)
                        projectiles.splice(j, 1)
                    }, 0)
                }
            })
        });
    });
}

animate();

addEventListener('keydown', (event) => {
    if (event.key === 'a') {
        keys.a = true;
    } else if (event.key === 'd') {
        keys.d = true;
    } else if (event.key === ' ') {
        projectiles.push(
            new Projectile({
                position: {
                    x: player.position.x,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -5
                }
            })
        );
    }
});

addEventListener('keyup', (event) => {
    if (event.key === 'a') {
        keys.a = false;
    } else if (event.key === 'd') {
        keys.d = false;
    }
});
