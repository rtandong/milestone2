$(document).ready(function () {
    const API_KEY = 'AIzaSyAVhO8H0bVJ0759w9KbAmjfBpube8Jf9F8';
    const MAX_RESULTS_PER_PAGE = 10;
    const MAX_PAGES = 6; // Limit to 6 pages
    let books = [];
    let currentPage = 1;
    let totalPages = 0;
    function searchBooks(query, page = 1) {
        const startIndex = (page - 1) * MAX_RESULTS_PER_PAGE;
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${MAX_RESULTS_PER_PAGE}&key=${API_KEY}`)
        .done(function (data) {
            books = data.items || [];
            totalPages = Math.min(Math.ceil(data.totalItems / MAX_RESULTS_PER_PAGE), MAX_PAGES); // Limit to 6 pages
            displayResults(books);
            displayPagination(totalPages, page);
        })
        .fail(function () {
            $('#results').html('<p>An error occurred while fetching data. Please try again.</p>');
        });
    }
    function displayResults(books) {
        $('#results').empty();
        if (books.length === 0) {
            $('#results').html('<p>No results found.</p>');
            return;
        }
        books.forEach(book => {
            const title = book.volumeInfo.title;
            const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg';
            $('#results').append(`
                <div class="book" data-id="${book.id}">
                    <img src="${imageUrl}" alt="${title}">
                    <a href="bookDetails.html?id=${book.id}">
                    <p>${title}</p>
                </div>
            `);
        });
    }

    function displayPagination(totalPages, currentPage) {
        $('#pagination').empty();
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        for (let i = startPage; i <= endPage; i++) {
            $('#pagination').append(`<button class="page-link" data-page="${i}">${i}</button>`);
        }
        $('.page-link').removeClass('active');
        $(`.page-link[data-page="${currentPage}"]`).addClass('active');
    }
    $('#searchButton').click(function () {
        const query = $('#searchTerm').val().trim();
        if (query) {
            searchBooks(query);
        } else {
            alert("Enter a search term");
        }
    });
    $('#searchTerm').keydown(function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            $('#searchButton').click();
        }
    });
    $('#pagination').on('click', '.page-link', function () {
        currentPage = $(this).data('page');
        const query = $('#searchTerm').val();
        searchBooks(query, currentPage);
    });
    function displayBookDetails(book) {
        const details = `
            <h3>${book.volumeInfo.title}</h3>
            <p>${book.volumeInfo.description || 'No description available.'}</p>
            <img src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg'}" alt="${book.volumeInfo.title}">
        `;
        $('#bookDetails').html(details);
    }
    $('#results').on('click', '.book', function () {
        const bookId = $(this).data('id');
        const book = books.find(b => b.id === bookId);
        displayBookDetails(book);
    });
    function displayBookshelf() {
        fetch(`https://www.googleapis.com/books/v1/users/111513666397003909535/bookshelves/1002/volumes?key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                const bookshelfBooks = data.items || [];
                $('#bookshelf').empty();
                if (bookshelfBooks.length === 0) {
                    $('#bookshelf').html('<p>No books found in the bookshelf.</p>');
                    return;
                }
                bookshelfBooks.forEach(book => {
                    const title = book.volumeInfo.title;
                    const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg';
                    $('#bookshelf').append(`
                        <div class="book" data-id="${book.id}">
                            <img src="${imageUrl}" alt="${title}">
                            <a href="bookDetails.html?id=${book.id}">
                            <p>${title}</p>
                        </div>
                    `);
                });
                $('#bookshelf').on('click', '.book', function () {
                    const bookId = $(this).data('id');
                    const book = bookshelfBooks.find(b => b.id === bookId);
                    displayBookDetails(book);
                });
            })
            .catch(error => console.error('Error fetching bookshelf data:', error));
    }
    displayBookshelf();
});
