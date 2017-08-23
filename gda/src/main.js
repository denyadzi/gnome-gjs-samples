const Examples = [
  'insert_plain',
  'insert_placeholders',
  'insert_builder',
  'insert_builder_placeholders',
  'select_where_plain',
];

function main(args) {
  for (let i in Examples) {
    let example = imports[Examples[i]].getExample();
    example.setUp();
    example.operate();
    example.tearDown();
  }
}
