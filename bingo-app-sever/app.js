// expressモジュールをロードし、インスタンス化してappに代入。
var express = require("express");
var app = express();
const path = require("path");
var cors = require('cors');
const socketIo = require("socket.io");
const mysql = require('mysql');

// postを使う用
//body-parserモジュールを読み込み初期化する
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
//HTTPリクエストのボディをjsonで扱えるようになる
app.use(bodyParser.json());




// cros使用
app.use(cors());

// ファイル更新用
// const fs = require('fs');

// WebSocketのサーバの生成
const server = require('http').createServer(app);
var io = socketIo(server, {
  // cors対策（socket.io）→build前用
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// listen()メソッドを実行して3000番ポートで待ち受け
// コンソールにポート表示しておく
server.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

// MySql
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'terutika0604',
  database: 'bingoapp_db'
});

con.connect(function(err) {
  if (err) throw err;
  console.log('mysql-Connected');

  // 作り直し用

  // const sql = 'CREATE TABLE rooms (room_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, room_name VARCHAR(255) NOT NULL, user_name VARCHAR(255) NOT NULL)';
	// con.query(sql, function (err, result) {  
	// if (err) throw err;  
	// console.log('table created');  
	// });
  //   const sql2 = 'CREATE TABLE detail (detail_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, room_id INT NOT NULL, number INT NOT NULL, is_done tinyint(1) NOT NULL, FOREIGN KEY (room_id) REFERENCES rooms (room_id) ON DELETE RESTRICT ON UPDATE RESTRICT)';
  //   con.query(sql2, function (err, result) {  
  //     if (err) throw err;  
  //     console.log('table created');  
  //     });

});

// POSTリクエストに応じて部屋を作る
app.post('/api/createroom', (request, response) => {
	const sql = "INSERT INTO rooms(room_name,user_name) VALUES(?,?)";

  // roomsテーブルへインサート
  con.query(sql,[request.body.roomName,request.body.userName],function(err, result, fields){
    if (err)  throw err;
    // 上でインサートしたroom_id(主キー)＝result.insertId
    // room_idに対して0~74の状態格納用データ準備(detailテーブルにインサート)
    for(let i = 0; i < 75; i++ ){
      con.query("INSERT INTO detail(room_id,number) VALUES(" + result.insertId + "," + i + ")",function(err, result, fields){
        if (err) throw err;
      });
    }

    // createRoomにroomoId（主キー）を送る
    // 数字送るとエラーなる→文字列変換
    response.send(String(result.insertId));
  });

});

// WebSocket
io.on('connection', function(socket){
  // 接続直後に呼ばれる
  console.log('websocket-connected');
  
  // "join"でアクセスしてきたら部屋割り
  socket.on('join', function(msg){
    var joinKey = msg.roomId + msg.roomName + msg.userName;
    socket.join(joinKey);

    // データベースの情報を格納
    var databaseData = Array(75).fill(1);
    var sql = "SELECT * FROM detail WHERE ( room_id = " + msg.roomId + ");";

    // チェーン開始用の最初のプロミス
    var p = new Promise(function(res) { res(); });
    for(var i = 0; i < 75; i++) {
      // 変数は同じやつに代入する
      p = p.then(makePromiseFunc());
    }
    p.then(function() {
      // makePromiseFuncが終わってからクライアント側に送信
      io.to(joinKey).emit('bingonum', databaseData);
      // console.log(databaseData);
    });

    // then()に渡す関数を返す関数
    function makePromiseFunc() {
      return function() {
        return new Promise(function(res, rej) {
          con.query(sql,function(err, result, fields){
            if (err)  throw err;
      
            // データベースのroomIdが一致するテーブルをSELECTし、is_doneの値を配列に格納していく
            for(var i = 0; i < 75; i++){
              databaseData[i] = result[i].is_done;
              // console.log(databaseData[i]);
            }
            res();
          });
        });
      };
    }
  
  });
  

  // データ受信後
  socket.on('bingonum', function(msg){
    var joinKey = msg.roomId + msg.roomName + msg.userName;
    // データをすべてのクライアントに送信
    io.to(joinKey).emit('bingonum', msg.squares);

    try {
      // データベースへと反映
      var data = msg.squares;
      // ループ回数＝配列要素番号
      var i = 0;
      data.forEach(value => {
        var sql = "UPDATE detail SET is_done = " + value + " WHERE ( room_id = " + msg.roomId +" AND number = " + i + ");";
        // リセット用
        // var sql = "UPDATE detail SET is_done = 0;";
        con.query(sql,function(err, result, fields){
          if (err)  throw err;
        });
        i++;
      });
      console.log('Update');

      } catch (error) {
        console.error(error)
      }
    });

});


//ミドルウエアでstaticパスを追加（ただ、これだけだと直アクセスや無いpathだと動かない）
app.use(express.static(path.join(__dirname, "build")));


//これを追加（全てをindex.htmlにリダイレクト。いわゆるrewrite設定）
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

