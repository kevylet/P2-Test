var game = new Phaser.Game(800, 800, Phaser.CANVAS, 'P2-Test', { preload: preload, create: create, update: update, render: render });

function preload() { //Load sprites & collision polygons
	game.load.spritesheet('squareSheet', 'sprites/squareSheet.png', 32, 32, 2);
}

//Global Variables
var square;
var keys;
var space;

function create() {
	game.world.setBounds(0, 0, 800, 800);
	
	game.physics.startSystem(Phaser.Physics.P2JS); //Add P2 physics
	game.physics.p2.defaultRestitution = .8; //This sets the default 'bounciness' of collisions
	
	square = game.add.sprite(400, 400, 'squareSheet', 0); //Add sprite
	
	//Input definitions
	keys = game.input.keyboard.createCursorKeys();
	space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	game.input.keyboard.addKeyCapture([keys, space]);
	game.input.onDown.add(toggleSquare, this);
	
	//Enable P2 physics for the object (this also enables physics for all of its children)
	//By default, this will give the sprite a rectangular physics body the size of the sprite (which should be fine for modules)
	game.physics.p2.enable(square);
	
	square.body.damping = .75; //This value (from 0 to 1) determines the proportion of velocity lost per second
	square.body.angularDamping = .9;  //Same but for angular velocity
}

function toggleSquare(pointer) {
	//hitTest is used to check collision on a body and returns the body clicked on, or nothing if a blank space is clicked on
	//The second argument can be an array of sprites or bodies that hitTest will check against, otherwise hitTest will check against all bodies
	var clicked = game.physics.p2.hitTest(pointer.position, [square]);
	
	if(clicked[0].parent.sprite.frame == 0) {
		clicked[0].parent.sprite.frame = 1;
	}
	else {
		clicked[0].parent.sprite.frame = 0;
	}
}

function update() {
	if(keys.left.isDown) {
	//Angular force & angular velocity are measured in radians/second where positive is clockwise & negative is counter-clockwise
		if(square.body.angularVelocity > -9) { 
			square.body.angularForce += -3;
		}
	}
	if(keys.right.isDown) {
		if(square.body.angularVelocity < 9) {
			square.body.angularForce += 3;
		}
	}
	if(space.isDown && square.frame == 0) {
		square.body.thrust(250); //thrust(x) makes the object accelerate forwards (relative to its direction) up to a velocity of x pixels/second
	}
}

function render() {
	//This could probably be useful for something
}
