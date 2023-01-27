import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div class="home-div">
      <h1>お探しのページは見つかりませんでした。</h1>
      <div>
        <Link to={`/`}>ホームに戻る</Link>
      </div>
    </div>
  );
};

export default NotFound;