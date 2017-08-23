const Soup = imports.gi.Soup;
const GLib = imports.gi.GLib;
const Gio  = imports.gi.Gio;
const Template = imports.gi.Template;

let server = new Soup.Server();

function render_template(name, scope) {
  let file = Gio.File.new_for_path(name);

  let templ = new Template.Template();
  templ.parse_file(file, null);
  let expanded = templ.expand_string(scope);
  return expanded;
}


server.add_handler('/', function(server, msg, path, query, client) {
  let scope = Template.Scope.new();
  let title = scope.get('title');
  title.assign_string('This is a test. І крыху кірылічнага пісьма');
  let response = render_template('index.html', scope);

  msg.set_response('text/html', Soup.MemoryUse.COPY, response);
});

server.add_handler('/chunked', function(server, msg, path, query, client) {
  let scope = Template.Scope.new();
  scope.get('title').assign_string('Passing this in chunkes');
  let response = render_template('index.html', scope);
  let currentChar = 0;
  msg.connect('finished', function(msg) {
    log('finished');
  });
  msg.connect('wrote-chunk', function(msg) {
    currentChar++;
    if (currentChar == response.length) {
      msg.response_body.complete();
      return;
    }
    msg.response_body.append(response[currentChar]);
    server.unpause_message(msg);
    log('wrote char');
  });
  msg.response_headers.set_encoding(Soup.Encoding.CHUNKED);
  msg.response_body.append(response[currentChar]);
  server.unpause_message(msg);
});

server.listen_local(8000, Soup.ServerListenOptions.IPV4_ONLY);

let main = new GLib.MainLoop(null, false);
main.run();
