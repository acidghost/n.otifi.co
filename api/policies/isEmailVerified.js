/**
 * Created by acidghost on 19/11/13.
 */


module.exports = function isEmailVerified(req, res, next) {

  User.findOne(req.session.user).done(function(err, user) {
    if(err) {
      res.json({ success: false, message: err }, 500);
    } else {
      if(user.emailVerified) {
        next();
      } else {
        res.json({ success: false, message: 'E-mail address not verified' }, 401);
      }
    }
  });

};