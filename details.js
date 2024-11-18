$(document).ready(function () {
    const API_KEY = 'AIzaSyAVhO8H0bVJ0759w9KbAmjfBpube8Jf9F8';

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (bookId) {
        $.getJSON(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`)
        .done(function (data) {
            const book = data.volumeInfo;
            displayBookDetails(book);
        })
        .fail(function () {
            $('#bookDetails').html('<p>An error occurred while fetching the book details. Please try again.</p>');
        });
    } else {
        $('#bookDetails').html('<p>No book ID provided.</p>');
    }

    function displayBookDetails(book) {
        const details = `
            <h3>${book.title}</h3>
            <p><strong>Author(s):</strong> ${book.authors ? book.authors.join(', ') : 'Unknown'}</p>
            <p><strong>Publisher:</strong> ${book.publisher || 'Unknown'}</p>
            <p><strong>Published Date:</strong> ${book.publishedDate || 'Unknown'}</p>
            <p><strong>Description:</strong> ${book.description || 'No description available.'}</p>
            <img src="${book.imageLinks ? book.imageLinks.thumbnail : 'placeholder.jpg'}" alt="${book.title}">
            <p><strong>Page Count:</strong> ${book.pageCount || 'N/A'}</p>
            <p><strong>Categories:</strong> ${book.categories ? book.categories.join(', ') : 'N/A'}</p>
        `;
        $('#bookDetails').html(details);
    }
});
