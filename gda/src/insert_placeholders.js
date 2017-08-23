const Lang = imports.lang;
const Gda = imports.gi.Gda;
const InsertPlain = imports.insert_plain;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;

const InsertPlaceholders = new Lang.Class({
  Name: 'InsertPlaceholders',
  Extends: InsertPlain.InsertPlain,

  operate() {
    let [ stmt , ] = this._parser.parse_string(
      'INSERT INTO `test` (name) VALUES (##the_name::string)'
    );
    let [ , params ] = stmt.get_parameters();
    let nameHolder = params.get_holder('the_name');
    ['John', 'Mary', 'Paul', 'Jessie'].forEach((name) => {
      nameHolder.set_value(name);
      this._connection.statement_execute_non_select(stmt, params);
    });
  }
});

function getExample() {
  return new InsertPlaceholders();
}
