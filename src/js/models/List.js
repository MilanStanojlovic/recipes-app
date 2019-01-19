import uniqid from 'uniqid';

export default class List{
    constructor(){
        this.items = [];
    }

    addItem(count, unit, ingredient){
        const item = {
            count: uniqid(),
            unit,
            ingredient
        }
    }

    deleteItem(id){
        const index = this.items.findIndex(el => el.id === id);
        //[2,4,8] splice(1,1); -> returns 4 and original array is [2,8];
        //[2,4,8] slice(1,1); -> returns 4, and original is [2,4,8];
        return this.items.splice(index, 1);
    }

    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }
}