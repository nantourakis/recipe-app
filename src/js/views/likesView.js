// UI for the likes 
import { elements } from './base';
import { limitRecipeTitle } from './searchView';

// toggle the like button
export const toggleLikeBtn = isLiked => {
    // ? if it's liked then it should be icon heart : and if not then it's outlined
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    //grab the href attribute and set it to img.icons.svg#`isLiked`
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    //icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = numLikes => {
    //css adding visibilty or hidden style depending if item is liked
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li> 
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}
