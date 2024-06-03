const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { hashPassword, verifyPassword } = require('../utils');
const booksPath = path.join(__dirname, '../data/books.json');
const usersPath = path.join(__dirname, '../data/users.json');

async function getBooks() {
    const data = await fs.readFile(booksPath, 'utf8');
    return JSON.parse(data);
}

async function getUsers() {
    const data = await fs.readFile(usersPath, 'utf8');
    return JSON.parse(data);
}

// Tâche 6: Enregistrez un nouvel utilisateur
router.post('/register', async (req, res) => {
    try {
        const users = await getUsers();
        let newUser = req.body;
        const email = newUser.email;
        const username = newUser.username;
        let password = await hashPassword(newUser.password)
        users.push({
            email,
            username,
            password
        });
        await fs.writeFile(usersPath, JSON.stringify(users));
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// Tâche 7: Connectez-vous en tant qu'utilisateur enregistré
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const usersData = await fs.readFile(usersPath, 'utf8');
        const users = JSON.parse(usersData);
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const passwordMatch = await verifyPassword(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Tâche 8: Ajoutez/modifiez une critique de livre
router.post('/reviews/:isbn', async (req, res) => {
    try {
        const books = await getBooks();
        const { isbn } = req.params;
        const { username, review } = req.body;
        const book = books.find(b => b.isbn === isbn);
        if (book) {
            const existingReview = book.reviews.find(r => r.username === username);
            if (existingReview) {
                existingReview.review = review;
            } else {
                book.reviews.push({ username, review });
            }
            await fs.writeFile(booksPath, JSON.stringify(books));
            res.status(200).send('Review added/updated');
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        res.status(500).send('Error adding/updating review');
    }
});

// Tâche 9: Supprimer une critique de livre ajoutée par cet utilisateur
router.delete('/reviews/:isbn/:username', async (req, res) => {
    try {
        const books = await getBooks();
        const { isbn, username } = req.params;
        const book = books.find(b => b.isbn === isbn);
        if (book) {
            book.reviews = book.reviews.filter(r => r.username !== username);
            await fs.writeFile(booksPath, JSON.stringify(books));
            res.status(200).send('Review deleted');
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting review');
    }
});

module.exports = router;
