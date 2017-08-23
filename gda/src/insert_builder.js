const InsertPlain = imports.insert_plain;
const Gda = imports.gi.Gda;
const GLib = imports.gi.GLib;

class InsertBuilder extends InsertPlain.InsertPlain {

  setUp() {
    super.setUp();
    this.insertBuilder = new Gda.SqlBuilder({ stmt_type: Gda.SqlStatementType.INSERT });
  }

  operate() {
    let b = this.insertBuilder;
    b.set_table('test');
    b.add_field_value_as_gvalue("name", "John");
    let stmt = b.get_statement();
    this._connection.statement_execute_non_select(stmt, null);
  }
}

function getExample() {
  return new InsertBuilder();
}
