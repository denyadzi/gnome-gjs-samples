const Common = imports.common;
const Gda = imports.gi.Gda;
const GObject = imports.gi.GObject;

class SelectWherePlain extends Common.DbOperationExample {

  setUp() {
    super.setUp();
    this._parser = this._connection.create_parser();
    let [ createStmt , ] = this._parser.parse_string(
      `CREATE TABLE test (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL,
        age INTEGER UNSIGNED
      )`
    );
    this._connection.statement_execute_non_select(createStmt, null);
        
    let insertBuilder = new Gda.SqlBuilder({
      stmt_type: Gda.SqlStatementType.INSERT
    });
    insertBuilder.set_table('test');
    insertBuilder.add_field_value_id(
      insertBuilder.add_id("name"),
      insertBuilder.add_param("name_param", GObject.TYPE_STRING, false)
    );
    insertBuilder.add_field_value_id(
      insertBuilder.add_id("age"),
      insertBuilder.add_param("age_param", GObject.TYPE_INT, false)
    );

    let insertStmt = insertBuilder.get_statement();
    let [ , params ] = insertStmt.get_parameters();
    [ ['John', 21 ], ['Mary', 20], ['Paul', 32], ['Jessie', 26]].forEach(person => {
      params.get_holder('name_param').set_value(person[0]);
      params.get_holder('age_param').set_value(person[1]);
      this._connection.statement_execute_non_select(insertStmt, params);
    });
  }

  operate() {
    let [ selectStmt , ] = this._parser.parse_string(
      'SELECT id, name, age FROM test WHERE age > 20'
    );
    let data = this._connection.statement_execute_select(selectStmt, null);
    log(`Rows number : ${ data.get_n_rows() }`);
    log(`Columns number: ${ data.get_n_columns() }`);
    let iter = data.create_iter();
    log(`Current row : ${iter.get_row()}`);
    while (iter.move_next()) {
      log(`
        Current row: ${ iter.get_row() }
        ---
        id: ${ iter.get_value_for_field('id') }
        name: ${ iter.get_value_for_field('name') }
        age: ${ iter.get_value_for_field('age') }
      `);
    }
  }
}

function getExample() {
  return new SelectWherePlain();
}
