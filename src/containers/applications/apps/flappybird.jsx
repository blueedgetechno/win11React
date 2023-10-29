import styled from "styled-components";
import { useEffect, useState } from "react";
import { ToolBar } from "../../../utils/general";

const BIRD_HEIGHT = 28;
const BIRD_WIDTH = 33;
const WALL_HEIGHT = 600;
const WALL_WIDTH = 400;
const GRAVITY = 8;
const OBJ_WIDTH = 52;
const OBJ_SPEED = 6;
const OBJ_GAP = 200;
function FlappyBird() {
  const [isStart, setIsStart] = useState(false);
  const [birdpos, setBirspos] = useState(300);
  const [objHeight, setObjHeight] = useState(0);
  const [objPos, setObjPos] = useState(WALL_WIDTH);
  const [score, setScore] = useState(0);
  
  const wnapp = useSelector((state) => state.apps.FlappyBird);
  const hide = useSelector((state) => state.apps.FlappyBird.hide);
  useEffect(() => {
    let intVal;
    if (isStart && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
      intVal = setInterval(() => {
        setBirspos((birdpos) => birdpos + GRAVITY);
      }, 24);
    }
    return () => clearInterval(intVal);
  });

  useEffect(() => {
    let objval;
    if (isStart && objPos >= -OBJ_WIDTH) {
      objval = setInterval(() => {
        setObjPos((objPos) => objPos - OBJ_SPEED);
      }, 24);

      return () => {
        clearInterval(objval);
      };
    } else {
      setObjPos(WALL_WIDTH);
      setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
      if (isStart) setScore((score) => score + 1);
    }
  }, [isStart, objPos]);

  useEffect(() => {
    let topObj = birdpos >= 0 && birdpos < objHeight;
    let bottomObj =
      birdpos <= WALL_HEIGHT &&
      birdpos >=
        WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;

    if (
      objPos >= OBJ_WIDTH &&
      objPos <= OBJ_WIDTH + 80 &&
      (topObj || bottomObj)
    ) {
      setIsStart(false);
      setBirspos(300);
      setScore(0);
    }
  }, [isStart, birdpos, objHeight, objPos]);
  const handler = () => {
    if (!isStart) setIsStart(true);
    else if (birdpos < BIRD_HEIGHT) setBirspos(0);
    else setBirspos((birdpos) => birdpos - 50);
  };
  return (
    <div
    className="flappy-bird floatTab dpShad"
    data-size={wnapp.size}
    id={wnapp.icon + "App"}
    data-max={wnapp.max}
    style={{
      ...(wnapp.size == "cstm" ? wnapp.dim : null),
      zIndex: wnapp.z,
    }}
    data-hide={wnapp.hide}
  >
    <ToolBar
      app={wnapp.action}
      icon={wnapp.icon}
      size={wnapp.size}
      name="flappy-bird"
      invert
      bg="#060606"
    />
     <div className="windowScreen flex flex-col" data-dock="true">
      <Home onClick={handler}>
        <span>Score: {score}</span>
        <Background height={WALL_HEIGHT} width={WALL_WIDTH}>
          {!isStart ? <Startboard>Click To Start</Startboard> : null}
          <Obj
            height={objHeight}
            width={OBJ_WIDTH}
            left={objPos}
            top={0}
            deg={180}
          />
          <Bird
            height={BIRD_HEIGHT}
            width={BIRD_WIDTH}
            top={birdpos}
            left={100}
          />
          <Obj
            height={WALL_HEIGHT - OBJ_GAP - objHeight}
            width={OBJ_WIDTH}
            left={objPos}
            top={
              WALL_HEIGHT - (objHeight + (WALL_HEIGHT - OBJ_GAP - objHeight))
            }
            deg={0}
          />
        </Background>
      </Home>
    </div>
    </div>
  );
}

export default FlappyBird;

const Home = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Background = styled.div`
  background-image: url("../../../../public/img/asset/flappy-images/background-day.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: relative;
  overflow: hidden;
  border: 2px solid black;
`;

const Bird = styled.div`
  position: absolute;
  background-image: url("../../../../public/img/asset/flappy-images/yellowbird-upflap.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

const Obj = styled.div`
  position: relative;
  background-image: url("../../../../public/img/asset/flappy-images/pipe-green.png");
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  transform: rotate(${(props) => props.deg}deg);
`;

const Startboard = styled.div`
  position: relative;
  top: 49%;
  background-color: black;
  padding: 10px;
  width: 100px;
  left: 50%;
  margin-left: -50px;
  text-align: center;
  font-size: 20px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
`;

const ScoreShow = styled.div`
  text-align: center;
  background: transparent;
`;
