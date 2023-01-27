import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div class="home-div">
      <h1>TOPページ</h1>
      <div>
      <Link to={`/create_room/`}>部屋を作成する</Link>
      </div>
      {/* <div>
      <Link to={`/children/`}>部屋に入室する</Link>
      </div> */}
    </div>
  );
};

export default Home;