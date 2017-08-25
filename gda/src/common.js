const Gda = imports.gi.Gda;
const GLib = imports.gi.GLib;
const Lang = imports.lang;

let dbfile = GLib.build_filenamev([pkg.pkgdatadir, 'test.db']);

function cleanUp() {
  if (GLib.file_test(dbfile, GLib.FileTest.EXISTS)) {
    GLib.unlink(dbfile);
  }
}

function initDbConnection() {
  cleanUp();
  let conn = Gda.Connection.open_from_string(
    'SQLite', 
    `DB_DIR=${pkg.pkgdatadir};DB_NAME=test`, 
    '', 
    Gda.ConnectionOptions.NONE
  );
  return conn;
}

var DbOperationExample = class {
  setUp() {
    this._connection = initDbConnection();
  }
  operate() {
    throw new Error('The example should implement operate() method');
  }
  tearDown() {
    cleanUp();
  }
}

