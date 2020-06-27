const express = require('express');
const router = express.Router();

const pool = require('../database');
const  { isLoggedin } = require('../lib/auth');


router.get('/add', isLoggedin, (req, res) => {
    res.render('links/add.hbs');
})

router.post('/add', isLoggedin, async (req, res) => {
    const { title, url, description } = req.body;
    const newlink = {
        title,
        url,
        description,
        user_id: req.user.id
    };

    await pool.query('INSERT INTO link set ?', [newlink])
    req.flash('success', 'Link saved correctly');
    res.redirect('/links');

})

router.get('/', isLoggedin, async (req, res) => {
    const links = await pool.query('SELECT * FROM link WHERE user_id = ?', [req.user.id]);
    console.log(links);
    res.render('links/list', {links});

});

router.get('/delete/:id', isLoggedin, async (req, res) =>{
    const {id} = req.params;
    await pool.query('DELETE FROM link WHERE ID = ?', [id]);
    req.flash('success', 'Link erased correctly');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedin, async (req, res) =>{
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM link WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedin, async(req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE link set ? Where id = ?', [newLink, id]);
    req.flash('success', 'Link updated correctly');
    res.redirect('/links');
})

module.exports = router;