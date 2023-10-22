import React, {useState, useEffect} from 'react';
import { createBoard, getBoards } from '../http/boardAPI';
import { Spinner } from 'react-bootstrap';
import Board from '../components/Board';

function HomePage() {

const [boards, setBoards] = useState([]);
const [newBoard, setNewBoard] = useState();
const [isLoader, setLoader] = useState(true);


useEffect(() => {
    getBoardsList();
}, [])

const getBoardsList = async () => {
    setLoader(true);
    setBoards(await getBoards());
    setLoader(false);
}


const createBoardHandler = async () => {
    if(newBoard) {
        setLoader(true);
        const response = await createBoard(newBoard);
        console.log('response=', response);
        const board = {
            id: response.id,
            name: response.name,
        };

        setBoards([...boards, board]);
        setNewBoard('');
        getBoardsList();
        setLoader(false);
    }
}



  return (
    <div>
        <h1>Boards</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter board name"
                    value={newBoard}
                    onChange={(e) => setNewBoard(e.target.value)}
                    className="mt-3 me-3"
                />
                <button onClick={createBoardHandler} variant="success">
                    Create Board
                </button>
                { 
                    isLoader 
                    ? 
                    <tr><td colSpan={7}>
                        <div className="text-center">
                        <Spinner className='m-5' animation="border" variant="secondary" />
                        </div>
                    </td></tr>
                    :
                    boards && boards.map((b) => <Board key={b.id} 
                                                       id={b.id} 
                                                       name={b.name}
                                                       getBoardsList={getBoardsList}
                                                />)
                    }
            </div>
    </div>
  );
}

export default HomePage;
