var nDraws = 0;
var score = 100;
var sDir = "jsworkshop_art/"; // hard code the directory prefix
var myHand;
var myDeck;

/*
* pokerRank enables looking up the point value and text description of a
*  possible poker hand
*  TODO: Is this the "Javascript Way"?
*/
var pokerRank = [
[  0, "No score"],
[  1, "Jacks or Better"],
[  2, "Two Pair"],
[  3, "Three of a Kind"],
[  4, "Straight"],
[  5, "Flush"],
[ 10, "Full House"],
[ 25, "Four of a Kind"],
[ 50, "Straigh Flush"],
[100, "Royal Flush"],
];
var ciPRNoScore = 0;
var ciPRJacksOrBetter = 1;
var ciPRTwoPair = 2;
var ciPRThreeOfAKind = 3;
var ciPRStraight = 4;
var ciPRFlush = 5;
var ciPRFullHouse = 6;
var ciPRFourOfAKind = 7;
var ciPRStraightFlush = 8;
var ciPRRoyalFlush = 9;

var ciTIAce = 0;
var ciTITen = 9;
var ciTIJack = 10;
var ciTIQueen = 11;
var ciTIKing = 12;

function addToScore(n) {
  score += n;
  document.form1.total.value = score;
}

/*
* The following function is an entrypoint from HTML
*/
function DealDraw() {
  if(nDraws > 0) {
    // there is still a draw left
    myHand[0].Draw(myDeck);
    nDraws--;
    if( nDraws == 0) {
      addToScore(pokerRank[myHand[0].getRank()][0]);
      setDealDraw("deal.gif");
    }
  } else {
    myDeck = new Deck();
    myHand = new Array(1);

    myDeck.shuffle();
    myHand[0] = new Hand(1);
    myHand[0].Deal(myDeck);
    nDraws = 3;
    addToScore(-1); // deduct one for bet amount
    setDealDraw("draw.gif");
  }
}

/*
* The following function is an entrypoint from HTML
*/
function Hold(iHand,num) {
  if( myHand[iHand] == null) {
    return;
  }

  myHand[iHand].toggleHold(num);
}

function Deck() {
  this.cards = new Array(52);
  this.iCard = 0;

  // fill the deck (in order, for now)
  for(var i=0; i<13; i++) {
    this.cards[i+ 0] = new Card(i+1,"c");
    this.cards[i+13] = new Card(i+1,"h");
    this.cards[i+26] = new Card(i+1,"s");
    this.cards[i+39] = new Card(i+1,"d");
  }

  this.dealNext = function() {
    // TODO: What if we go past the last card?
    if( this.iCard == this.cards.length ) {
      this.iCard = 0;
    }
    return this.cards[this.iCard++];
  }

  this.shuffle = function() {
    // shuffle the deck
    var n = Math.floor(400 * Math.random() + 500);
    for (var i=1; i<n; i++) {
      card1 = Math.floor(52*Math.random());
      card2 = Math.floor(52*Math.random());

      var temp = this.cards[card2];
      this.cards[card2] = this.cards[card1];
      this.cards[card1] = temp;
    }
  }
}

// Numeric sort function used by "sort"
function Numsort(a,b) { return a - b; }

//
// Defines "Hand" object, where said object refers to a "hand" of cards in
//  a card game
//
function Hand(imageStart) {
  this.cards = new Array(5);
  // TODO: I tried many different configurations for this.hold array but
  //  could not reliably get it to reset in between draws. It does get reset
  //  right before a deal()
  this.hold = [false, false, false, false, false];

   // TODO: at some point, iImageBase would be used to support multiple screens at once.
  this.iImageBase = imageStart;
  this.rank = 0;

  //
  // The next four functions relate to the "hold" property which parallels the list
  // of cards and can control whether the card is discarded for not.
  this.setHold = function(iCard) {
    this.hold[iCard] = true;
    document.images[this.iImageBase+iCard+5].src = sDir + "hold2.gif";
  }

  this.clrHold = function(iCard) {
    this.hold[iCard] = false;
    document.images[this.iImageBase+iCard+5].src = sDir + "hold.gif";
  }

  this.getHold = function(iCard) {
    return this.hold[iCard];
  }

  this.toggleHold = function(iCard) {
    if( this.getHold(iCard)) {
      this.clrHold(iCard);
    } else {
      this.setHold(iCard);
    }
  }


  // The next three functions calculate, set and get the rank related attributes
  this.calcRank = function() {
    var straight = false;
    var flush = false;
    var pairs = 0;
    var three = 0;
    var tally = new Array(13);

    // sorted array for convenience
    var nums = new Array(5);
    for( i=0; i<5; i++) {
      nums[i] = this.cards[i].num;
    }

    nums.sort(Numsort);

    // flush
    if( this.cards[0].suit == this.cards[1].suit &&
        this.cards[1].suit == this.cards[2].suit &&
        this.cards[2].suit == this.cards[3].suit &&
        this.cards[3].suit == this.cards[4].suit) {
      flush = true;
    }

    // straight (Ace low)
    if( nums[0] == nums[1] - 1 &&
        nums[1] == nums[2] - 1 &&
        nums[2] == nums[3] - 1 &&
        nums[3] == nums[4] - 1) {
      straight = true;
    }

    // straigh (Ace high)
    if( nums[0] == 1 &&
        nums[1] == 10 &&
        nums[2] == 11 &&
        nums[3] == 12 &&
        nums[4] == 13 ) {
          straight = true;
        }

    // royal flush, straigh flush, straigh, flush
    if( straight && flush) {
      if( nums[4] == 13 && nums[1] == 1) {
        return ciPRRoyalFlush;
      } else {
        return ciPRStraightFlush;
      }
    }

    if( straight ) {
      return ciPRStraight;
    }
    if( flush ) {
      return ciPRFlush;
    }

    // tally array is a count for each card value
    for( i=0; i<13; i++) {
      tally[i] = 0;
    }

    for( i=0; i<5; i++) {
      tally[nums[i]-1]++;
    }

    for( i=0; i<13; i++) {
      if( tally[i] == 4) {
        return ciPRFourOfAKind;
      }
      if( tally[i] == 3) {
        three = true;
      }
      if( tally[i] == 2) {
        pairs++;
      }
    }

    if( three && pairs == 1) {
      return ciPRFullHouse;
    }

    if( pairs == 2) {
      return ciPRTwoPair;
    }

    if( three ) {
      return ciPRThreeOfAKind;
    }

    if( pairs == 1) {
      if( tally[ciTIAce] == 2 ||
          tally[ciTIJacks] == 2 ||
          tally[ciTIQueen] == 2 ||
          tally[ciTIKing] == 2) {
      return ciPRJacksOrBetter;
      }
    }

    return ciPRNoScore;
  }

  this.getRank = function() {
    return this.rank;
  }

  this.setRank = function() {
    this.rank = this.calcRank();
    document.form1.message.value = pokerRank[this.rank][1];
  }

  this.addCardToHand = function(deck, iCard) {
    this.cards[iCard] = deck.dealNext();
    document.images[this.iImageBase+iCard].src = this.cards[iCard].fname;
    this.clrHold(iCard);
  }

  // TODO: for now, each hand gets the next five cards
  //  but if the dealing were animated this way with multiple
  //  players, the players wouldn't like it this way because they
  //  would expect cards to be dealt "round robin"
  this.Deal = function(deck) {
    for(var i=0; i<5; i++) {
      this.addCardToHand(deck, i);
    }
    this.setRank();
  }

  this.Draw = function(deck) {
    for(var i=0; i<5; i++) {
      if(! this.getHold(i)) {
        this.addCardToHand(deck, i);
      }
    }
    this.setRank();
  }
}

// Constructor for Card objects
function Card(num, suit) {
  this.num = num;
  this.suit = suit;
  this.fname = sDir + this.num + this.suit + ".gif";
}

function setDealDraw(fileImage) {
  document.images[11].src = sDir + fileImage;
}
