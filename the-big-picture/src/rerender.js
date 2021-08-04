/* Main Menu View */
const mainMenuDiv = document.getElementsByClassName('main-menu')[0];
const findMovieButton = document.getElementById('find-a-movie-button');
const addMovieButton = document.getElementById('add-a-movie-button');

/* Find / Add View */
const findMovieDiv = document.getElementsByClassName('find-a-movie')[0];
const findAddTitle = document.getElementById('find/add-title');
const findAddbutton = document.getElementById('find/add-button');

/* View Movie Content */
const movieView = document.getElementById('movie-view');
const movieBack = document.getElementById('movie-back');

/* Edit Functionality */
const edit = document.getElementById('edit');
const editableItems = document.getElementsByClassName('edit-item');
const saveButton = document.getElementById('save');

/* Overlay Specific Code */
const shield = document.getElementById('shield');

/* Shared */
const backButton = document.getElementById('back');

backButton.addEventListener('click', () => {
    movieView.classList.add('hide');
    findMovieDiv.classList.add('hide');
    mainMenuDiv.classList.remove('hide');
});

/* Actor / Director Search */
const searchCancel = document.getElementById('search-cancel');
const searchActor = document.getElementById('search-actor');
const searchDirector = document.getElementById('search-director');
const search = document.getElementById('search');
const searchPopup = document.getElementById('search-view');

/* Actor / Director Results */
const searchResultsDiv = document.getElementById('search-results');
const searchResults = document.getElementsByClassName('result');

/* Reviews */
const reviewDivs = Array.from(document.getElementsByClassName('review'));
const closeReview = document.getElementById('close-review');
//const saveReview = document.getElementById('save-review');

/**
 * Function to return from the movie view to the find movie view
 */
function returnToFindMovie() {
    movieView.classList.add('hide');
    findMovieDiv.classList.remove('hide');
}

/**
 * Shows the find movie screen
 */
function showFindMovie() {
    mainMenuDiv.classList.add('hide');
    findAddTitle.innerText = 'Find a Movie';
    findAddbutton.innerText = 'Find';
    findMovieDiv.classList.remove('hide');
}

/**
 * Shows the add movie screen
 */
function showAddMovie() {
    mainMenuDiv.classList.add('hide');
    findAddTitle.innerText = 'Add a Movie';
    findAddbutton.innerText = 'Add';
    findMovieDiv.classList.remove('hide');
}

/**
 * Enables the editable items to be edited
 */
function enableEditableItems() {
    for (let i = 0; i < editableItems.length; i++) {
        editableItems[i].classList.remove('hide');
    }
    saveButton.classList.remove('hide');
    edit.classList.add('hide');
}

/**
 * Disables the editable items
 */
function disableEditableItems() {
    for (let i = 0; i < editableItems.length; i++) {
        editableItems[i].classList.add('hide');
    }
    saveButton.classList.add('hide');
    edit.classList.remove('hide');
}

/**
 * Hides the shield from the DOM
 */
function hideShield() {
    shield.classList.add('hide');
}

/**
 * Throws up the shield overlay
 */
function showSheild() {
    shield.classList.remove('hide');
}

function hideSearchResults() {
    searchResultsDiv.classList.add('hide');
}
function showSearchResults() {
    searchResultsDiv.classList.remove('hide');
}
function showSearchPopup() {
    searchPopup.classList.remove('hide');
}
function hideSearchPopup() {
    searchPopup.classList.add('hide');
}

//TODO: reimplement this
findAddbutton.addEventListener('click', () => {
    findMovieDiv.classList.add('hide');
    movieView.classList.remove('hide');
});


/* Event Listners */
movieBack.addEventListener('click', () => {
    returnToFindMovie();
});

findMovieButton.addEventListener('click', () => {
    showFindMovie();
});

addMovieButton.addEventListener('click', () => {
    showAddMovie();
});

edit.addEventListener('click', () => {
    enableEditableItems();
});

saveButton.addEventListener('click', () => {
    //TODO: determine what needs to be saved
    disableEditableItems();
});

searchCancel.addEventListener('click', () => {
    hideShield();
    hideSearchPopup();
    //TODO: handle hiding the search box as well
});

searchActor.addEventListener('click', () => {
    showSheild();
    showSearchPopup();
    //TODO: handle for actor
});

searchDirector.addEventListener('click', () => {
    showSheild();
    showSearchPopup();
    //TODO: handle for director
});

search.addEventListener('click', () => {
    hideSearchPopup();
    showSearchResults();
});

Array.from(searchResults).forEach((element) => {
    element.addEventListener('click', () => {
        hideSearchResults();
        hideShield();
    });
});

const reviewEditor = document.getElementById('review-editor');
function showViewEditor() {
    showSheild();
    //reviewEditor.classList.remove('hide');
}

function hideViewEditor() {
    reviewEditor.classList.add('hide');
    hideShield();
}

reviewDivs.forEach((element) => {
    element.addEventListener('click', () => {
        showViewEditor(element);
    });
});

closeReview.addEventListener('click', hideViewEditor);
saveButton.addEventListener('click', () => {
    hideViewEditor();
});
