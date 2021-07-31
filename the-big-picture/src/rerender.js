const findMovieButton = document.getElementById('find-a-movie-button');
const findMovieDiv = document.getElementsByClassName('find-a-movie')[0];
const mainMenuDiv = document.getElementsByClassName('main-menu')[0];
const backButton = document.getElementById('back');
const addMovieButton = document.getElementById('add-a-movie-button');
const findAddTitle = document.getElementById('find/add-title');
const findAddbutton = document.getElementById('find/add-button');

findMovieButton.addEventListener('click', e => {
    mainMenuDiv.classList.add('hide');
    findAddTitle.innerText = "Find a Movie";
    findAddbutton.innerText = "Find";
    findMovieDiv.classList.remove('hide');
  });

backButton.addEventListener('click', e => {
    findMovieDiv.classList.add('hide');
    mainMenuDiv.classList.remove('hide');
})

addMovieButton.addEventListener('click', e => {
    mainMenuDiv.classList.add('hide');
    findAddTitle.innerText = "Add a Movie";
    findAddbutton.innerText = "Add";
    findMovieDiv.classList.remove('hide');
})