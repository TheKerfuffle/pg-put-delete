$(document).ready(function(){
  console.log('jQuery sourced.');

  // click handlers
  $('#bookShelf').on('click', '.delete-book', deleteBookHandler);
  $('#bookShelf').on('click', '.mark-read', markAsReadHandler);

  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let newRow = $(`
    <tr>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isRead}</td>
      <td>
        <button type="button" class="delete-book" data-id="${book.id}">Delete</button>
        <button type="button" class="mark-read" data-id="${book.id}">Mark as Read</button>
      </td>
    </tr>
  `);
    newRow.data('id', book.id)
    $('#bookShelf').append(newRow);
  }
}

// Client side to delete a book

function deleteBookHandler() {
  deleteBook($(this).data("id"));
}

function deleteBook(bookId) {
  $.ajax({
      method: 'DELETE',
      url: `/books/${bookId}`
  })
  .then( response => {
      console.log('deleted');
      refreshBooks();
  })
  .catch(error => {
      alert(`Error on delete`);
  });
}

// Client side to mark a book as read

function markAsReadHandler() {
    markAsRead($(this).data("id"));
}

function markAsRead(bookId) {
  $.ajax({
      method: "PUT",
      url: `/books/${bookId}`,
      data: {
          read: true 
      }
  }).then(response =>{
    refreshBooks();
  }).catch(err =>{
      console.log('Error on markAsRead', err);
      
  })
}