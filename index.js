(function() {
    "use strict";
    var fetchId = function(e_id) {
      var element = document.getElementById(e_id);
      return element;
    };
    var fetchClassIn = function(e_class, e_parent) {
      var elements = e_parent.getElementsByClassName(e_class);
      if (elements.length > 1) {
        return elements;
      } else {
        return elements[0];
      }
    };
    var changeSide = function(element, new_class) {
      var sides_reg = /(one|two|three|four|five|six)/g;
      var roll_class = element.className.replace(sides_reg, new_class);
      element.className = roll_class;
    };
    var pickDice = function(dice_id) {
      var $dice = fetchId(dice_id);
      var $dice_side = fetchClassIn("dice_side", $dice);
      return $dice_side;
    };
    var Dice = function(dice_name) {
      this.dice = pickDice(dice_name);
      this.sides = 6;
      this.roll = function() {
        var rand_num = Math.floor(Math.random() * this.sides) + 1;
        switch (rand_num) {
          case 1:
            changeSide(this.dice, "one");
            break;
          case 2:
            changeSide(this.dice, "two");
            break;
          case 3:
            changeSide(this.dice, "three");
            break;
          case 4:
            changeSide(this.dice, "four");
            break;
          case 5:
            changeSide(this.dice, "five");
            break;
          case 6:
            changeSide(this.dice, "six");
                        }
      };
    };
    var dice_one = new Dice("dice_one");
    var dice_two = new Dice("dice_two");
    var $roll_dice_btn = fetchId("roll_dice");
    $roll_dice_btn.onclick = function() {
      dice_one.roll();
      dice_two.roll();
    };
  })();

  