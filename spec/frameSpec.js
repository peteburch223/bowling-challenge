'use strict';

describe("Frame", function(){

  var frame;
  var firstRoll  = {
    numStandingPins:  function() { return 5; },
    numFelledPins:    function() { return 5; },
    isSpare:          function() { return false; },
    isStrike:         function() { return false; }
  };

  var crapRoll  = {
    numStandingPins:  function() { return 10; },
    numFelledPins:    function() { return 0; },
    isSpare:          function() { return false; },
    isStrike:         function() { return false; }
  };

  var spareRoll = {
    numStandingPins:  function() { return 0; },
    numFelledPins:    function() { return 10; },
    isSpare:          function() { return true; },
    isStrike:         function() { return false; }
  };

  var strikeRoll = {
    numStandingPins:  function() { return 0; },
    numFelledPins:    function() { return 10; },
    isSpare:          function() { return false; },
    isStrike:         function() { return true; }
  };

  var strikeFrame = {
    getScore:         function() { return 10; },
    isSpare:          function() { return false; },
    isStrike:         function() { return true; },
    getRollScores:    function() { return [10]; }
  };

  var spareFrame = {
    getScore:         function() { return 10; },
    isSpare:          function() { return true; },
    isStrike:         function() { return false; },
    getRollScores:    function() { return [5,5]; }
  };

  var averageFrame = {
    getScore:         function() { return 5; },
    isSpare:          function() { return false; },
    isStrike:         function() { return false; },
    getRollScores:    function() { return [3,2]; }
  };

  var crapFrame = {
    getScore:         function() { return 0; },
    isSpare:          function() { return false; },
    isStrike:         function() { return false; },
    getRollScores:    function() { return [0,0]; }
  };

  describe("default", function(){

    beforeEach(function(){

      spyOn(Roll, "createInstance").and.returnValue(firstRoll);
      frame = new Frame(Roll);
    });

    it("has a zero score", function(){
      expect(frame.getTotal()).toEqual(0);
    });

    it("can create rolls", function(){
      expect(frame.createRoll()).toEqual(firstRoll);
    });
  });

  describe("first roll is a strike", function(){
    beforeEach(function(){
      spyOn(Roll, "createInstance").and.returnValue(strikeRoll);
      frame = new Frame(Roll);
      frame.roll();
    });
    it("#isStrike", function(){
      expect(frame.isStrike()).toEqual(true);
    });
    it("#isSpare", function(){
      expect(frame.isSpare()).toEqual(false);
    });
    it("#isComplete", function(){
      expect(frame.isComplete()).toEqual(true);
    });
    it("score = 10", function(){
      expect(frame.getTotal()).toEqual(10);
    });
  });

  describe("first roll is not a strike, second is a spare", function(){
    beforeEach(function(){
      spyOn(Roll, "createInstance").and.returnValues(crapRoll, spareRoll);
      frame = new Frame(Roll);
      frame.roll();
      frame.roll();
    });
    it("#isStrike", function(){
      expect(frame.isStrike()).toEqual(false);
    });
    it("#isSpare", function(){
      expect(frame.isSpare()).toEqual(true);
    });
    it("#isComplete", function(){
      expect(frame.isComplete()).toEqual(true);
    });
    it("score = 10", function(){
      expect(frame.getTotal()).toEqual(10);
    });
  });

  describe("calculates bonuses from subsequent frames:", function(){
    describe("strike", function(){
      beforeEach(function(){
        spyOn(Roll, "createInstance").and.returnValue(strikeRoll);
        frame = new Frame(Roll);
        frame.roll();
      });

      it(" followed by two strikes: score = 30", function(){
        frame.pushNextFrame(strikeFrame);
        frame.pushNextFrame(strikeFrame);
        expect(frame.getTotal()).toEqual(30);
      });

      it(" followed by strike followed by non-strike: score = 23", function(){
        frame.pushNextFrame(strikeFrame);
        frame.pushNextFrame(averageFrame);
        expect(frame.getTotal()).toEqual(23);
      });

      it(" followed by non-strike: score = 15", function(){
        frame.pushNextFrame(averageFrame);
        expect(frame.getTotal()).toEqual(15);
      });
    });

    describe("spare", function(){
      beforeEach(function(){
        spyOn(Roll, "createInstance").and.returnValues(crapRoll, spareRoll);
        frame = new Frame(Roll);
        frame.roll();
        frame.roll();
      });
      it("followed by strike: score = 20", function(){
        frame.pushNextFrame(strikeFrame);
        expect(frame.getTotal()).toEqual(20);
      });

      it("followed by non-strike: score = 13", function(){
        frame.pushNextFrame(averageFrame);
        expect(frame.getTotal()).toEqual(13);
      });
    });
  });
});
