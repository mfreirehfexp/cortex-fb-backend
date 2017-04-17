
/**
 * Example:
 * const Login = require('./lib/login');
 *  const login = new Login({
 *   usersPath: 'quiver-functions/users',
 *   adminUsers: ['chris@chrisesplin.com']
 * });
 *  exports.login = functions.database.ref('quiver-functions/queues/current-user/{uid}').onWrite(login.callbackFunction());
 */
export class Login{
  usersPath: any;
  adminUsers: any;
  deleteThis: any;

  constructor(config) {
    if (!config.usersPath) {
      throw 'config.usersPath string missing. Looks like "/users"';
    }
    if (!config.adminUsers) {
      throw 'config.adminUsers array missing. Looks like ["chris@chrisesplin.com", "anotherAdmin@chrisesplin.com"]';
    }
    this.usersPath = config.usersPath;
    this.adminUsers = config.adminUsers;
    this.deleteThis = "Hola Mundo";
  }



  getFunction() {
    return event => {
      const user = event.data.val();
      //noinspection TypeScriptUnresolvedFunction
      const userRef = event.data.adminRef.root.child(this.usersPath).child(event.params.uid);

      if (!user) return Promise.resolve();

      user.lastLogin = Date.now();

      if (this.adminUsers.includes(user.email)) {
        user.isAdmin = true;
      }

      return userRef.update(user).then(() => {
        return event.data.ref.remove();
      });
    };
  }
}