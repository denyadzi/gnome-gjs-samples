const SelectWherePlain = imports.select_where_plain;
const Gda = imports.gi.Gda;
const GObject = imports.gi.GObject;

class SelectBuilderWhere extends SelectWherePlain.SelectWherePlain {
  operate() {
    let b = new Gda.SqlBuilder({
      stmt_type: Gda.SqlStatementType.SELECT
    });
    b.select_add_target('test', null);
    b.select_add_field('id', null, null);
    b.select_add_field('name', null, null);
    b.select_add_field('age', null, null);
    b.set_where(
      b.add_cond(Gda.SqlOperatorType.GT, b.add_field_id("age", null), b.add_expr_value(null, "25"), 0)
    );
    let stmt = b.get_statement();
    let data = this._connection.statement_execute_select(stmt, null);
    log(data.dump_as_string());

    b.set_where(
        b.add_cond(Gda.SqlOperatorType.GT, b.add_field_id("age", null), b.add_param("age_param", GObject.TYPE_INT, false), 0)
    );
    stmt = b.get_statement();
    let [ , params ] = stmt.get_parameters();
    params.get_holder("age_param").set_value(20);
    data = this._connection.statement_execute_select(stmt, params);
    log(data.dump_as_string());
    params.get_holder("age_param").set_value(30);
    data = this._connection.statement_execute_select(stmt, params);
    log(data.dump_as_string());

    let and1 = b.add_cond(Gda.SqlOperatorType.GT, b.add_field_id("age", null), b.add_expr_value(null, 20), 0);
    let and2 = b.add_cond(Gda.SqlOperatorType.LT, b.add_field_id("age", null), b.add_expr_value(null, 25), 0);
    b.set_where(
        b.add_cond(Gda.SqlOperatorType.AND, and1, and2, 0)
    );
    stmt = b.get_statement();
    data = this._connection.statement_execute_select(stmt, null);
    log(data.dump_as_string());
  }
}

function getExample() {
  return new SelectBuilderWhere();
}

