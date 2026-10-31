import http.server, socketserver, sys, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8100

Handler = http.server.SimpleHTTPRequestHandler
socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('', PORT), Handler) as httpd:
    print(f'Serving on port {PORT}')
    httpd.serve_forever()
