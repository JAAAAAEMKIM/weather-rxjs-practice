'use client';

import { useEffect, useMemo, useState } from 'react';

// child state change does not trigger parent re-render.
// childNode -> element 객체는 그대로. state 변화만 마킹 후 처리됨.
// react reconcilation에서 update가 일어날 때는 current Tree의 Node들을 복사만 해서 사용하기도 함. (변화가 없는 경우)

const PlaygroundClient = () => {
  return (
    <div>
      Play
      <FiberTest />
    </div>
  );
};

export default PlaygroundClient;

const FiberTest = () => {
  return <List />;
};

const List = () => {
  const [state, setState] = useState([1, 2, 3]);

  const onClick = () => setState((p) => p.map((i) => i * i));

  return (
    <div>
      <button onClick={onClick}>^2</button>
      <Item i={state[0]} />
      <Item i={state[1]} />
      <Item i={state[2]} />
    </div>
  );
};

const Item = ({ i }) => {
  return <span>{i}</span>;
};

const Parent = () => {
  return <div></div>;
};

const WithChild = ({ children }: React.PropsWithChildren<unknown>) => {
  return <div>WithChild: {children}</div>;
};

const Child1 = () => {
  return <div>Child</div>;
};
const Child2 = () => {
  return <span>Child2</span>;
  2;
};

const StatefulChild = () => {
  const [state, setState] = useState();

  return (
    <div>
      {state ? <Child1 /> : <Child2 />}
      <button onClick={() => setState((p) => !p)}>상태변화 버튼</button>
    </div>
  );
};

const Tree = () => {
  const child = <StatefulChild />;

  return <WithChild>{child}</WithChild>;
};
