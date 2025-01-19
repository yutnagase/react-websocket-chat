import { useState, ChangeEvent } from "react";

interface OperationProps {
  entered: boolean;
  onEnter: (name: string) => void;
  onLeave: () => void;
}

export default function Operation(props: OperationProps) {
  const [name, setName] = useState<string>("");

  // 名前入力変更イベントハンドラ
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // 入室ボタンクリックイベントハンドラ
  const handleEnterClick = () => {
    props.onEnter(name);
  };

  /**
   * 入退室ボタンレンダリング
   * @returns
   */
  const renderButton = () => {
    if (props.entered) {
      return <button onClick={props.onLeave}>Leave</button>;
    }
    return (
      <button disabled={!name} onClick={handleEnterClick}>
        Join
      </button>
    );
  };

  return (
    <div className="input">
      {/* 名前入力テキスト */}
      <input
        type="text"
        placeholder="Enter your name..."
        value={name}
        disabled={props.entered}
        onChange={handleInputChange}
      />

      {renderButton()}
    </div>
  );
}
