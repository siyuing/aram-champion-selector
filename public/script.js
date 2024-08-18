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

// 初期ロード時にチャンピオンデータを取得
fetchChampions();