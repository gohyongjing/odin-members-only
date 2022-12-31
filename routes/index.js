const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

/// User Routes ///

/* Get request for home page. */
router.get('/', userController.index)

/* Get request for creating a new user. */
router.get('/user/create', userController.user_create_get)

/* Post request for creating a new user. */
router.post('/user/create', userController.user_create_post)

/* Get request for loging in user. */
router.get('/user/login', userController.user_login_get)

/* Post request for loging in user. */
router.post('/user/login', userController.user_login_post)

/// Message Routes ///

/* Get request for retrieving all messages. */
router.get('/messages', messageController.message_list);

/* Get request for creating a new message. */
router.get('/message/create', messageController.message_create_get)

/* Post request for creating a new message. */
router.post('/message/create', messageController.message_create_post)

/* Get request for deleting a message. */
router.get('/message/delete', messageController.message_delete_get)

/* Post request for deleting a message. */
router.post('/message/delete', messageController.message_delete_post)

module.exports = router;
