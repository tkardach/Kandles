const mongoose = require('mongoose');
const {logger} = require('../debug/logging');
const {validateObjectId} = require('../middleware/validateObjectId');
const {auth} = require('../middleware/auth');
const {admin} = require('../middleware/admin');
const express = require('express');
const router = express.Router();

router.get('/', [auth, admin], async () => {

});

router.get('/:id', [auth, admin, validateObjectId], async () => {

});

router.post('/', [auth, admin], async () => {

});

router.put('/:id', [auth, admin, validateObjectId], async () => {

});

router.delete('/:id', [auth, admin, validateObjectId], async() => {

});