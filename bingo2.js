document.addEventListener("DOMContentLoaded", function() {
    const bingoCard = document.getElementById("bingoCard");
    const status = document.getElementById("status");
    const cardSize = 5;
    const numbersRange = {
        0: [1, 15],
        1: [16, 30],
        2: [31, 45],
        3: [46, 60],
        4: [61, 75]
    };

    function generateUniqueNumbers(min, max, count) {
        let numbers = [];
        while (numbers.length < count) {
            let num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers;
    }

    function createBingoCard() {
        let numbers = [];
        for (let col = 0; col < cardSize; col++) {
            numbers.push(...generateUniqueNumbers(numbersRange[col][0], numbersRange[col][1], cardSize));
        }
        shuffleArray(numbers);

        for (let i = 0; i < cardSize * cardSize; i++) {
            const cell = document.createElement("div");
            cell.classList.add("bingo-cell");
            if (i === 12) {
                cell.textContent = "FREE";
                cell.classList.add("selected");
            } else {
                cell.textContent = numbers[i < 12 ? i : i - 1];
            }
            cell.addEventListener("click", () => selectCell(cell));
            bingoCard.appendChild(cell);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function selectCell(cell) {
        if (!cell.classList.contains("selected")) {
            cell.classList.add("selected");
            checkBingo();
        }
    }

    function checkBingo() {
        const cells = Array.from(document.querySelectorAll(".bingo-cell"));
        let selected = cells.map(cell => cell.classList.contains("selected"));

        let bingoPatterns = getBingoPatterns();
        let bingo = false;
        let reach = false;

        for (let pattern of bingoPatterns) {
            let selectedCount = pattern.filter(index => selected[index]).length;
            if (selectedCount === cardSize) {
                bingo = true;
                break;
            } else if (selectedCount === cardSize - 1) {
                reach = true;
            }
        }
        if (bingo) {
            status.textContent = "ビンゴ！";
        } else if (reach) {
            status.textContent = "リーチ！";
        } else {
            status.textContent = "";
        }
    }

    function getBingoPatterns() {
        let patterns = [];
        for (let i = 0; i < cardSize; i++) {
            patterns.push([...Array(cardSize).keys()].map(x => x + i * cardSize));
        }
        for (let i = 0; i < cardSize; i++) {
            patterns.push([...Array(cardSize).keys()].map(x => x * cardSize + i));
        }
        patterns.push([...Array(cardSize).keys()].map(x => x * (cardSize + 1)));
        patterns.push([...Array(cardSize).keys()].map(x => (x + 1) * (cardSize - 1)));

        return patterns;
    }

    createBingoCard();
});