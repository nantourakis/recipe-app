import uniqid from 'uniqid';
//creat API
export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // splice mutates array [2,4,8] splice(1,1) how many you want to take) --> returns 4 and the orginal array is now [2,8]
        // splice mutates array [2,4,8] splice(1,2) how many you want to take) --> returns 4 and the orginal array is now [2,]
        // array [2,4,8] slice(1,1) end index not included) --> returns 4 and the orginal array is now [2,4,8]
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}