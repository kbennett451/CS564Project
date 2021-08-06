/* eslint-disable eqeqeq */
const sqlite3 = require('sqlite3').verbose();

function queryDatabase(query) {
    const db = new sqlite3.Database('./database/theBigPicture.db', sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the  database.');
    });

    console.log(query);

    db.serialize(() => {
        db.each(query, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            console.log(row);
        });
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

function callbackOnDatabase(query, callback) {
    const db = new sqlite3.Database('./database/theBigPicture.db', sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the  database.');
    });

    console.log(query);

    db.serialize(() => {
        db.each(query, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            callback(row);
        });
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

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
//const searchResults = document.getElementsByClassName('result');

/* Reviews */
const reviewDivs = Array.from(document.getElementsByClassName('review'));
const closeReview = document.getElementById('close-review');
const saveReview = document.getElementById('save-review');
const reviewEditor = document.getElementById('review-editor');

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
        editableItems[i].readOnly = false;
    }
    saveButton.classList.remove('hide');
    edit.classList.add('hide');
}

/**
 * Disables the editable items
 */
function disableEditableItems() {
    for (let i = 0; i < editableItems.length; i++) {
        editableItems[i].readOnly = true;
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

/* Functions for search view */
function hideSearchResults() {
    searchResultsDiv.classList.add('hide');
}
function showSearchResults() {
    searchResultsDiv.classList.remove('hide');
}
function showSearchPopup(type) {
    searchPopup.firstElementChild.innerText = (type == 'actor') ? 'Search Actor / Actress' : 'Search Director';
    searchPopup.classList.remove('hide');
}
function hideSearchPopup() {
    searchPopup.classList.add('hide');
}

/* Functions for review editor */
function showReviewEditor() {
    showSheild();
    reviewEditor.classList.remove('hide');
}

function hideReviewEditor() {
    reviewEditor.classList.add('hide');
    hideShield();
}

/**
 * Reusable object for the search criteria of a query
 */
const searchCriteria = {
    title: '',
    releaseDate: '',
    runtime: '',
    rating: '',
};
/**
 * Function to take input criteria and convert to an object
 */
function getSearchCriteria() {
    Array.from(document.getElementsByClassName('criteria')).forEach((element) => {
        switch (element.name) {
        case 'title':
            searchCriteria.title = element.value;
            break;
        case 'releaseDate':
            searchCriteria.releaseDate = element.value;
            break;
        case 'runtime':
            searchCriteria.runtime = element.value;
            break;
        case 'rating':
            searchCriteria.rating = element.value;
            break;
        default:
        }
    });
}

/**
 * Parses the searchCriteria object into a SQL query
 * @returns SQL Query String
 */
function parseMovieCriteria() {
    let query = 'SELECT id, title, releaseDate, rating, runtime, info FROM Movie';
    let whereClause = '';
    if (searchCriteria.title != '') {
        whereClause += whereClause.includes('WHERE') ? ' AND' : ' WHERE';
        whereClause += ` Movie.title LIKE '%${searchCriteria.title}%'`;
    }
    if (searchCriteria.releaseDate != '') {
        whereClause += whereClause.includes('WHERE') ? ' AND' : ' WHERE';
        whereClause += ` Movie.releaseDate = "${searchCriteria.releaseDate}"`;
    }
    if (searchCriteria.runtime != '') {
        whereClause += whereClause.includes('WHERE') ? ' AND' : ' WHERE';
        whereClause += ` Movie.runtime = ${searchCriteria.runtime}`;
    }
    if (searchCriteria.rating != '') {
        whereClause += whereClause.includes('WHERE') ? ' AND' : ' WHERE';
        whereClause += ` Movie.rating = ${searchCriteria.rating}`;
    }
    const res = (whereClause != '') ? query += whereClause : query;
    return res;
}

/**
 * Conversts a string of HTML into a true DOM element
 * @param {} html - string of HTML
 * @returns DOM element
 */
function htmlToElement(html) {
    const element = document.createElement('div');
    element.innerHTML = html;
    return element.firstChild;
}

/**
 * Generates a result view of the movies returned from the search
 * @param {Movie Object} movie - ID and Name
 * @returns the html string for the movie result
 */
function generateMovieResultTemplate(movie) {
    return `<div class="result" data-id="${movie.id}">
                <span>${movie.title} - ${movie.releaseDate}</span>
            </div>`;
}

function addReviews(movie) {

}

function generateActorListItem(actor) {
    return `<li contenteditable="false" data-id=${actor.id}>${actor.name}</li>`
}

function addActor(actor) {
    const child = htmlToElement(generateActorListItem(actor));
    document.getElementById('actor-list').appendChild(child);
}

function queryActorsFromMovie(movieID) {
    const query = `SELECT Actor.name, Actor.id
                    FROM StarsIn
                    INNER JOIN Actor ON Actor.id = StarsIn.aID
                    WHERE mID = ${movieID}`;
    callbackOnDatabase(query, addActor);
}

function addDirector(director) {
    document.getElementById('director-movie-view').value = director.name;
}

function queryDirectorFromMovie(movieID) {
    const query = `SELECT Director.name FROM Directs
                    INNER JOIN Director ON Director.id = dID
                    WHERE mID = ${movieID}`;
    callbackOnDatabase(query, addDirector);
}

function setMovieViewContent(movie) {
    // data from initial query
    document.getElementById('movie-title').innerText = movie.title;
    document.getElementById('rating').value = movie.rating;
    document.getElementById('runtime').value = movie.runtime;
    document.getElementById('releaseDate-movie').value = `${movie.releaseDate}`;
    document.getElementById('info').value = movie.info;
    
    // get directors
    queryDirectorFromMovie(movie.id);
    // get actors/actresses
    queryActorsFromMovie(movie.id);
    // get reviews'
    addReviews(movie);
}

function addMovieResults(movie) {
    const child = htmlToElement(generateMovieResultTemplate(movie)); // create element

    child.addEventListener('click', () => { // add event listener to element
        hideSearchResults();
        hideShield();
        findMovieDiv.classList.add('hide'); // hide the find movie div that's under the shield
        movieView.classList.remove('hide'); // expose the movie view

        // remove all nodes once one is clicked
        Array.from(document.getElementsByClassName('result')).forEach((element) => {
            element.remove();
        });

        // set the values in the Movie View
        setMovieViewContent(movie);
    });
    searchResultsDiv.appendChild(child); // finally add this to the div
}

/**
 * Generates the appropriate Actor query
 * @param {string} name - name to search for
 * @returns the string SQL query
 */
function queryActor(name) {
    return `SELECT Actor.id, Actor.name FROM Actor WHERE Actor.name LIKE '%${name}%'`;
}

/**
 * Generates the appropriate Director query
 * @param {string} name - name to search for
 * @returns the string SQL query
 */
function queryDirector(name) {
    return `SELECT Director.id, Director.name FROM Director WHERE Director.name LIKE '%${name}%'`;
}

/**
 * Crates a template for a search result from Actor and Director
 * @param {needs ID and Name} record - record from the SQL table
 * @returns The string of HTML
 */
function generateSearchTemplate(record) {
    return `<div class="result" data-id="${record.id}">
                <span>${record.name}</span>
            </div>`;
}

/**
 * Adds results from Actor search
 * @param {id: "", name: ""} row - row of the table
 */
function addActorResult(row) {
    const child = htmlToElement(generateSearchTemplate(row)); // create element

    child.addEventListener('click', () => { // add event listener to element
        hideSearchResults();
        hideShield();

        // remove all nodes once one is clicked
        Array.from(document.getElementsByClassName('result')).forEach((element) => {
            element.remove();
        });

        // set the value in the find view
        const inputNode = document.getElementById('actor');
        if (inputNode != null) {
            inputNode.value = row.name;
            inputNode.dataset.id = row.id; // add a data attribute
            // TODO: clear this if the value is changed / cleared
        }
        document.getElementById('search-input').value = ''; // clear search input
    });
    searchResultsDiv.appendChild(child); // finally add this to the div
}

/**
 * Adds results from Director search
 * @param {id: "", name: ""} row - row of the table
 */
function addDirectorResult(row) {
    const child = htmlToElement(generateSearchTemplate(row)); // create element

    child.addEventListener('click', () => { // add event listener to element
        hideSearchResults();
        hideShield();

        // remove all nodes once one is clicked
        Array.from(document.getElementsByClassName('result')).forEach((element) => {
            element.remove();
        });

        // set the value in the find view
        const inputNode = document.getElementById('director');
        if (inputNode != null) {
            inputNode.value = row.name;
            inputNode.dataset.id = row.id; // add a data attribute
            // TODO: clear this if the value is changed / cleared
        }
        document.getElementById('search-input').value = ''; // clear search input
    });
    searchResultsDiv.appendChild(child); // finally add this to the div
}


/* Bind find button */
// TODO: fix Add
findAddbutton.addEventListener('click', () => {
    getSearchCriteria();
    callbackOnDatabase(parseMovieCriteria(), addMovieResults);
    showSheild();
    showSearchResults();
});

/* Bind the search button for Actor/Director search */
search.addEventListener('click', () => {
    const name = document.getElementById('search-input').value;
    if (name != '') {
        switch (search.dataset.type) {
        case 'actor':
            callbackOnDatabase(queryActor(name), addActorResult);
            break;
        default:
            callbackOnDatabase(queryDirector(name), addDirectorResult);
        }
    }
    hideSearchPopup();
    showSearchResults();
});

/* Bind the Find Actor button */
searchActor.addEventListener('click', () => {
    showSheild();
    const val = document.getElementById('actor').value;
    if (val != '') {
        callbackOnDatabase(queryActor(name), addActorResult);
        showSearchResults();
    }
    else {
        showSearchPopup('actor');
        search.dataset.type = 'actor'; // used by search button to determine which query to run
    }
});

/* Bind the Find Director button */
searchDirector.addEventListener('click', () => {
    showSheild();
    const val = document.getElementById('director').value;
    if (val != '') {
        callbackOnDatabase(queryDirector(val), addDirectorResult);
        showSearchResults();
    }
    else {
        showSearchPopup('director');
        search.dataset.type = 'director'; // used by search button to determine which query to run
    }
});

// Cleanup the id if the user changes the name of the director
document.getElementById('director').addEventListener('input', (e) => {
    if (e.target.dataset.id != null) {
        e.target.dataset.id = null; // if the user changes the value, don't keep the ID
    }
});

// Cleanup the id if the user changes the name of the actor
document.getElementById('actor').addEventListener('input', (e) => {
    if (e.target.dataset.id != null) {
        e.target.dataset.id = null; // if the user changes the value, don't keep the ID
    }
});

/* Add event listener on each review */
reviewDivs.forEach((element) => {
    element.addEventListener('click', () => {
        showReviewEditor(element);
    });
});

closeReview.addEventListener('click', hideReviewEditor);

saveReview.addEventListener('click', hideReviewEditor);

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
