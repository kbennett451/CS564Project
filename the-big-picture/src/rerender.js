const findMovieButton = document.getElementById('find-a-movie-button');
const findMovieDiv = document.getElementsByClassName('find-a-movie')[0];
const mainMenuDiv = document.getElementsByClassName('main-menu')[0];
const backButton = document.getElementById('back');
const addMovieButton = document.getElementById('add-a-movie-button');
const findAddTitle = document.getElementById('find/add-title');
const findAddbutton = document.getElementById('find/add-button');
const movieBack = document.getElementById('movie-back');
const edit = document.getElementById('edit');
const movieView = document.getElementById('movie-view');
const editableItems = document.getElementsByClassName('edit-item');
const saveButton = document.getElementById('save');

findMovieButton.addEventListener('click', e => {
    mainMenuDiv.classList.add('hide');
    findAddTitle.innerText = "Find a Movie";
    findAddbutton.innerText = "Find";
    findMovieDiv.classList.remove('hide');
  });

backButton.addEventListener('click', e => {
    movieView.classList.add('hide');
    mainMenuDiv.classList.remove('hide');
})

movieBack.addEventListener('click', e => {
    findMovieDiv.classList.add('hide');
    mainMenuDiv.classList.remove('hide');
})

addMovieButton.addEventListener('click', e => {
    mainMenuDiv.classList.add('hide');
    findAddTitle.innerText = "Add a Movie";
    findAddbutton.innerText = "Add";
    findMovieDiv.classList.remove('hide');
})

edit.addEventListener('click', e => {
    for (let i = 0; i < editableItems.length; i++) {
        console.log(editableItems[i])
        editableItems[i].classList.remove('hide')
    }
    saveButton.classList.remove('hide');
    edit.classList.add('hide');
})

saveButton.addEventListener('click', e => {
    for (let i = 0; i < editableItems.length; i++) {
        console.log(editableItems[i])
        editableItems[i].classList.add('hide')
    }
    saveButton.classList.add('hide')
    edit.classList.remove('hide')
})