//Book Class
class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//Store Class
class Store {
  static getBooks(){
    let books;
    if (!localStorage.getItem('books')){
      books = [];
    }
    else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book){
     const books = Store.getBooks();
     books.push(book);
     localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn){
        books.splice(index,1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

//UI Class 
class UI {
  static displayBooks(){
    // const booksInStore = [
    //     {
    //       title: 'Harry Potter',
    //       author: 'J. K. Rowling',
    //       isbn: '9780545010221'
    //     },
    //     {
    //       title: 'Snow White',
    //       author: 'Wilhelm Grimm',
    //       isbn: '0-571-06496-5'
    //     }
    // ]
    const booksInStore = Store.getBooks();
    booksInStore.forEach(book => UI.addBookToList(book));
  }


  static addBookToList(book){
    const list = document.querySelector('.book_list');
    const row = document.createElement('tr');
    row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href="#" class="delete">&times;</a></td>
    `;
    list.appendChild(row);
  }

  static clearFields(){
    document.querySelector('#book_title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }

  static deleteBook(element) {
    if (element.classList.contains('delete')){
       element.parentElement.parentElement.remove();
    }
  }

  static showMessage(message, className){
    const div = document.createElement('div');
    div.className = `${className}`;
    div.appendChild(document.createTextNode(message));
    const heading = document.querySelector('.main_heading');
    const form_wrap = document.querySelector('.form_wrap')
    form_wrap.insertBefore(div,heading);
    setTimeout(() => document.querySelector(`.${className}`).remove(), 2000);
  }

}


//Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a book
document.querySelector('#book_form').addEventListener('submit', e => {
 
 //prevent actual submit 
 e.preventDefault();

 //get form values
 const title = document.querySelector('#book_title').value;
 const author = document.querySelector('#author').value;
 const isbn = document.querySelector('#isbn').value;

 //Validate
 if (title === '' || author === '' || isbn === ''){
   UI.showMessage('Please fill in all fields','error');
 }

 else {
   //instantiate a new book
   const book = new Book(title,author,isbn);
   console.log(book);
   
   //Add book to UI
   UI.addBookToList(book);

   //Add book to store
   Store.addBook(book);

   //Show success message
   UI.showMessage('Book Added', 'success');

   //clear books from UI
   UI.clearFields();
 }
 
});

//Event: remove a book
document.querySelector('.book_list').addEventListener('click', (e) => {
  //Remove book from UI
  UI.deleteBook(e.target);
  
  //Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
  
  //Show success message
  UI.showMessage('Book Removed', 'success')
})

