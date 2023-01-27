// children表示用

import React from 'react';
import { useState, useEffect, useRef } from 'react'
import Bingo from "./Bingo";
// import axios from "axios";
import socketIOClient from "socket.io-client";
import {  useParams } from 'react-router-dom';


export default function Children() {
  // 抽選配列
  const [squares,setSquares ] = useState(Array(75).fill(0));
  // 抽選中配列→childrenでは使用しないがエラー対策
  const [choosings, setChoosings] = useState(Array(75).fill(0));
  
  //  websocket参照用
  const socketRef = useRef();

    //  URLパラメータ取得
  const { roomId } = useParams();
  const { roomName } = useParams();
  const { userName } = useParams();

    useEffect(() => {
      // WebSocketクライアント生成
      // build後用
      socketRef.current = socketIOClient("http://" + window.location.host);
      // build前用 
      // socketRef.current = socketIOClient("http://localhost:3000");

      // ルームidを使ってjoin
      socketRef.current.emit("join", {roomId : roomId, roomName : roomName, userName:userName});

      // データセット
      socketRef.current.on('bingonum', function(msg){
        setSquares(msg);
      });

      // CLEAN UP THE EFFECT
      return () => socketRef.current.disconnect();

  }, []);
  
  return (
    <div className="App-box">
      <p className="title">ビンゴ抽選機(Children)</p>
      <Bingo 
        squares={squares} 
        choosings={choosings} 
      />
    </div>
  );

}



