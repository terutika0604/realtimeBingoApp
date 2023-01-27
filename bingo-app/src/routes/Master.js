// master表示用

import React from 'react';
import { useState, useEffect , useRef } from 'react';
import Bingo from "./Bingo";
// import axios from "axios";
import socketIOClient from "socket.io-client";
import {  Link, useParams } from 'react-router-dom';
var timerId;


export default function Master() {
  // 抽選された数字
  const [randomNum, setRandomNum] = useState(0);
  // 表示用の数字
  const [displayNum, setDisplayNum] = useState(0);
  // 抽選配列
  const [squares,setSquares ] = useState(Array(75).fill(0));
  // 抽選中配列
  const [choosings, setChoosings] = useState(Array(75).fill(0));
   // ボタン制御用
   const [startBtn, setstartBtn] = useState('btnTrue');
   const [stopBtn, setstopBtn] = useState('btnFalse');

  //  websocket参照用
   const socketRef = useRef();

  //  URLパラメータ取得
  const { roomId } = useParams();
  const { roomName } = useParams();
  const { userName } = useParams();

   useEffect(() => {
     // WebSocketクライアント生成
    //  build前用
    socketRef.current = socketIOClient("http://" + window.location.host);
    // build前用
    // socketRef.current = socketIOClient("http://localhost:3000");

    // ルームidを使ってjoin
    socketRef.current.emit("join", {roomId : roomId,roomName : roomName, userName:userName});

    // データセット
    socketRef.current.on('bingonum', function(msg){
      setSquares(msg);
    });

    // CLEAN UP THE EFFECT
    return () => socketRef.current.disconnect();
}, []);


  const  randomChoose = () => {

    // スタートボタン無効化&ストップボタン有効化
    setstartBtn('btnFalse');
    setstopBtn('btnTrue');

    timerId = setInterval(() => {

      const ran = Math.floor(Math.random() * 75) + 1

      // 表示用の数字を変化させる
      setDisplayNum(ran);

      // 抽選中配列更新用の配列をリセット
      const tmp_choosings = Array(75).fill(0);
      // 抽選中配列更新用の配列にランダムに値をセット
      tmp_choosings[ran - 1] = 1;
      // 抽選中配列更新
      setChoosings(tmp_choosings);

    }, 200);

    // 抽選
    var tmp = Choose();

    // 抽選済みの場合は再度抽選
    while(squares[tmp - 1] === 1){
      console.log('再抽選');
      tmp = Choose();
    }

    // 抽選された数字として正式にステートへセット
    setRandomNum(tmp);
  }

  // 抽選関数
  function Choose() {
    var tmp = Math.floor(Math.random() * 75) + 1;
    console.log(tmp);

    return tmp;
  }


  // 抽選終了
  const randomChooseStop = () => {
    // 表示用の数字を変化を止める
    clearInterval(timerId);

    // ストップボタン無効化&スタートボタン有効化
    setstartBtn('btnTrue');
    setstopBtn('btnFalse');

    // 表示用の数字を配列変更用の数字と合わせる
    setDisplayNum(randomNum);
    // 抽選中配列をリセット
    setChoosings(Array(75).fill(0));
    
     // 配列更新
    // 更新前のsquaresを入れ、抽選状態をセットする
    let tmp_squares = squares;
    tmp_squares[randomNum - 1] = 1;
    // squaresへ反映する→実際に更新されるのはレンダリング後（関数が終わった後）
    setSquares(tmp_squares);

    // POSTの代わりにwebsocketにsquaresデータ流す.部屋情報と一緒に
      socketRef.current.emit('bingonum', {roomId : roomId,roomName : roomName, userName:userName, squares:tmp_squares});
  }

  // リセット
  const resetSquares = () => {

    if(window.confirm('リセットしますか？')){
      const reset_squares = Array(75).fill(0);
      setSquares(reset_squares);
      setDisplayNum(0);

      // POSTの代わりにwebsocketにsquaresデータ流す.部屋情報と一緒に
      socketRef.current.emit('bingonum', {roomId:roomId,roomName : roomName, userName:userName, squares:reset_squares});
    }

  }
  


  return (
    <div className="App-box">
      <p className="title">ビンゴ抽選機(Master)</p>
      <p className="number">{displayNum}</p>
      <div className="btn-box">
        <button  className={'btn-start ' + startBtn}
          onClick={randomChoose}>
            Start</button>
        <button className={'btn-stop ' + stopBtn}
        onClick={randomChooseStop}>
          Stop</button>
        <button className="btn-reset"
        onClick={resetSquares}>
          Reset</button>
      </div>
      <Bingo 
        squares={squares} 
        choosings={choosings} 
      />
      <p>childrenリンクは<Link to={`/children/` + roomId + '/' + roomName + '/' + userName } target="_blank">こちら</Link></p>
    </div>
  );

}



