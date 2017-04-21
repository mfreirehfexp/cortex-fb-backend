/**
 * Created by martin.freire on 15/4/2017.
 */
// import jasmine from '../../node_modules/jasmine/lib/jasmine.js';
// let jasmine = require('jasmine');
import {Login} from './login.class';


describe("A suite is just a getFunction", function() {
  let a;
  let login;

  beforeAll(()=>{
    login = new Login({
      usersPath: '/',
      adminUsers: []
    });
  })

  it("and so is a spec", function() {
    a = true;

    expect(a).toBe(true);
    expect(login).toEqual(new Login({
      usersPath: '/',
      adminUsers: []
    }));
  });
});
