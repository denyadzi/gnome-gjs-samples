const Common = imports.common;
const Gda = imports.gi.Gda;

class _InsertPlain extends Common.DbOperationExample {

  setUp() {
    super.setUp();
    this._parser = this._connection.create_parser();
    let [stmt , ] = this._parser.parse_string(
      'CREATE TABLE `test` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(20) DEFAULT NULL)'
    );
    this._connection.statement_execute_non_select(stmt, null);
  }
  
  operate() {
    let [stmt , ] = this._parser.parse_string(
      'INSERT INTO `test` (name) VALUES ("Jojo")'
    );
    for (let i in [...Array(10).keys()]) {
      this._connection.statement_execute_non_select(stmt, null);
    }
  }

  tearDown() {
    let [stmt , ] = this._parser.parse_string(
      'SELECT id, name FROM `test`'
    );
    let dataModel = this._connection.statement_execute_select(stmt, null);
    let dump = dataModel.dump_as_string();
    log(dump);
    super.tearDown();
  }
}

var InsertPlain = _InsertPlain;

function getExample() {
  return new _InsertPlain();
}
