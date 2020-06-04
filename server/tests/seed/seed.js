const {Application} = require('./../../models/application');

const exampleApps = [{
    fullName: 'David A',
    dob: '01-01-2000',
    profession: 'student'
  }, {
    fullName: 'Hellen B',
    dob: '01-01-2004',
    profession: null
}];

const clearApps = (done) => {
    Application.remove({}).then(() => done());
  };

module.exports = {exampleApps, clearApps};