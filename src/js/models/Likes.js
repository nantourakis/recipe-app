export default class Likes {
    constructor() {
        // store in an empty array
        this.likes = [];
    }
    //pass through the addLike function containing id, title, author and img
    addLike(id, title, author, img) {
        // create oject to contain these elements
        const like = { id, title, author, img };
        //push into likes array
        this.likes.push(like);

         // PersistSave the data in localStorage
         this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persist/Save the data in localStorage
        this.persistData();
    }

    isLiked(id) {
        // if index is -1 then this means the like is not there
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        // use JSON.stringify to convert this.likes array into a string since local storage only accepts strings
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        // convert string back ito objects
        const storage = JSON.parse(localStorage.getItem('likes'));

        // restoring Likes from the localstorage back into the likes object
        if (storage) this.likes = storage;
    }
 }