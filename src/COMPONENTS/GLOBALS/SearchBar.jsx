import React from "react";
import DynamicBar from "../SEARCH BAR/DynamicBar";
import StaticBar from "../SEARCH BAR/StaticBar";

export default function SearchBar(props) {
  const [clicked, setClicked] = React.useState(false);
  const [word, setWord] = React.useState("");
  const [rooms, setRooms] = React.useState([{}]);

  const handleSearchWord = ({ value }) => {
    setWord(value);
  };

  const activeSearchBar = () => {
    setClicked((prev) => !prev);
  };

  const displayRooms = React.useCallback(() => {
    setRooms(
      props.allRooms.map((room) =>
        room.room_name.includes(word)
          ? {
              roomName: room.room_name,
              roomCode: room.room_code,
              roomId: room.room_id,
              roomType: room.room_type,
            }
          : null
      )
    );
  }, [props.allRooms, word]);

  React.useEffect(() => {
    displayRooms();
  }, [displayRooms]);

  return (
    <div className="w-full cstm-flex">
      {clicked ? (
        <DynamicBar
          word={word}
          handleSearchWord={handleSearchWord}
          activeSearchBar={activeSearchBar}
          rooms={rooms}
        />
      ) : (
        <StaticBar activeSearchBar={activeSearchBar} />
      )}
    </div>
  );
}
