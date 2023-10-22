import {$host} from './index';

export const createBoard = async (name) => {
    try {
        const { data } = await $host.post("/api/board", {name});
        return data;
    } catch (e) {
        console.log('Error: ', e);
    }
}


export const getBoards = async () => {
    try {
        const { data } = await $host.get("/api/boards");
        return data;
    } catch (e) {
        console.log('Error: ', e);
    }
};


export const deleteBoard = async (id) => {
    const { data } = await $host.delete("/api/board", {
        data: {
            id: id,
        },});
    return data;
};