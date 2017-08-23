const Soup = imports.gi.Soup;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;
const Gio  = imports.gi.Gio;

const DOC_ROOT = GLib.get_current_dir();

let server = new Soup.Server();

server.add_handler('/', function(server, msg, path, query, client) {
  let file = Gio.File.new_for_path(DOC_ROOT+path);
  let stream;
  try {
    stream = new Gio.DataInputStream({ base_stream: file.read(null) });
  }
  catch (e) {
    log(e.message);
    return;
  }

  let buffer = '';

  msg.response_headers.set_encoding(Soup.Encoding.CHUNKED);
  msg.response_headers.set_content_type('text/html', null);

  msg.connect('wrote-chunk', function(msg) {
    buffer = stream.read_line(null);
    if (buffer.length) {
      msg.response_body.append(buffer);
    }
    else {
      msg.response_body.complete();
    }
    server.unpause_message(msg);
  });
  msg.connect('finished', function(msg) {
    log('Finish');
  });

  buffer = stream.read_line(null);
  if (buffer.length) {
    msg.response_body.append(buffer);
  }
  else {
    msg.response_body.complete();
  }
  server.unpause_message(msg);
});

server.listen_local(8000, Soup.ServerListenOptions.IPV4_ONLY);

Mainloop.run('server');
