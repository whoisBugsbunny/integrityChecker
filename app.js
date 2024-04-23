const actualBox = document.getElementById('file');
const uploadBox = document.getElementById('uploadBox');
const fileName = document.getElementById('fileName');
const optionBar = document.getElementById('optionBar');
const hideBox = document.getElementsByName('hideBox');
const optBtn = document.getElementsByName('optBtn');
const dataContent = document.getElementById('dataContent');
const hashContent = document.getElementById('hashContent');
const downloadHash = document.getElementById('downloadHash');
const checkHashBtn = document.getElementById('checkHashBtn');
const checkHashContent = document.getElementById('checkHashContent');
const hashFile = document.getElementById('hashFile');
const uploadHash = document.getElementById('uploadHash');
const showDataDiv = document.getElementById('showData');

uploadBox.addEventListener('click', () => {
    actualBox.click();
})

uploadHash.addEventListener('click', () => {
    hashFile.click();
})

actualBox.addEventListener('change', () => {
    console.log(actualBox.files[0]);
    fileName.innerHTML = "File Name: " + actualBox.files[0].name + "</br>Type: " + actualBox.files[0].type + "</br>Size: " + actualBox.files[0].size + "bytes";
    optionBar.classList.remove('disableDiv');
    hideBox[0].style.display = 'none';
    resetOutputDiv();
})

hashFile.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        checkHashContent.value = text;
    };
    reader.readAsText(hashFile.files[0]);
})

optBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('enableBtn');
        console.log(btn.dataset.index);
    })
})

let EnabledOpt1 = true;
optBtn[0].addEventListener('click', () => {
    if (EnabledOpt1) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            dataContent.innerHTML = text;
        };
        reader.readAsText(actualBox.files[0]);
    } else {
        dataContent.innerText = "Hidden";
    }
    EnabledOpt1 = !EnabledOpt1;
})

let EnabledOpt2 = true;
optBtn[1].addEventListener('click', () => {
    if (EnabledOpt2) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            hashContent.innerHTML = genrateHash(text);
        };
        reader.readAsText(actualBox.files[0]);
    } else {
        hashContent.innerText = "Not Generated";
    }
    EnabledOpt2 = !EnabledOpt2;
})

let EnabledOpt3 = true;
optBtn[2].addEventListener('click', () => {

    // if (EnabledOpt3) {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const text = e.target.result;
    //         dataContent.innerHTML = text;
    //     };
    // reader.readAsText(actualBox.files[0]);
    // } else {
    // dataContent.innerText = "Hidden";
    // }
    EnabledOpt3 = !EnabledOpt3;
})

checkHashBtn.addEventListener('click', () => {
    const hContent = checkHashContent.value;
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const hash = genrateHash(text);
        showDataDiv.classList.remove('hashMatch', 'hashMismatch');
        if (hash === hContent) {
            showDataDiv.classList.add('hashMatch');
        } else {
            showDataDiv.classList.add('hashMismatch');
        }
    };
    reader.readAsText(actualBox.files[0]);
})

// my hash code and function

function getUnder128(num) {
    if (num < 128) {
        return num;
    } else {
        const numStr = String(num);
        const middleIndex = Math.floor(numStr.length / 2);

        const firstHalf = parseInt(numStr.slice(0, middleIndex), 10);
        const secondHalf = parseInt(numStr.slice(middleIndex), 10);

        const newNum = firstHalf + secondHalf;
        return getUnder128(newNum);
    }
}

function getZero(hexVal) {
    if (hexVal.length === 1) {
        return '0' + hexVal;
    }
    return hexVal;
}

function genrateHash(msg) {
    let secret1 = '';
    const length = msg.length;
    let tRes = 1;

    for (let i = 0; i < length; i++) {
        const charCode = msg.charCodeAt(length - i - 1);
        tRes *= charCode;
        const cleanedHex1 = getZero(getUnder128(tRes).toString(16));
        tRes = getUnder128(tRes);
        console.log(tRes, cleanedHex1);
        secret1 += cleanedHex1;
    }

    return secret1;
}

function startDownload(text, type, filename) {
    const blob = new Blob([text], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

downloadHash.addEventListener('click', () => {
    startDownload(hashContent.textContent, "text/plain", "HashOfTheFile.txt");
})

function resetOutputDiv() {
    hashContent.innerText = "Not Generated";
    dataContent.innerText = "Hidden";
    EnabledOpt1 = true;
    EnabledOpt2 = true;
    EnabledOpt3 = true;
    optBtn.forEach((btn) => {
        btn.classList.remove('enableBtn');
    })
}