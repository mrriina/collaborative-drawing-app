import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Card } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import trash from '@iconify-icons/fa-solid/trash';
import { deleteBoard } from '../http/boardAPI';

const Board = (board) => {
    const navigate = useNavigate();

    const joinBoardHandler = async () => {
        navigate(`/board?boardId=${board.id}`);
    };

    const deleteBoardHandler = async () => {
        const response = await deleteBoard(board.id);
        board.getBoardsList();
    };


    return (
        <>
        <div className="col">
            <Card id={`card-${board.id}`} style={{ width: '18rem' }} className='indent'>
                <Card.Body>
                    <div className="card-header text-uppercase">{board.name}</div>
                    <div className="d-flex justify-content-end">
                        <Button variant="light" className="ml-auto" onClick={() => joinBoardHandler()}>
                            Join
                        </Button>
                        <Button variant="light" className="ml-auto" onClick={(e)=> {deleteBoardHandler()}}>
                            <Icon icon={trash} />
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
        </>
    );
};

export default Board;