let words = [];
let currentWord = "";
let score = 0;
let isChecking = false;  // 判定中かどうかを示すフラグ
let gameRunning = false; // ゲームが進行中かどうかを示すフラグ

const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score-display");
const startButton = document.getElementById("start-button");
const endButton = document.getElementById("end-button");
const resultDisplay = document.getElementById("result-display");

// 初期状態で非表示にする
wordInput.classList.add("hidden");
endButton.classList.add("hidden");

startButton.addEventListener("click", startGame);
endButton.addEventListener("click", endGame);

// JSONファイルから単語を読み込む
fetch("words.json")
    .then(response => response.json())
    .then(data => {
        words = data.words;
    })
    .catch(error => console.error("Error loading words:", error));

function startGame() {
    if (words.length === 0) {
        alert("単語データがロードされていません。");
        return;
    }
    gameRunning = true; // ゲーム開始フラグを立てる
    score = 0;
    scoreDisplay.textContent = `スコア: ${score}`;
    resultDisplay.textContent = "";
    wordInput.value = "";
    wordInput.classList.remove("hidden"); // 入力フィールドを表示
    startButton.classList.add("hidden"); // スタートボタンを隠す
    endButton.classList.remove("hidden"); // ゲーム終了ボタンを表示
    nextWord();
    wordInput.focus();
}

function endGame() {
    gameRunning = false; // ゲーム終了フラグを立てる
    resultDisplay.textContent = "ゲーム終了";
    resultDisplay.className = 'show'; // 終了メッセージを表示
    resultDisplay.style.color = '#ffffff'; // 白色に設定
    wordInput.value = "";
    wordInput.blur(); // 入力フィールドのフォーカスを外す
    wordInput.classList.add("hidden"); // 入力フィールドを隠す
    startButton.classList.remove("hidden"); // スタートボタンを表示
    endButton.classList.add("hidden"); // ゲーム終了ボタンを隠す
}

function nextWord() {
    if (isChecking || !gameRunning) return;  // 判定中またはゲームが終了している場合は次の単語に進まない
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
    wordInput.value = "";
    resultDisplay.textContent = "";  
    resultDisplay.className = ""; // クラスをリセットして色を初期状態に戻す
    resultDisplay.style.color = ""; // 色をリセット
}

wordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkInput();
    }
});

function checkInput() {
    if (isChecking || !gameRunning) return;  // 判定中またはゲームが終了している場合は何も行わない
    isChecking = true;  // 判定を開始

    if (wordInput.value === currentWord) {
        score++;
        scoreDisplay.textContent = `スコア: ${score}`;
        showResult("OK", "ok");

        setTimeout(() => {
            isChecking = false;  // 判定が完了したのでフラグをリセット
            nextWord();  // 正解時に次の単語に進む
        }, 500);  // 0.5秒待つ
    } else {
        showResult("MISS", "miss");

        setTimeout(() => {
            isChecking = false;  // 判定が完了したのでフラグをリセット
            wordInput.value = "";  // 入力フィールドをクリア
        }, 500);  // 0.5秒待つ
    }
}

function showResult(message, className) {
    resultDisplay.textContent = message;
    resultDisplay.className = `show ${className}`;  // クラスを設定してアニメーションをトリガー
    resultDisplay.style.opacity = 1;  // 表示状態にする

    setTimeout(() => {
        resultDisplay.style.opacity = 0;  // 0.5秒後に非表示にする
    }, 500);  // アニメーションの長さと同じ時間に設定
}
