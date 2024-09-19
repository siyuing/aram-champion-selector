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
        fetchChampions();
        return; // データがまだ読み込まれていない場合は終了
    }

    let availableChampions = isMeleeMode ? champions.filter(c => c.isMelee) : [...champions];
    selectedChampions = [];

    for (let i = 0; i < count && availableChampions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableChampions.length);
        selectedChampions.push(availableChampions[randomIndex]);
        availableChampions.splice(randomIndex, 1);
    }

    if (count === 40) {
        displayChampionsInGroups(selectedChampions);
    } else {
        displayChampions(selectedChampions);
    }

    // コピーボタンを表示
    showCopyButtons(count === 40);
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

function displayChampionsInGroups(champions) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    const groups = [champions.slice(0, 20), champions.slice(20, 40)];

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
    const startIndex = groupNumber === 1 ? 0 : 20;
    const endIndex = groupNumber === 1 ? 20 : 40;
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

// 初期ロード時にチャンピオンデータを取得
fetchChampions();