const background = document.getElementById('background');
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
const genarateBox = document.getElementById('genarateBox');
const checkHash = document.getElementById('checkHash');
const outputMessageBox = document.getElementById('outputMessageBox');
const outputMessage = document.getElementById('outputMessage');
const compareHashBox = document.getElementById('compareHashBox');
const closeHashBox = document.getElementById('closeHashBox');
const compareHashBtn = document.getElementById('compareHash');
const uploadedHash = document.getElementById('uploadedHash');
const generatedHash = document.getElementById('generatedHash');
let uploadedHashTxt, generatedHashTxt;
const aboutBox = document.getElementById('aboutBox');
const openAboutBox = document.getElementById('openAboutBox');
const closeAboutBox = document.getElementById('closeAboutBox');

openAboutBox.addEventListener('click', () => {
    aboutBox.classList.remove('hidden');
    background.classList.add('over-hide');
})

closeAboutBox.addEventListener('click', () => {
    aboutBox.classList.add('hidden');
    background.classList.remove('over-hide');
})

uploadBox.addEventListener('click', () => {
    actualBox.click();
})

uploadHash.addEventListener('click', () => {
    hashFile.click();
})

let orignalFileName = '';
actualBox.addEventListener('change', () => {
    console.log(actualBox.files[0]);
    orignalFileName = actualBox.files[0].name;
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
    genarateBox.classList.toggle('hidden');
    checkHash.classList.add('hidden');
    optBtn[2].classList.remove('enableBtn');
    if (EnabledOpt2) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;

            // problem with this hash is that it is to lengthy
            // const hash1 = genrateHash(reverseString(genrateHash(text)));
            const hash2 = decreaseTheSize(genrateHash(text));
            const hash = tohexa(hash2);
            // console.log(hash);

            // const hash = genrateHash(text);
            hashContent.innerHTML = hash;
        };
        reader.readAsText(actualBox.files[0]);
    }
    EnabledOpt2 = !EnabledOpt2;
})

let EnabledOpt3 = true;
optBtn[2].addEventListener('click', () => {

    checkHash.classList.toggle('hidden');
    genarateBox.classList.add('hidden');
    optBtn[1].classList.remove('enableBtn');
    EnabledOpt3 = !EnabledOpt3;
})

checkHashBtn.addEventListener('click', () => {
    const hContent = checkHashContent.value;
    uploadedHashTxt = hContent;
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        // const hash = genrateHash(text);

        // problem with this hash is that it is to lengthy
        const hash1 = genrateHash(text);
        const hash = tohexa(decreaseTheSize(hash1));

        generatedHashTxt = hash;
        showDataDiv.classList.remove('hashMatch', 'hashMismatch');
        if (hash === hContent) {
            outputMessage.innerText = "The File is not tampered. ";
            showDataDiv.classList.add('hashMatch');
        } else {
            outputMessage.innerText = "The File is tampered!!!! ";
            showDataDiv.classList.add('hashMismatch');
        }
        uploadBox.classList.add('uploadBoxShrink');
        outputMessageBox.classList.remove('hidden');
    };
    reader.readAsText(actualBox.files[0]);
})

// main code
// my hash code and helper function

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

function reverseString(str) {
    return str.split('').reverse().join('');
}

function genrateHash(msg) {
    let secret1 = '';
    const length = msg.length;
    let tRes = 1;

    for (let i = 0; i < length; i++) {
        const charCode = msg.charCodeAt(length - i - 1);
        // tRes *= charCode;
        tRes ^= charCode;
        const cleanedHex1 = getZero(getUnder128(tRes).toString(16));
        tRes = getUnder128(tRes);
        // console.log(msg[i], charCode, tRes, cleanedHex1);
        secret1 += cleanedHex1;
    }

    return secret1;
}

function decreaseTheSize(hash) {
    hash = String(hash);
    if (hash.length <= 1024) {
        // console.log(hash, hash.length);
        return hash; // Return the hash directly if it's within the desired length
    }
    let newHash = '';
    for (let i = 0, j = hash.length - 1; i < j; i++, j--) {
        newHash += hash[i] ^ hash[j];
    }
    return decreaseTheSize(newHash); // Return the result of the recursive call
}

function tohexa(str) {
    let hex = '';
    for (let i = 0; i < str.length; i += 3) {
        hex += parseInt(str.slice(i, i + 2), 10).toString(16);
    }
    return hex;
}

// end of main code

function startDownload(text, type, filename) {
    const blob = new Blob([text], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

downloadHash.addEventListener('click', () => {
    startDownload(hashContent.textContent, "text/plain", "HashOf_" + orignalFileName);
})

function resetOutputDiv() {
    showDataDiv.classList.remove('hashMatch', 'hashMismatch');
    uploadBox.classList.remove('uploadBoxShrink');
    outputMessageBox.classList.add('hidden');
    hashContent.innerText = "Not Generated";
    dataContent.innerText = "Hidden";
    genarateBox.classList.add('hidden');
    checkHash.classList.add('hidden');
    EnabledOpt1 = true;
    EnabledOpt2 = true;
    EnabledOpt3 = true;
    optBtn.forEach((btn) => {
        btn.classList.remove('enableBtn');
    })
}

// designing

compareHashBtn.addEventListener('click', () => {
    compareHashBox.classList.remove('hidden');
    const upTxt = uploadedHashTxt.trim();
    const genTxt = generatedHashTxt.trim();
    const minLen = Math.min(upTxt.length, genTxt.length);
    const maxLen = Math.max(upTxt.length, genTxt.length);

    let upComparedText = '';
    let genComparedText = '';
    for (let i = 0; i < minLen; i++) {
        const color = upTxt[i] === genTxt[i] ? 'greenCol' : 'redCol';
        upComparedText += `<span class="${color}">${upTxt[i]}</span>`;
        genComparedText += `<span class="${color}">${genTxt[i]}</span>`;
    }

    if (maxLen == upTxt.length) {
        for (let i = minLen; i < maxLen; i++) {
            upComparedText += `<span class="redCol">${upTxt[i]}</span>`;
            // genComparedText += `<span class="redCol">-</span>`;
        }

    } else {
        for (let i = minLen; i < maxLen; i++) {
            // upComparedText += `<span class="redCol">-</span>`;
            genComparedText += `<span class="redCol">${genTxt[i]}</span>`;
        }
    }

    uploadedHash.innerHTML = upComparedText;
    generatedHash.innerHTML = genComparedText;
})

closeHashBox.addEventListener('click', () => {
    compareHashBox.classList.add('hidden');
})