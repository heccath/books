const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const booksPath = path.join(__dirname, '../data/books.json');

async function getBooks() {
    const data = await fs.readFile(booksPath, 'utf8');
    return JSON.parse(data);
}

// Tâche 1: Obtenez la liste des livres disponibles dans le magasin
router.get('/', async (req, res) => {
    try {
        const books = await getBooks();
        res.json(books);
    } catch (error) {
        res.status(500).send('Error reading books data');
    }
});

// Tâche 2: Obtenez les livres en fonction de l'ISBN
router.get('/isbn/:isbn', async (req, res) => {
    try {
        const books = await getBooks();
        const book = books.find(b => b.isbn === req.params.isbn);
        if (book) {
            res.json(book);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        res.status(500).send('Error reading books data');
    }
});

// Tâche 3: Obtenez tous les livres par auteur
router.get('/author/:author', async (req, res) => {
    try {
        const books = await getBooks();
        const booksByAuthor = books.filter(b => b.author.toLowerCase() === req.params.author.toLowerCase());
        res.json(booksByAuthor);
    } catch (error) {
        res.status(500).send('Error reading books data');
    }
});

// Tâche 4: Obtenez tous les livres en fonction du titre
router.get('/title/:title', async (req, res) => {
    try {
        const books = await getBooks();
        const booksByTitle = books.filter(b => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
        res.json(booksByTitle);
    } catch (error) {
        res.status(500).send('Error reading books data');
    }
});

// Tâche 5: Obtenez la critique du livre
router.get('/reviews/:isbn', async (req, res) => {
    try {
        const books = await getBooks();
        const book = books.find(b => b.isbn === req.params.isbn);
        if (book) {
            res.json(book.reviews);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        res.status(500).send('Error reading books data');
    }
});

// Tâche 10: Obtenir tous les livres - En utilisant une fonction callback asynchrone
router.get('/callback/all', (req, res) => {
    fs.readFile(booksPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading books data');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Tâche 11: Recherche par ISBN - Utilisation de promesses
router.get('/promise/isbn/:isbn', (req, res) => {
    fs.readFile(booksPath, 'utf8')
        .then(data => {
            const books = JSON.parse(data);
            const book = books.find(b => b.isbn === req.params.isbn);
            if (book) {
                res.json(book);
            } else {
                res.status(404).send('Book not found');
            }
        })
        .catch(err => res.status(500).send('Error reading books data'));
});

// Tâche 12: Recherche par auteur
router.get('/promise/author/:author', (req, res) => {
    fs.readFile(booksPath, 'utf8')
        .then(data => {
            const books = JSON.parse(data);
            const booksByAuthor = books.filter(b => b.author.toLowerCase() === req.params.author.toLowerCase());
            res.json(booksByAuthor);
        })
        .catch(err => res.status(500).send('Error reading books data'));
});

// Tâche 13: Recherche par titre
router.get('/promise/title/:title', (req, res) => {
    fs.readFile(booksPath, 'utf8')
        .then(data => {
            const books = JSON.parse(data);
            const booksByTitle = books.filter(b => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
            res.json(booksByTitle);
        })
        .catch(err => res.status(500).send('Error reading books data'));
});

module.exports = router;