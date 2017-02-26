var fs = require("fs");
var inquirer = require("inquirer");
var right = 0;
var wrong = 0;

//Basic flashcard constructor
function BasicFlashcard(front, back) {
        this.front = front;
        this.back = back;
}


//Basic flaschard save function
BasicFlashcard.prototype.save = function() {
    cardList.savedBasic.push(this);
};


//Cloze flashcard constructor
function ClozeFlashcard(text1, text2, cloze) {
        this.text1 = text1;
        this.text2 = text2;
        this.cloze = cloze;
    }

//Cloze flaschard save function
ClozeFlashcard.prototype.save = function() {
    cardList.savedCloze.push(this);
};

//The object that holds new cards and the methods to save new cards.
var cardList = {
    savedBasic: [],
    savedCloze: [],

    newBasic: {
        front: null,
        back: null,
        newCard: function() {
            var front = this.front;
            var back = this.back;
            var card = new BasicFlashcard(front, back);
            card.save();
            console.log(JSON.stringify(cardList.savedBasic));
            fs.appendFile("basicflashcards.txt", JSON.stringify(cardList.savedBasic[cardList.savedBasic.length-1])+'\n', "utf8", function(err) {
                if (err) throw err;
                console.log("card saved!");
            });
        }
    },

    newCloze: {
        text1: null,
        text2: null,
        cloze: null,
        newCard: function() {
            var text1 = this.text1;
            var text2 = this.text2;
            var cloze = this.coze;
            var card = new ClozeFlashcard(this.text1, this.text2, this.cloze);
            card.save();
            console.log(JSON.stringify(cardList.savedCloze));
            fs.appendFile("clozeflashcard.txt", JSON.stringify(cardList.savedCloze[cardList.savedCloze.length-1])+'\n', function(err) {

            });
        }

    }
};

//functions for review cloze cards
var clozeCount = 0;
function reviewCloze() {
    fs.readFile('./clozeflashcard.txt', 'utf8', (err, data) => {
        if(err) throw err;

        var cardString = data.split('\n');
        var newCardString = cardString.slice(0, cardString.length-1);

        if (clozeCount < newCardString.length) {

            inquirer.prompt([
                {
                    type: "name",
                    name: "cloze",
                    message: JSON.parse(cardString[clozeCount]).text1+" "+Array(JSON.parse(cardString[clozeCount]).cloze.length + 1).join("_ ")+JSON.parse(cardString[clozeCount]).text2
                },
            ]).then((user) => {
                if (user.cloze === JSON.parse(cardString[clozeCount]).cloze) {
                    console.log("correct!");
                    console.log(JSON.parse(cardString[clozeCount]).text1 + ' "' + JSON.parse(cardString[clozeCount]).cloze+ '" ' + JSON.parse(cardString[clozeCount]).text2);
                    console.log(" ");
                    right++;
                } else {
                    console.log("wrong!");
                    console.log("The correct answer is " + JSON.parse(cardString[clozeCount]).text1 + ' "'+JSON.parse(cardString[clozeCount]).cloze+'" ' + JSON.parse(cardString[clozeCount]).text2);
                    console.log(" ");
                    wrong++;
                }

                clozeCount++;
                reviewCloze();
            });            

        } else {
            console.log(" ");
            console.log("Done with the cards!");
            console.log("number correct: " + right);
            console.log("number wrong: " + wrong);
            console.log(" ");
            endPrompt();
        }        

    });
}



//functions for reviewing basic cards
var basicCount = 0;
function reviewBasic() {
    fs.readFile('./basicflashcards.txt', 'utf8', (err, data) => {
        if(err) throw err;

        var cardString = data.split('\n');
        var newCardString = cardString.slice(0, cardString.length-1);

        if (basicCount < newCardString.length) {

            inquirer.prompt([
                {
                    type: "name",
                    name: "front",
                    message: JSON.parse(cardString[basicCount]).front
                },
            ]).then((user) => {
                if (user.front === JSON.parse(cardString[basicCount]).back) {
                    console.log("correct!");
                    console.log(" ");
                    right++;
                } else {
                    console.log("wrong!");
                    console.log("The correct answer is " + '"'+JSON.parse(cardString[basicCount]).back+'"');
                    console.log(" ");
                    wrong++;
                }

                basicCount++;
                reviewBasic();
            });           

        } else {
            console.log(" ");
            console.log("Done with the cards!");
            console.log("number correct: " + right);
            console.log("number wrong: " + wrong);
            console.log(" ");
            endPrompt();
        }        

    });
}



//user prompts to create basic cards
function createBasicCard() {
    inquirer.prompt([
        {
            type: "name",
            name: "cardFront",
            message: "Enter the question or statement for the front of the card."
        },
        {
            type: "name",
            name: "cardBack",
            message: "Enter the answer for the back of the card."
        }
        ]).then((user) => {
            cardList.newBasic.front = user.cardFront;
            cardList.newBasic.back = user.cardBack;
            cardList.newBasic.newCard();
            createBasicCardAgain();
        });
}


//prompts the user to create basic cards again after saving a card
function createBasicCardAgain() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "again",
            message: "Do you want to create another card?"
        }
        ]).then((user) => {
            if (user.again === true) {
                createBasicCard();
            } else {
                initialPrompt();
            }
        });
}


//prompts the user to create a cloze card
function createClozeCard() {
    inquirer.prompt([
        {
            type: "name",
            name: "text1",
            message: "Enter the text before the cloze (if none, press Enter)."
        },
        {
            type: "name",
            name: "cloze",
            message: "Enter the cloze."
        },
        {
            type: "name",
            name: "text2",
            message: "Enter the text after the cloze (if none, press Enter)."
        }
        ]).then((user) => {
            cardList.newCloze.text1 = user.text1;
            cardList.newCloze.cloze = user.cloze;
            cardList.newCloze.text2 = user.text2;
            cardList.newCloze.newCard();
            createClozeCardAgain();
        });
}


//prompts the user to create a cloze card again after saving a cloze card
function createClozeCardAgain() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "again",
            message: "Do you want to create another card?"
        }
        ]).then((user) => {
            if (user.again === true) {
                createClozeCard();
            } else {
                initialPrompt();
            }
        });
}


//asks the user what kind of cards to review
function reviewCardsPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "reviewCardType",
            message: "Do you want to review basic cards or cloze cards?",
            choices: ["basic cards", "cloze cards"]
        }
        ]).then((user) => {
            if (user.reviewCardType === "basic cards") {
                reviewBasic();
            } else if (user.reviewCardType === "cloze cards") {
                reviewCloze();
            } else {
                console.log("Invalid Choice!");
                reviewCardsPrompt();
            }
        });
}



//the initial user prompt
function initialPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Do you want to create new cards or review cards?",
            choices: ["review cards", "create new basic cards", "create new cloze cards"]
        }
        ]).then((user) => {
            if (user.options === "review cards") {
                reviewCardsPrompt();
            } else if (user.options === "create new basic cards") {
                createBasicCard();
            } else if (user.options === "create new cloze cards") {
                createClozeCard();
            } else {
                console.log("Invalid Choice!")
                initialPrompt();
            }
        });
}



//after reviewing cards, prompts the user to either start over or exit
function endPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "endPrompt",
            message: "Do you want to start over or quit?",
            choices: ["start over", "quit"]
        }
        ]).then((user) => {
            if (user.endPrompt === "start over") {
                initialPrompt();
            } else if (user.endPrompt === "quit") {
                process.exit(0);
            } else {
                console.log("Invalid Option!");
                endPrompt();
            }

        });
}



initialPrompt();