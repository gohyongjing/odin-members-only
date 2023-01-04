const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

/// User Routes ///

/* Get request for creating a new user. */
router.get('/user/create', userController.user_create_get)

/* Post request for creating a new user. */
router.post('/user/create', userController.user_create_post)

/* Get request for logging in user. */
router.get('/user/login', userController.user_login_get)

/* Post request for logging in user. */
router.post('/user/login', userController.user_login_post)

/* Post request for logging out user. */
router.post('/user/logout', userController.user_logout)

/* Get request for becoming a member. */
router.get('/user/join_member', userController.join_member_get)

/* Post request for becoming a member. */
router.post('/user/join_member', userController.join_member_post)

/* Get request for becoming a admin. */
router.get('/user/join_admin', userController.join_admin_get)

/* Post request for becoming a admin. */
router.post('/user/join_admin', userController.join_admin_post)

/// Message Routes ///

/* Get request for home page. */
router.get('/', messageController.index)

/* Get request for creating a new message. */
router.get('/message/create', messageController.message_create_get)

/* Post request for creating a new message. */
router.post('/message/create', messageController.message_create_post)

/* Get request for deleting a message. */
router.get('/message/:id/delete', messageController.message_delete_get)

/* Post request for deleting a message. */
router.post('/message/:id/delete', messageController.message_delete_post)

module.exports = router;
