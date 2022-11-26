/**
 * @jest-environment jsdom
 */

const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require("../game")

jest.spyOn(window, "alert").mockImplementation(() => {

})

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("game object contains correct keys", () => {
    test("score key exists", () => {
        expect("score" in game).toBe(true);
    });
    test("currentGame key exists", () => {
        expect("currentGame" in game).toBe(true);
    });
    test("playerMoves key exists", () => {
        expect("playerMoves" in game).toBe(true);
    });
    test("choices key exists", () => {
        expect("choices" in game).toBe(true);
    });
    test("turnNumber key exists", () => {
        expect("turnNumber" in game).toBe(true)
    });
    test("lastButton key exists", () => {
        expect("lastButton" in game).toBe(true)
    });
    test("turnInProgress key exists", () => {
        expect("turnInProgress" in game).toBe(true)
    });
    test("turnInProgress key value is false", () => {
        expect(game.turnInProgress).toEqual(false)
    });
    test("choices contain corect ids", () => {
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"])
    });
});

describe("new game works correctly", () => {
    beforeAll(() => {
        game.score = 48;
        game.playerMoves = ["button1", "button2"]
        game.currentGame = ["button1", "button2"]
        document.getElementById("score").innerText = "42";
        newGame();
    });
    test("reset score to 0", () => {
        expect(game.score).toEqual(0)
    });
    test("clear player moves array", () => {
        expect(game.playerMoves.length).toEqual(0)
    });
    test("should be one element in the computers array", () => {
        expect(game.currentGame.length).toEqual(1)
    });
    test("element with ID score should display 0", () => {
        expect(document.getElementById("score").innerText).toEqual(0)
    });
    test("data attribute set to true on each circle when clicked", () => {
        const circleElements = document.getElementsByClassName("circle");
        for (let c of circleElements) {
            expect(c.getAttribute("data-listener")).toEqual("true");
        }
    });
});

describe("gameplay works correctly", () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test("should add correct class to light up the buttons", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    });
    test("showTurn should update game turnNumber", () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });
    test("should increment the score if the user guess is correct", () => {
       game.playerMoves.push(game.currentGame[0]);
       playerTurn();
       expect(game.score).toEqual(1);
    });
    test("should call an alert if the player guess is wrong", () => {
        game.playerMoves.push("wrong");
        playerTurn();
        expect(window.alert).toBeCalledWith("Wrong Move!")
    });
    test("should toggle turnInProgress to true", () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });
    test("clicking during the computer sequence should fail", () => {
        showTurns();
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");

    });
});


