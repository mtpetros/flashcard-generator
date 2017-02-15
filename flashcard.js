// var savedBasic = [];
// var savedCloze = [];

function BasicFlashcard(front, back) {
        this.front = front;
        this.back = back;
    }

BasicFlashcard.prototype.printInfo = function() {
    console.log(`Front: ${this.front}
Back: ${this.back}`) 
    };

BasicFlashcard.prototype.save = function() {
    cardList.savedBasic.push(this);
};



function ClozeFlashcard(text, cloze) {
        this.text = text;
        this.cloze = cloze;
    }


var cardList = {
    savedBasic: [],
    savedCloze: [],
    newCategory: function() {
        cardList[newCategory] = {};
    },
    newCard: function() {
        cardList[categoryName][newCard] = {};
    },
    history: {
        hist01: new BasicFlashcard("When was the Declaration of Indepence Signed?", "1776"),
        hist02: new BasicFlashcard("When did Columbus sail to Hispanola?", "1492"),
        hist03: new BasicFlashcard("Who was the first president of the USA?", "George Washington")
    }
};

var newCategory = "sports";
var categoryName = "sports";
var newCard = "sport01";




cardList.newCategory();
cardList.newCard();



cardList.history.hist01.printInfo();
cardList.history.hist02.printInfo();
cardList.history.hist03.printInfo();

cardList.history.hist01.save();
cardList.history.hist02.save();
cardList.history.hist03.save();
console.log(cardList.savedBasic);


console.log(cardList);