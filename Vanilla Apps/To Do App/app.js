const inputBox = document.getElementById('input-box');
//const listContainer = document.getElementById('list-container');
const pendingListContainer = document.getElementById('pending-list-container');
const completedListContainer = document.getElementById('completed-list-container');

function AddTask() {
    if (inputBox.value === '') {
        alert('You must write something!');
    } else {
        let li = document.createElement('li');
        li.innerHTML = inputBox.value;
        // New tasks are added to the pending list
        pendingListContainer.appendChild(li);
        let span = document.createElement('span');
        span.innerHTML = '\u00d7';
        li.appendChild(span);
    }
    inputBox.value = '';
    saveData();
}

document.addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
        //Alternate checked status
        e.target.classList.toggle('checked');
        //Move task between pending and completed lists
        if (e.target.classList.contains('checked')) {
            completedListContainer.appendChild(e.target);
        } else {
            pendingListContainer.appendChild(e.target);
        }
        saveData();
    } else if (e.target.tagName === 'SPAN') {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    //localStorage.setItem('data', listContainer.innerHTML);
    localStorage.setItem('pendingData', pendingListContainer.innerHTML);
    localStorage.setItem('completedData', completedListContainer.innerHTML);
}

function loadData() {
    //listContainer.innerHTML = localStorage.getItem('data');
    pendingListContainer.innerHTML = localStorage.getItem('pendingData');
    completedListContainer.innerHTML = localStorage.getItem('completedData');
}

loadData();