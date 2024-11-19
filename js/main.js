const form = document.getElementById('bookmarkForm');
const table = document.getElementById('bookmarkTable').querySelector('tbody');
const saveButton = document.getElementById('saveToFile');
const loadButton = document.getElementById('loadFromFile');
const submit = document.getElementById('liveToastBtn')
let bookmarks = [];

loadBookmarksFromLocalStorage();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const siteName = document.getElementById('siteName').value.trim();
    const siteUrl = document.getElementById('siteUrl').value.trim();

    if (!validateUrl(siteUrl)) {
        document.querySelector('#exampleModal .modal-body').textContent = 'Site name must be at least 3 characters, and the URL must be valid';

        const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
        modal.show();
        return;
    }

    bookmarks.push({ siteName, siteUrl });
    saveBookmarksToLocalStorage();
    renderBookmarks();
    form.reset();
});

function deleteBookmark(index) {
    bookmarks.splice(index, 1);
    saveBookmarksToLocalStorage();
    renderBookmarks();
}

function validateUrl(url) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*).)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%@_.~+&:]*)*' +
        '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
        'i'
    );
    return !!pattern.test(url);
}

function saveBookmarksToLocalStorage() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function loadBookmarksFromLocalStorage() {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
        bookmarks = JSON.parse(storedBookmarks);
    }
    renderBookmarks();
}

function renderBookmarks() {
    table.innerHTML = '';
    bookmarks.forEach((bookmark, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${bookmark.siteName}</td>
            <td><a href="${bookmark.siteUrl}" class="btn btn-primary target="_blank" class="visit">Visit</a></td>
            <td><button type="button" class="btn btn-danger"onclick="deleteBookmark(${index})">Delete</button></td>
            
            `;

        table.appendChild(row);
    });
}

saveButton.addEventListener('click', async () => {
    const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'bookmarks.json',
        types: [
            {
                description: 'JSON File',
                accept: { 'application/json': ['.json'] },
            },
        ],
    });

    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(bookmarks, null, 2));
    await writable.close();
    alert('Bookmarks saved to file.');
});

loadButton.addEventListener('click', async () => {
    const [fileHandle] = await window.showOpenFilePicker({
        types: [
            {
                description: 'JSON File',
                accept: { 'application/json': ['.json'] },
            },
        ],
    });

    const file = await fileHandle.getFile();
    const text = await file.text();
    bookmarks = JSON.parse(text);
    saveBookmarksToLocalStorage();
    renderBookmarks();
    alert('Bookmarks loaded from file.');
});
