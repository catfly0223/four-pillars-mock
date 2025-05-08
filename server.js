const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIMEタイプのマッピング
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
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    // URLを解析
    const parsedUrl = url.parse(req.url);
    let pathname = '.' + parsedUrl.pathname;
    
    // ルートアクセスの場合はindex.htmlを返す
    if (pathname === './') {
        pathname = './index.html';
    }
    
    // ファイル拡張子を取得
    const ext = path.parse(pathname).ext;
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // ファイルを読み込む
    fs.readFile(pathname, (err, data) => {
        if (err) {
            // エラーハンドリング
            if (err.code === 'ENOENT') {
                // ファイルが見つからない場合は404を返す
                res.writeHead(404);
                res.end(`ファイルが見つかりません: ${pathname}`);
            } else {
                // その他のエラーは500を返す
                res.writeHead(500);
                res.end(`エラー: ${err.code}`);
            }
            return;
        }
        
        // 成功時はコンテンツを返す
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}/`);
    console.log('ブラウザで上記URLにアクセスしてください');
});