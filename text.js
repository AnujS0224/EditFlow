// Get DOM Elements
const textInput = document.getElementById('text-input');
const fontFamily = document.getElementById('font-family');
const fontSize = document.getElementById('font-size');
const textColor = document.getElementById('text-color');
const bgColor = document.getElementById('bg-color');

// Formatting Buttons
const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const underlineBtn = document.getElementById('underline-btn');
const strikethroughBtn = document.getElementById('strikethrough-btn');
const textAlign = document.getElementById('text-align');

// File Operations
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const loadFile = document.getElementById('load-file');

// Word Count
const wordCountSpan = document.getElementById('word-count');
const charCountSpan = document.getElementById('char-count');

// Search and Replace
const searchReplaceBtn = document.getElementById('search-replace-btn');
const searchReplaceContainer = document.getElementById('search-replace-container');
const searchInput = document.getElementById('search-input');
const replaceInput = document.getElementById('replace-input');
const findBtn = document.getElementById('find-btn');
const replaceBtn = document.getElementById('replace-btn');
const replaceAllBtn = document.getElementById('replace-all-btn');
const caseSensitiveCheck = document.getElementById('case-sensitive');
const wholeWordCheck = document.getElementById('whole-word');

// History for Undo/Redo
let history = [];
let historyIndex = -1;

// Event Listeners
fontFamily.addEventListener('change', () => {
    document.execCommand('fontName', false, fontFamily.value);
});

fontSize.addEventListener('change', () => {
    document.execCommand('fontSize', false, '7');
    Array.from(document.querySelectorAll('font[size="7"]')).forEach((el) => {
        el.removeAttribute('size');
        el.style.fontSize = fontSize.value;
    });
});

textColor.addEventListener('input', () => {
    document.execCommand('foreColor', false, textColor.value);
});

bgColor.addEventListener('input', () => {
    document.execCommand('hiliteColor', false, bgColor.value);
});

// Text Formatting
boldBtn.addEventListener('click', () => {
    document.execCommand('bold', false, null);
    toggleActiveState(boldBtn);
});

italicBtn.addEventListener('click', () => {
    document.execCommand('italic', false, null);
    toggleActiveState(italicBtn);
});

underlineBtn.addEventListener('click', () => {
    document.execCommand('underline', false, null);
    toggleActiveState(underlineBtn);
});

strikethroughBtn.addEventListener('click', () => {
    document.execCommand('strikeThrough', false, null);
    toggleActiveState(strikethroughBtn);
});

textAlign.addEventListener('change', () => {
    document.execCommand('justify' + textAlign.value, false, null);
});

// Word and Character Count
textInput.addEventListener('input', () => {
    const text = textInput.innerText.trim();
    const words = text ? text.split(/\s+/).length : 0;
    wordCountSpan.textContent = `Words: ${words}`;
    charCountSpan.textContent = `Characters: ${text.length}`;

    // Save state for undo/redo
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    history.push(textInput.innerHTML);
    historyIndex = history.length - 1;
});

// Undo/Redo Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
    }
    if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
    }
});

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        textInput.innerHTML = history[historyIndex];
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        textInput.innerHTML = history[historyIndex];
    }
}

// Save File
saveBtn.addEventListener('click', () => {
    const blob = new Blob([textInput.innerText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'document.txt';
    a.click();
});

// Load File
loadBtn.addEventListener('click', () => {
    loadFile.click();
});

loadFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        textInput.innerHTML = event.target.result;
    };
    reader.readAsText(file);
});

// Search and Replace Functionality
searchReplaceBtn.addEventListener('click', () => {
    searchReplaceContainer.style.display = 
        searchReplaceContainer.style.display === 'none' ? 'flex' : 'none';
});

findBtn.addEventListener('click', () => {
    const range = document.createRange();
    const selection = window.getSelection();
    const text = textInput.innerText;
    const searchText = searchInput.value;

    const startIndex = text.indexOf(searchText);
    if (startIndex !== -1) {
        range.setStart(textInput.firstChild, startIndex);
        range.setEnd(textInput.firstChild, startIndex + searchText.length);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        alert('Text not found');
    }
});

replaceBtn.addEventListener('click', () => {
    const text = textInput.innerHTML;
    const searchText = searchInput.value;
    const replaceText = replaceInput.value;
    textInput.innerHTML = text.replace(searchText, replaceText);
});

replaceAllBtn.addEventListener('click', () => {
    const text = textInput.innerHTML;
    const searchText = searchInput.value;
    const replaceText = replaceInput.value;
    const regex = new RegExp(searchText, 'g');
    textInput.innerHTML = text.replace(regex, replaceText);
});

function toggleActiveState(button) {
    button.classList.toggle('active');
}
