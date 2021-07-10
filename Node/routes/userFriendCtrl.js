var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');
var sequelize = require('sequelize');

// Routes
module.exports = {
    addFriend: async function (req, res){
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var userFriendId = req.body.userFriendId;

        if (userId < 0)
            return res.status(400).json({'error': 'wrong token'});

        if(userFriendId < 0)
            return res.status(400).json({'error': 'Wrong friendId'});

        if(userId === userFriendId){
            return res.status(400).json({'error': 'UserId and FriendId can\'t be the same'});
        }

        let userFriendExist = await models.UserFriend.findOne({
            attributes: ['userFriendId'],
            where:{
                userId: userId,
                userFriendId: userFriendId
            }
        })
        if(userFriendExist != null)
            return res.status(400).json({'error': 'Friend request already sent'});
        else{
            models.UserFriend.create({
                userId: userId,
                userFriendId: userFriendId,
                status: 0
            }).then(result =>{
                return res.status(201).json({
                    'userFriendId': result.userFriendId
                });
            }).catch(() =>{
                return res.status(500).json({'error': 'cannot add friendRequest'});
            })
        }
    },
    getFriendRequestList: function (req, res){
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
        return res.status(400).json({'error': 'wrong token'});

        models.UserFriend.findAll({
            attributes: ['id', 'userId', 'userFriendId', 'status'],
            where:{
                userFriendId: userId,
                status: 0
            }
        }).then(function (friendRequestList) {
            if (friendRequestList) {
                res.status(201).json(friendRequestList);
            } else {
                res.status(404).json({'error': 'no friends request'});
            }
        }).catch(function () {
            res.status(500).json({'error': 'cannot fetch friend request'});
        });
    },
    acceptRequest: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var requestId = req.body.requestId;
        if (userId < 0)
            return res.status(400).json({'error': 'wrong token'});

        // Params
        var status = 1;

        asyncLib.waterfall([
            function (done) {
                models.UserFriend.findOne({
                    where: {id: requestId}
                }).then(function (requestFound) {
                    done(null, requestFound);
                })
                    .catch(function () {
                        return res.status(500).json({'error': 'unable to find request'});
                    });
            },
            function (requestFound, done) {
                if (requestFound) {
                    requestFound.update({
                        status: (status ? status : requestFound.status)
                    }).then(function () {
                        done(requestFound);
                    }).catch(function () {
                        res.status(500).json({'error': 'cannot update request'});
                    });
                } else {
                    res.status(404).json({'error': 'request not found'});
                }
            },
        ], function (requestFound) {
            if (requestFound) {
                return res.status(201).json(requestFound);
            } else {
                return res.status(500).json({'error': 'cannot update user profile'});
            }
        });
    },
    declineRequest: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var requestId = req.body.requestId;
        if (userId < 0)
            return res.status(400).json({'error': 'wrong token'});

        // Params
        var status = -1;

        asyncLib.waterfall([
            function (done) {
                models.UserFriend.findOne({
                    where: {id: requestId}
                }).then(function (requestFound) {
                    done(null, requestFound);
                })
                    .catch(function () {
                        return res.status(500).json({'error': 'unable to find request'});
                    });
            },
            function (requestFound, done) {
                if (requestFound) {
                    requestFound.update({
                        status: (status ? status : requestFound.status)
                    }).then(function () {
                        done(requestFound);
                    }).catch(function () {
                        res.status(500).json({'error': 'cannot update request'});
                    });
                } else {
                    res.status(404).json({'error': 'request not found'});
                }
            },
        ], function (requestFound) {
            if (requestFound) {
                return res.status(201).json(requestFound);
            } else {
                return res.status(500).json({'error': 'cannot update user profile'});
            }
        });
    },
    listFriend: async function (req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({'error': 'wrong token'});

        let listUserFriendWIthID = await models.UserFriend.findAll({
            attributes: ['userFriendId'],
            where: {
                userId: userId,
                status: 1
            }
        })
        let listUserFriendWIthFriendID = await models.UserFriend.findAll({
            attributes: ['userId'],
            where: {
                userFriendId: userId,
                status: 1
            }
        })

        listUserFriendWIthFriendID = listUserFriendWIthFriendID.map(
            item => item.userId

        )

        listUserFriendWIthID = listUserFriendWIthID.map(
            item => item.userFriendId
        )

        let friendIdList = listUserFriendWIthID.concat(listUserFriendWIthFriendID)


        let friendUserList = await models.User.findAll({
            attributes : ['id','username','email'],
            where: {
                id : {[sequelize.Op.in]: friendIdList}
            }
        })


        if (friendUserList != null) {
            res.status(201).json(friendUserList);
        } else {
            res.status(404).json({'error': 'no friends'});
        }
        // res.status(500).json({'error': 'cannot fetch friend list'});
    },
    deleteUserFriend: function (req,res){
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var userFriendId = req.params.id;

        if (userId < 0)
            return res.status(400).json({'error': 'wrong token'});

        models.UserFriend.destroy({
            where: {
                [sequelize.Op.or]: [
                    {
                        userId: userId,
                        userFriendId: userFriendId
                    },
                    {
                        userId: userFriendId,
                        userFriendId: userId
                    }
                    ]
            }
        }).then(
            rowDelete => {
                if(rowDelete > 0){

                    return res.status(201).json({'success':rowDelete});
                }else{

                    return  res.status(400).json({'error' : 'userfriend not find'})
                }
            }
        ).catch( error =>{
            console.log(error);
            return res.status(500);
        });
    }
}
