var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');
var sequelize = require('sequelize');

// Routes
module.exports = {
    register: function (req, res) {

        // Params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;

        if (email == null || username == null) {
            return res.status(400).json({'error': 'missing parameters'});
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['email'],
                    where: {email: email}
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        console.log(err);
                        return res.status(500).json({'error': 'unable to verify user'});
                    });
            },
            function (userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({'error': 'user already exist'});
                }
            },
            function (userFound, bcryptedPassword, done) {
                var newUser = models.User.create({
                    email: email,
                    username: username,
                    password: bcryptedPassword,
                    isAdmin: 0,
                    warns: 0,
                    background_color: '#FFFFFF',
                    text_color: '#000000'
                })
                    .then(function (newUser) {
                        done(newUser);
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'cannot add user'});
                    });
            }
        ], function (newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({'error': 'cannot add user'});
            }
        });
    },
    login: function (req, res) {

        // Params
        var email = req.body.email;
        var password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({'error': 'missing parameters'});
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: {email: email}
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'unable to verify user'});
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({'error': 'user not exist in DB'});
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({'error': 'invalid password'});
                }
            }
        ], function (userFound) {
            if (userFound && userFound.banned ==null) {
                return res.status(201).json({
                    'userId': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
            } else {
                return res.status(500).json({'error': 'cannot log on user'});
            }
        });
    },
    getUserProfile: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({'error': 'wrong token'});

        models.User.findOne({
            where: {id: userId}
        }).then(function (user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({'error': 'user not found'});
            }
        }).catch(function (err) {
            res.status(500).json({'error': 'cannot fetch user'});
        });
    },
    findUsersByName: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var username = req.body.username;

        if (userId < 0)
            return res.status(400).json({'error': 'wrong token'});

        if (username.length === 0)
            return res.status(204).json({'No Content': 'username not long enough. min: 1'});

        models.User.findAll({
            attributes: ['id', 'username','email'],
            where:{
                username: {[sequelize.Op.like]: '%'+username+'%'}
            }

        }).then(function (user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({'error': 'user not found'});
            }
        }).catch(function (err) {
            console.log(err)
            res.status(500).json({'error': 'cannot fetch user'});
        });
    },
    findUsersById: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var idRequest = req.body.id;

        if (userId < 0)
            return res.status(400).json({'error': 'wrong token'});

        models.User.findAll({
            attributes: ['id', 'username','email'],
            where:{
                id: idRequest
            }
        }).then(function (user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({'error': 'user not found'});
            }
        }).catch(function (err) {
            console.log(err)
            res.status(500).json({'error': 'cannot fetch user'});
        });
    },
    updateUserProfile: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var username = req.body.username;
        var birthday = req.body.birthday;
        var sexe = req.body.sexe;
        var isAdmin = req.body.isAdmin;
        var warns = req.body.warns;
        var banned = req.body.banned;
        var text_color = req.body.text_color;
        var background_color = req.body.background_color;

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: {id: userId}
                }).then(function (userFound) {
                    done(null, userFound);
                })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'unable to verify user'});
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    userFound.update({
                        username: (username ? username : userFound.username),
                        birthday: (birthday ? birthday : userFound.birthday),
                        sexe: (sexe ? sexe : userFound.sexe),
                        warns: (warns ? warns : userFound.warns),
                        banned: (banned ? banned : userFound.banned),
                        text_color: (text_color ? text_color : userFound.text_color),
                        background_color: (background_color ? background_color : userFound.background_color)
                    }).then(function () {
                        done(userFound);
                    }).catch(function (err) {
                        res.status(500).json({'error': 'cannot update user'});
                    });
                } else {
                    res.status(404).json({'error': 'user not found'});
                }
            },
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({'error': 'cannot update user profile'});
            }
        });
    },
    banUsersById: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var idRequest = req.body.id;

        if (userId < 0)
            return res.status(400).json({'error': 'wrong token'});

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['id'],
                    where:{
                        id: idRequest
                    }
                }).then(function (userFound) {
                    done(null, userFound);
                })
                    .catch(function (err) {
                        return res.status(500).json({'error': 'unable to verify user'});
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    userFound.update({
                        banned: (null ? banned : 1),
                    }).then(function () {
                        done(userFound);
                    }).catch(function (err) {
                        res.status(500).json({'error': 'cannot update user'});
                    });
                } else {
                    res.status(404).json({'error': 'user not found'});
                }
            },
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({'error': 'cannot update user profile'});
            }
        });
    },
}
