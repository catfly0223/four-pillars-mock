/**
 * 四柱推命アプリのためのシンプルHTTPサーバー
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf'
};

const server = http.createServer((req, res) => {
    // URLを解析
    const parsedUrl = url.parse(req.url);
    let pathname = `.${parsedUrl.pathname}`;
    
    // インデックスファイルのデフォルト設定
    if (pathname === './') {
        pathname = './public/index.html';
    }
    
    // ファイルパスを取得
    const ext = path.parse(pathname).ext;
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // ファイルを読み込む
    fs.readFile(pathname, (err, data) => {
        if (err) {
            // エラーハンドリング
            if (err.code === 'ENOENT') {
                // ファイルが見つからない場合は404を返す
                fs.readFile('./public/index.html', (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error loading index.html');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                });
            } else {
                // その他のエラーは500を返す
                res.writeHead(500);
                res.end(`Error: ${err.code}`);
            }
            return;
        }
        
        // 成功時はコンテンツを返す
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('四柱推命アプリを起動しました。ブラウザで上記URLにアクセスしてください。');
}); 