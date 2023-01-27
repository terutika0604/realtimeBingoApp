// master childrenで共通のパーツを入れておくファイル


function Square(props) {
  return (
    <td className={props.chooseClass}>{props.value}</td>
  );
}

const Bingo = (props) => {

  const renderSquare = (i) => {
    var chooseClass = '';
    // squaresの中を見てclassを付与
    // 配列のインデックスに合わせるために-1
    if(props.choosings[i - 1] === 1){
      chooseClass = 'choosing';
    }
    if(props.squares[i - 1] === 1){
      chooseClass = 'choosed';
    }
    return (
      <Square
        value={i}
        chooseClass={chooseClass}
      />
      );
  }

  return (
    <div className="Bingo-table">
      <table>
        <tr>
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
          {renderSquare(9)}
          {renderSquare(10)}
        </tr>
        <tr>
          {renderSquare(11)}
          {renderSquare(12)}
          {renderSquare(13)}
          {renderSquare(14)}
          {renderSquare(15)}
          {renderSquare(16)}
          {renderSquare(17)}
          {renderSquare(18)}
          {renderSquare(19)}
          {renderSquare(20)}
        </tr>
        <tr>
          {renderSquare(21)}
          {renderSquare(22)}
          {renderSquare(23)}
          {renderSquare(24)}
          {renderSquare(25)}
          {renderSquare(26)}
          {renderSquare(27)}
          {renderSquare(28)}
          {renderSquare(29)}
          {renderSquare(30)}
        </tr>
        <tr>
          {renderSquare(31)}
          {renderSquare(32)}
          {renderSquare(33)}
          {renderSquare(34)}
          {renderSquare(35)}
          {renderSquare(36)}
          {renderSquare(37)}
          {renderSquare(38)}
          {renderSquare(39)}
          {renderSquare(40)}
        </tr>
        <tr>
          {renderSquare(41)}
          {renderSquare(42)}
          {renderSquare(43)}
          {renderSquare(44)}
          {renderSquare(45)}
          {renderSquare(46)}
          {renderSquare(47)}
          {renderSquare(48)}
          {renderSquare(49)}
          {renderSquare(50)}
        </tr>
        <tr>
          {renderSquare(51)}
          {renderSquare(52)}
          {renderSquare(53)}
          {renderSquare(54)}
          {renderSquare(55)}
          {renderSquare(56)}
          {renderSquare(57)}
          {renderSquare(58)}
          {renderSquare(59)}
          {renderSquare(60)}
        </tr>
        <tr>
          {renderSquare(61)}
          {renderSquare(62)}
          {renderSquare(63)}
          {renderSquare(64)}
          {renderSquare(65)}
          {renderSquare(66)}
          {renderSquare(67)}
          {renderSquare(68)}
          {renderSquare(69)}
          {renderSquare(70)}
        </tr>
        <tr>
          {renderSquare(71)}
          {renderSquare(72)}
          {renderSquare(73)}
          {renderSquare(74)}
          {renderSquare(75)}
        </tr>
      </table>
    </div>
  );

}

export default Bingo;