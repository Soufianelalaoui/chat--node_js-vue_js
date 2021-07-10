var express = require('express');
var userCtrl = require('./routes/usersCtrl');
var userFriendCtrl = require('./routes/userFriendCtrl');
var userReportControl = require('./routes/reportCtrl');


exports.router = (function (){
    var apiRouter = express.Router();
    // Users routes
    apiRouter.route('/register/').post(userCtrl.register);
    apiRouter.route('/login/').post(userCtrl.login);
    apiRouter.route('/users/me/').get(userCtrl.getUserProfile);
    apiRouter.route('/users/find/').post(userCtrl.findUsersByName);
    apiRouter.route('/users/findById/').post(userCtrl.findUsersById);
    apiRouter.route('/users/me/').put(userCtrl.updateUserProfile);
    apiRouter.route('/users/banUsersById/').put(userCtrl.banUsersById);

    //UsersFriend routes
    apiRouter.route('/userFriend/addFriend/').post(userFriendCtrl.addFriend);
    apiRouter.route('/userFriend/requestList/').get(userFriendCtrl.getFriendRequestList);
    apiRouter.route('/userFriend/accept/').put(userFriendCtrl.acceptRequest);
    apiRouter.route('/userFriend/decline/').put(userFriendCtrl.declineRequest);
    apiRouter.route('/userFriend/friendlist/').get(userFriendCtrl.listFriend);
    apiRouter.route('/userFriend/:id').delete(userFriendCtrl.deleteUserFriend);

    //Report routes
    apiRouter.route('/report/reportFriend/').post(userReportControl.reportFriend);
    apiRouter.route('/report/getReportList/').get(userReportControl.getReportList);

    return apiRouter;
})();
