# Poker Game - multi draw
# by Charles Gust
This poker game is based on the game from SAMS Teach Yourself Javascript in 24 Hours

Two significant differences may be noted from SAMS game.
1. SAMS game was mostly procedural, and the multi-draw version here is mostly OO with new Deck and Hand objects
2. Instead of one draw and a boolean that flips between draw and deal, there is now a count for how many draws
    you are permitted.

Some remaining items to do:
1. Try to find an explanation for why the ClrHold() function is not clearing the hold array. This was intended to be cleared
   after every draw, however, the current behavior is acceptable because often in a multi-draw game, the same cards are held
   repeatedly.
2. There has to be a way to parameterize the HTML. That is, there is probably a way to do this without having the HTML code
   repeat five times.
3. There is an array lookup to map poker rank to the points the rank is worth, and the message to be displayed for that rank.
   However, I don't see a lot of these "lookup" arrays when I look at other Javascript code. Do Javascript programmers tend to
   use object literals and key value pairs instead?

