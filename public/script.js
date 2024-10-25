let champions = [];
let selectedChampions = [];
let isMeleeMode = false;

async function fetchChampions() {
    try {
        const response = await fetch('/api/champions');
        champions = await response.json();
    } catch (error) {
        console.error('Failed to fetch champions:', error);
    }
}

function selectRandomChampions() {
    const count = parseInt(document.getElementById("championCount").value);
    if (champions.length === 0) {
        fetchChampions().then(() => performChampionSelection(count));
    } else {
        performChampionSelection(count);
    }
}

function performChampionSelection(count) {
    let availableChampions = isMeleeMode ? champions.filter(c => c.isMelee) : [...champions];
    selectedChampions = [];

    for (let i = 0; i < count && availableChampions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableChampions.length);
        selectedChampions.push(availableChampions[randomIndex]);
        availableChampions.splice(randomIndex, 1);
    }

    if (count === 40 || count === 50) {
        displayChampionsInGroups(selectedChampions, count);
    } else {
        displayChampions(selectedChampions);
    }

    showCopyButtons(count === 40 || count === 50);
}

function displayChampions(champions) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    champions.forEach(champion => {
        const championDiv = document.createElement("div");
        championDiv.className = "champion";
        championDiv.innerHTML = `
            <img src="${champion.image}" alt="${champion.name}">
            <p>${champion.name}</p>
        `;
        resultDiv.appendChild(championDiv);
    });
}

function displayChampionsInGroups(champions, totalCount) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    const halfCount = Math.ceil(totalCount / 2);
    const groups = [champions.slice(0, halfCount), champions.slice(halfCount)];

    groups.forEach((group, index) => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "champion-group";
        groupDiv.innerHTML = `<h3>グループ ${index + 1}</h3>`;

        const championsContainer = document.createElement("div");
        championsContainer.className = "champions-container";

        group.forEach(champion => {
            const championDiv = document.createElement("div");
            championDiv.className = "champion";
            championDiv.innerHTML = `
                <img src="${champion.image}" alt="${champion.name}">
                <p>${champion.name}</p>
            `;
            championsContainer.appendChild(championDiv);
        });

        groupDiv.appendChild(championsContainer);
        resultDiv.appendChild(groupDiv);
    });
}
function showCopyButtons(isGrouped) {
    const copyButtonsContainer = document.getElementById("copyButtonsContainer");
    copyButtonsContainer.innerHTML = "";

    if (isGrouped) {
        copyButtonsContainer.innerHTML = `
            <button onclick="copyGroupToClipboard(1)">グループ1をコピー</button>
            <button onclick="copyGroupToClipboard(2)">グループ2をコピー</button>
        `;
    } else {
        copyButtonsContainer.innerHTML = `
            <button onclick="copyAllChampions()">全チャンピオン名をコピー</button>
        `;
    }
}

function copyAllChampions() {
    const text = selectedChampions.map(champ => champ.name).join(', ');
    copyToClipboard(text, "全チャンピオン");
}

function copyGroupToClipboard(groupNumber) {
    const totalCount = selectedChampions.length;
    const halfCount = Math.ceil(totalCount / 2);
    const startIndex = groupNumber === 1 ? 0 : halfCount;
    const endIndex = groupNumber === 1 ? halfCount : totalCount;
    const group = selectedChampions.slice(startIndex, endIndex);
    const text = group.map(champ => champ.name).join(', ');
    copyToClipboard(text, `グループ${groupNumber}`);
}

function copyToClipboard(text, groupName) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`${groupName}のチャンピオン名をクリップボードにコピーしました。`);
    }, (err) => {
        console.error('コピーに失敗しました: ', err);
    });
}

function toggleMode() {
    isMeleeMode = !isMeleeMode;
    const toggleButton = document.getElementById("toggleModeButton");
    toggleButton.textContent = `近接モード: ${isMeleeMode ? 'ON' : 'OFF'}`;
    toggleButton.style.backgroundColor = isMeleeMode ? '#FF4500' : '#008CBA';
}

function selectFortyChampions() {
    document.getElementById("championCount").value = "40";
    selectRandomChampions();
}
function selectFiftyChampions() {
    document.getElementById("championCount").value = "50";
    selectRandomChampions();
}

function displayChampionsInGroups(champions, totalCount) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    const halfCount = Math.ceil(totalCount / 2);
    const groups = [champions.slice(0, halfCount), champions.slice(halfCount)];

    groups.forEach((group, index) => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "champion-group";
        groupDiv.id = `group-${index + 1}`;
        
        // グループのタイトル
        groupDiv.innerHTML = `<h3>グループ ${index + 1}</h3>`;

        // チャンピオンのコンテナ
        const championsContainer = document.createElement("div");
        championsContainer.className = "champions-container";
        championsContainer.id = `champions-container-${index + 1}`;

        group.forEach(champion => {
            const championDiv = document.createElement("div");
            championDiv.className = "champion";
            championDiv.innerHTML = `
                <img src="/api/placeholder/80/80" alt="${champion.name}">
                <p>${champion.name}</p>
            `;
            championsContainer.appendChild(championDiv);
        });

        groupDiv.appendChild(championsContainer);

        // ボタンコンテナ
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";

        // テキストコピーボタン
        const copyTextButton = document.createElement("button");
        copyTextButton.onclick = () => copyGroupToClipboard(index + 1);
        copyTextButton.textContent = `グループ${index + 1}の名前をコピー`;
        copyTextButton.className = "copy-button";

        // 画像コピーボタン
        const copyImageButton = document.createElement("button");
        copyImageButton.onclick = () => copyGroupAsImage(index + 1);
        copyImageButton.textContent = `グループ${index + 1}の画像をコピー`;
        copyImageButton.className = "copy-button image-copy-button";

        buttonContainer.appendChild(copyTextButton);
        buttonContainer.appendChild(copyImageButton);
        groupDiv.appendChild(buttonContainer);

        resultDiv.appendChild(groupDiv);
    });

    // 下部のコピーボタンコンテナを非表示にする
    const copyButtonsContainer = document.getElementById("copyButtonsContainer");
    if (copyButtonsContainer) {
        copyButtonsContainer.style.display = "none";
    }
}

// 画像としてコピーする関数
async function copyGroupAsImage(groupNumber) {
    try {
        const groupElement = document.getElementById(`group-${groupNumber}`);
        
        // html2canvas を使用してHTML要素を画像に変換
        const canvas = await html2canvas(groupElement);
        
        // Canvas を blob に変換
        canvas.toBlob(async (blob) => {
            try {
                // Clipboardに画像をコピー
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
                alert(`グループ${groupNumber}の画像をクリップボードにコピーしました`);
            } catch (err) {
                console.error('画像のコピーに失敗しました:', err);
                alert('画像のコピーに失敗しました');
            }
        }, 'image/png');
    } catch (err) {
        console.error('画像の生成に失敗しました:', err);
        alert('画像の生成に失敗しました');
    }
}

// 初期ロード時にチャンピオンデータを取得
fetchChampions();