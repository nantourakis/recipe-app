import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

// CONTROLLER

// Global State of app
// search object, current recipe, shopping list & liked recipes
const state = {};

// ** Search Controller **//
const controlSearch = async () => {
  // 1 - get query from view
  const query = searchView.getInput();
  //const query = 'pizza';

  if (query) {
    // 2 - new search object and add to state
    state.search = new Search(query);

    // 3 - prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4 - search for recipes
      await state.search.getResults();

      // 5 - render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert('Someting went wrong with search..');
      clearLoader();
    }
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

//TESTING *****************
/*window.addEventListener('load', e => {
  e.preventDefault();
  controlSearch();
});*/

// e is the target, the event
elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

// ** Recipe Controller **//
const controlRecipe = async () => {
  // get ID from url
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      //get recipe data and parse ingredients
      await state.recipe.getRecipe();
      // console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      //call calc functions
      state.recipe.calcTime();
      state.recipe.calcServings();

      // render recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
        );

    } catch (err) {
        console.log(err);
        alert('Error precessing recipe!');
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// ** List Controller **//

const controlList = () => {
  // create a new list IF there is none
  if (!state.list) state.list = new List();

  // Loop through and Add each ingredient to the List & update UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

// Handle Delete and update list item events (event delegation since the elements arent there when page iniatially loads)
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
      // delete from state
      state.list.deleteItem(id);

      // delete from UI
      listView.deleteItem(id);

      // handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
      const val = parseFloat(e.target.value, 10);
      state.list.updateCount(id, val);
    }
});

// ** Likes Controller **//

const controlLike = () => {
  // if you dont have state.like then state.like becomes....
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add Like to the UI list
    likesView.renderLike(newLike);

  // User HAS liked current recipe
  } else {
     // Remove like from the state
    state.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from the UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();

  // Restore Likes
  state.likes.readStorage();

  // Toggle like button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render current liked recipes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Event Handling recipe button clicks. increading or decreasing servings. closest or matches method
elements.recipe.addEventListener('click', e => {
  //if matches btn-decrease or any chid element of btn-decrease *
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
    state.recipe.updateServings('dec');
    recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // call the like controller
    controlLike();
  }
});
