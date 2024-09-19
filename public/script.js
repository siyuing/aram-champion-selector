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

async function selectRandomChampions() {
    if (champions.length === 0) {
        await fetchChampions();
    }

    const count = parseInt(document.getElementById("championCount").value);
    selectedChampions = [];
    let availableChampions = isMeleeMode ? champions.filter(c => c.isMelee) : [...champions];

    for (let i = 0; i < count && availableChampions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableChampions.length);
        selectedChampions.push(availableChampions[randomIndex]);
        availableChampions.splice(randomIndex, 1);
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    selectedChampions.forEach(champion => {
        const championDiv = document.createElement("div");
        championDiv.className = "champion";
        championDiv.innerHTML = `
            <img src="${champion.image}" alt="${champion.name}">
            <p>${champion.name}</p>
        `;
        resultDiv.appendChild(championDiv);
    });

    document.getElementById("copyButton").style.display = "inline-block";
}

function copyAllChampions() {
    const championNames = selectedChampions.map(champion => champion.name).join(', ');
    navigator.clipboard.writeText(championNames).then(() => {
        alert(`以下のチャンピオン名をコピーしました：\n${championNames}`);
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

//9/19 機能追加
function selectRandomChampions(count = 40) {
    if (champions.length === 0) {
        fetchChampions();
    }

    let availableChampions = [...champions];
    selectedChampions = [];

    for (let i = 0; i < count && availableChampions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableChampions.length);
        selectedChampions.push(availableChampions[randomIndex]);
        availableChampions.splice(randomIndex, 1);
    }

    displayChampions(selectedChampions);
}

function splitChampionsIntoGroups() {
    const group1 = selectedChampions.slice(0, 20);
    const group2 = selectedChampions.slice(20, 40);
    return [group1, group2];
}

function copyGroupToClipboard(group, groupNumber) {
    const text = group.map(champ => champ.name).join(', ');
    navigator.clipboard.writeText(text).then(() => {
        alert(`グループ${groupNumber}のチャンピオンをクリップボードにコピーしました。`);
    }, (err) => {
        console.error('コピーに失敗しました: ', err);
    });
}
function displayChampions(champions) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    const groups = [champions.slice(0, 20), champions.slice(20, 40)];

    groups.forEach((group, index) => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "champion-group";
        groupDiv.innerHTML = `<h3>グループ ${index + 1}</h3>`;

        group.forEach(champion => {
            const championDiv = document.createElement("div");
            championDiv.className = "champion";
            championDiv.innerHTML = `
                <img src="${champion.image}" alt="${champion.name}">
                <p>${champion.name}</p>
            `;
            groupDiv.appendChild(championDiv);
        });

        resultDiv.appendChild(groupDiv);
    });
}
function selectRandomChampions() {
    const count = parseInt(document.getElementById("championCount").value);
    if (champions.length === 0) {
        fetchChampions();
    }

    let availableChampions = [...champions];
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
function copyGroupToClipboard(groupNumber) {
    if (selectedChampions.length !== 40) {
        alert("40体のチャンピオンを選択してください。");
        return;
    }
    const group = groupNumber === 1 ? selectedChampions.slice(0, 20) : selectedChampions.slice(20, 40);
    const text = group.map(champ => champ.name).join(', ');
    navigator.clipboard.writeText(text).then(() => {
        alert(`グループ${groupNumber}のチャンピオンをクリップボードにコピーしました。`);
    }, (err) => {
        console.error('コピーに失敗しました: ', err);
    });
}
// 初期ロード時にチャンピオンデータを取得
fetchChampions();