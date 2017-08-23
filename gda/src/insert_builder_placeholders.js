const Gda = imports.gi.Gda;
const GObject = imports.gi.GObject;
const InsertPlain = imports.insert_plain;

class InsertBuilderPlaceholders extends InsertPlain.InsertPlain {

  operate() {
    let insertBuilder = new Gda.SqlBuilder({
      stmt_type: Gda.SqlStatementType.INSERT
    });
    insertBuilder.set_table('test');
    insertBuilder.add_field_value_id(
      insertBuilder.add_id("name"),
      insertBuilder.add_param("the_name", GObject.TYPE_STRING, false)
    );
    let stmt = insertBuilder.get_statement();
    let [ , params ] = stmt.get_parameters();
    ['Je', 'Pe', 'Jo', 'Mo'].forEach(name => {
      params.get_holder('the_name').set_value(name);
      this._connection.statement_execute_non_select(stmt, params);
    });
  }
}

function getExample() {
  return new InsertBuilderPlaceholders();
}

