import http.server, socketserver, sys, os

web_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(web_dir)
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8100

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('', PORT), NoCacheHTTPRequestHandler) as httpd:
    print(f'Serving on port {PORT}')
    httpd.serve_forever()
