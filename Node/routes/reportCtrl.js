var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');
var sequelize = require('sequelize');

// Routes
module.exports = {
    reportFriend: async function (req, res){
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

        let userFriend = await models.Report.findOne({
            attributes: ['userFriendId'],
            where:{
                userId: userId,
                UserFriendId: userFriendId
            }
        })
        if(userFriend != null) {
            return res.status(400).json({'error': 'report already sent'});}
        else {
            models.Report.create({
                UserId: userId,
                UserFriendId: userFriendId
            }).then(result =>{
                return res.status(201).json({
                    'userFriendId': result.userFriendId
                });
            }).catch(() =>{
                return res.status(500).json({'error': 'cannot Report'});
            })
        }
    },
    getReportList: async function (req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({'error': 'wrong token'});

        let listereportedusers = await models.Report.findAll({
            attributes: ['UserFriendId'],
            distinct: true,
            col: 'UserFriendId'
        })

        listereportedusers = listereportedusers.map(
            item => item.UserFriendId
        )

        let reportList = await models.User.findAll({
             attributes: ['id', 'username', 'email', 'banned'],
            where: {
                id: {[sequelize.Op.in]: listereportedusers}
            }
        })

        if (reportList != null) {
            res.status(201).json(reportList);
        } else {
            res.status(404).json({'error': 'no repoerted users'});
        }
    },
}