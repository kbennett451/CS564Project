/* eslint-disable no-case-declarations */
/* eslint-disable no-console */ //TODO: probably remove this
/* eslint-disable eqeqeq */
const sqlite3 = require('sqlite3').verbose();

/**
 * TODO: likely delete this, mostly for testing
 * @param {SQL} query - SQL String
 */
function queryDatabase(query) {
    const db = new sqlite3.Database('./database/theBigPicture.db', sqlite3.OPEN_READWRITE, (err) => {
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

/**
 * Exectues a callback on the database
 * If insert == true, callback is at the end, otherwise it is on each row.
 */
function callbackOnDatabase(query, callback, insert) {
    const db = new sqlite3.Database('./database/theBigPicture.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the  database.');
    });

    //TODO: delete
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

    if (insert) {
        callback();
    }
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
    console.log(this);
    const query = `SELECT Review.id, Review.content FROM Review WHERE review.id = ${this.dataset.id}`;
    callbackOnDatabase(query, (review) => {
        document.getElementById('review-content').value = review.content;
        document.getElementById('review-content').dataset.id = review.id;
    });
}

/**
 * Hides the review editor and performs teardown actions
 */
function hideReviewEditor() {
    reviewEditor.classList.add('hide');
    document.getElementById('review-content').value = '';
    document.getElementById('review-content').removeAttribute('data-id');
    document.getElementById('review-content').removeAttribute('data-edited');
    hideShield();
}

/**
 * Reusable object for the criteria of a query
 */
const criteria = {
    title: '',
    releaseDate: '',
    runtime: '',
    rating: '',
    actorName: '',
    actorId: '',
    dirctorName: '',
    directorId: '',
};
/**
 * Function to take input criteria and convert to an object
 */
function getSearchCriteria() {
    Array.from(document.getElementsByClassName('criteria')).forEach((element) => {
        switch (element.name) {
        case 'title':
            criteria.title = element.value;
            break;
        case 'releaseDate':
            criteria.releaseDate = element.value;
            break;
        case 'runtime':
            criteria.runtime = element.value;
            break;
        case 'rating':
            criteria.rating = element.value;
            break;
        case 'actor':
            if (element.hasAttribute('data-id')) {
                criteria.actorId = element.dataset.id;
                criteria.actorName = '';
            }
            else {
                criteria.actorId = '';
                criteria.actorName = element.value;
            }
            break;
        case 'director':
            if (element.hasAttribute('data-id')) {
                criteria.directorId = element.dataset.id;
                criteria.dirctorName = '';
            }
            else {
                criteria.directorId = '';
                criteria.directorName = element.value;
            }
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
    if (criteria.title != '') {
        whereClause += whereClause.includes('WHERE') ? ' AND' : ' WHERE';
        if (criteria.title.length < 3) {
            whereClause += ` Movie.title LIKE '${criteria.title}%'`;
        }
        else {
            whereClause += ` Movie.title LIKE '%${criteria.title}%'`;
        }
    }
    if (criteria.releaseDate != '') {
        whereClause += whereClause.includes('WHERE') ? ' AND' : ' WHERE';
        whereClause += ` Movie.releaseDate = "${criteria.releaseDate}"`;
    }
    if (criteria.runtime != '') {
        whereClause += whereClause.includes('WHERE') ? ' AND' : ' WHERE';
        whereClause += ` Movie.runtime = ${criteria.runtime}`;
    }
    if (criteria.rating != '') {
        whereClause += whereClause.includes('WHERE') ? ' AND' : ' WHERE';
        whereClause += ` Movie.rating = ${criteria.rating}`;
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

function generateReviewTemplate(review) {
    return `<div class="review" data-id=${review.id} id="review-${review.id}">${review.content}</div>`;
}

function addIndividualReview(review) {
    const child = htmlToElement(generateReviewTemplate(review));
    child.addEventListener('click', showReviewEditor);
    document.getElementById('review-list').appendChild(child);
}

/**
 * Adds the reviews to the screen
 * @param {movie object} movie - movie to find reviews for
 */
function addReviews(movie) {
    const query = `SELECT review.id, review.content FROM review INNER JOIN Describes on review.id = rID where mID = ${movie.id} LIMIT 100`;
    callbackOnDatabase(query, addIndividualReview);
}

/**
 * Generates a html element for actor
 * @param {object} actor - name and id
 * @returns html string
 */
function generateActorListItem(actor) {
    return `<li contenteditable="false" data-id=${actor.id}>${actor.name}</li>`;
}

/**
 * Adds the actor to the actor-list
 * @param {object} actor - the actor to add
 */
function addActor(actor) {
    const child = htmlToElement(generateActorListItem(actor));
    document.getElementById('actor-list').appendChild(child);
}

/**
 * Queries the actors based on a movie and adds them to the DOM
 * @param {int} movieID - movie ID
 */
function queryActorsFromMovie(movieID) {
    const query = `SELECT Actor.name, Actor.id
                    FROM StarsIn
                    INNER JOIN Actor ON Actor.id = StarsIn.aID
                    WHERE mID = ${movieID}`;
    callbackOnDatabase(query, addActor);
}

/**
 * Adds the director's name to the input field
 * @param {object} director - the director to add
 */
function addDirector(director) {
    //TODO: figure out how to update when this changes
    //probably should have ID here to remove it from directs on change
    document.getElementById('director-movie-view').value = director.name;
}

/**
 * Queries the director given a movie's ID
 * @param {int} movieID - the movie's ID
 */
function queryDirectorFromMovie(movieID) {
    const query = `SELECT Director.name FROM Directs
                    INNER JOIN Director ON Director.id = dID
                    WHERE mID = ${movieID}`;
    callbackOnDatabase(query, addDirector); // TODO: consider multiple directors
}

/**
 * Configures the movie view based on the content returned from the query
 * @param {object} movie - movie object
 */
function setMovieViewContent(movie) {
    // data from initial query
    document.getElementById('movie-title').innerText = movie.title;
    document.getElementById('rating').value = movie.rating;
    document.getElementById('runtime').value = movie.runtime;
    document.getElementById('releaseDate-movie').value = `${movie.releaseDate}`;
    document.getElementById('info').value = movie.info;
    document.getElementById('movie-view').dataset.id = movie.id;

    // get directors
    queryDirectorFromMovie(movie.id);

    // get actors/actresses
    queryActorsFromMovie(movie.id);

    // get reviews'
    addReviews(movie);
}

/**
 * Adds movie results to the results view for the user to choose
 * @param {object} movie - movie object
 */
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

/**
 * Adds the new movie to the database
 */
function addMovieToDatabase() { //TODO: actually file to the database
    getSearchCriteria();
    console.log('Adding Movie');
    console.log(criteria);
}

/**
 * Validates the add criteria for a movie
 * @returns the text for an alert message, no text means we're good
 */
// TODO: add more criteria
function validateAddMovieCriteria() {
    let text = '';
    getSearchCriteria();
    if (criteria.title == '') {
        text += 'Missing A Title \n';
    }
    return text;
}


/* Bind find button */
// TODO: This is for find, need to do the same for add
findAddbutton.addEventListener('click', () => {
    switch (document.getElementById('find-a-movie').dataset.type) {
    case 'add':
        const text = validateAddMovieCriteria();
        if (text == '') {
            addMovieToDatabase();
        }
        else {
            alert(text);
        }
        break;
    default:
        getSearchCriteria();
        callbackOnDatabase(parseMovieCriteria(), addMovieResults);
        showSheild();
        showSearchResults();
        break;
    }
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
        callbackOnDatabase(queryActor(val), addActorResult);
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
        e.target.dataset.removeAttribute('data-id'); // if the user changes the value, don't keep the ID
    }
});

// Cleanup the id if the user changes the name of the actor
document.getElementById('actor').addEventListener('input', (e) => {
    if (e.target.dataset.id != null) {
        e.target.removeAttribute('data-id'); // if the user changes the value, don't keep the ID
    }
});

/* Bind the close button */
closeReview.addEventListener('click', hideReviewEditor);

/**
 * Handle updating a review as a callback from the database
 */
function handleReviewUpdates() {
    const searchContent = document.getElementById('review-content').value;
    const query = `SELECT id FROM Review WHERE content = "${searchContent}"`;

    callbackOnDatabase(query, (review) => { // second callback since insert has a poor callback function
        // add to the describes database
        const movieID = document.getElementById('movie-view').dataset.id;
        callbackOnDatabase(`INSERT INTO Describes (mID, rID) VALUES (${movieID}, ${review.id})`, () => {

        }, true);

        // update the review ID on the view
        document.getElementById('xxx').dataset.id = review.id;
        document.getElementById('xxx').id = `review-${review.id}`;
    });
}

/**
 * Adds the new review to the database and updates the view
 * @param {review object} review - object holding review contents
 */
function commitNewReviewToDatabase(review) {
    const insertQuery = `INSERT INTO Review (content) VALUES ("${review.content}")`;
    callbackOnDatabase(insertQuery, () => {

    }, true);
    setTimeout(() => {
    // unfortunately sqlite 3.2 doesn't support return from an insert so let's just add a delay here
        handleReviewUpdates();
    }, 3000);
}

/**
 * Saves the content of the review
 */
function saveReviewContent() {
    const review = document.getElementById('review-content');
    if (review.hasAttribute('data-id')) { // is existing review
        if (review.dataset.edit == 'true') { // update the review
            const query = `UPDATE Review SET content = "${review.value}" WHERE id = ${review.dataset.id}`;
            queryDatabase(query);

            // make it so we can get the element easily with an id
            document.getElementById(`review-${review.dataset.id}`).innerText = review.value; 
        }
    }
    else { // new review
        // using 'xxx' here so that we can easily find it in the callback
        const content = { id: 'xxx', content: review.value };
        addIndividualReview(content);
        commitNewReviewToDatabase(content);
    }
    hideReviewEditor();
}

/* Bind the save button */
saveReview.addEventListener('click', saveReviewContent);

/**
 * Clean up the movie view so things don't bleed through to new searches
 */
function cleanupMovieView() {
    returnToFindMovie();

    // remove list of actors
    const actorList = document.getElementById('actor-list');
    while (actorList.firstChild != null) {
        actorList.firstChild.remove();
    }

    // remove list of reviews
    const reviewList = document.getElementById('review-list');
    while (reviewList.firstChild != null) {
        reviewList.firstChild.remove();
    }

    document.getElementById('movie-view').removeAttribute('data-id');
}
/* Event Listners */
movieBack.addEventListener('click', cleanupMovieView);

findMovieButton.addEventListener('click', () => {
    showFindMovie();

    // make sure the type is find so we know what we're doing on save/edit
    document.getElementById('find-a-movie').dataset.type = 'find';
});

addMovieButton.addEventListener('click', () => {
    showAddMovie();

    // make sure the type is add so we know what to do on save
    document.getElementById('find-a-movie').dataset.type = 'add';
});

/* Bind edit button to toggle editable items */
edit.addEventListener('click', () => {
    enableEditableItems();
});

/* Bind save button to disable editable items */
saveButton.addEventListener('click', () => {
    //TODO: determine what needs to be saved
    disableEditableItems();
});

searchCancel.addEventListener('click', () => {
    hideShield();
    hideSearchPopup();
});

//TODO: implement SQL query to delete
function deleteMovie() {
    const id = document.getElementById('movie-view').dataset.id;
    console.log(`Delete ${id}`);
    cleanupMovieView();
}

/* Bind delete button */
document.getElementById('delete-movie').addEventListener('click', deleteMovie);

/**
 * Shows the new review editor to add a review
 */
function newReviewEditor() {
    showSheild();
    reviewEditor.classList.remove('hide');
    document.getElementById('review-content').removeAttribute('data-id');
}

/* Binds the add review button */
document.getElementById('add-movie-review').addEventListener('click', newReviewEditor);

// setup the editor so that we can track changes
document.getElementById('review-content').addEventListener('input', (e) => {
    if (e.target.dataset.edit != null) {
        e.target.dataset.edit = true;
    }
});
