// create_room表示用

import React from 'react';
import { useState, useEffect , useRef} from 'react';
import axios from "axios";

// リダイレクト用
import { useNavigate } from "react-router-dom"

export default function CreateRoom() {

  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");

  // クリック時に部屋作成に必要な情報を送る
  let navigate = useNavigate();
  const  createRoom = () => {

    var data = {
      'roomName':roomName,
      'userName':userName,
    }

    // データベーステーブル作成用POST
    axios.post("http://" + window.location.host + "/api/createroom", data)
    .then(res => {
      // masterへリダイレクト;
      navigate('/master/'+ res.data + '/' + roomName + '/' + userName);
    })
    .catch(error => {
      // 送信失敗時の処理
      console.log(error);
    });

  }

  
  
  return (
    <div className="App-box">
      <p className="title">部屋を作成する</p>
      <form className="form-inline">
            <div className="form-group">
                <label className="roomLabel">部屋名：
                  <input type="text" className="form-control" id="rooms" 
                  value={roomName}
                  onChange={(event) => setRoomName(event.target.value)}
                  />
                </label>
                <label className="nameLabel" >ユーザー名：
                  <input type="text" className="form-control" id="username" 
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                    />
                </label>
            </div>
            <button type="button" className="btn btn-primary" id="sendButton" onClick={createRoom}>入室</button>
        </form>
    </div>
  );

}