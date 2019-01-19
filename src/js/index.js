import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * -Search object
 * -Current recepie object
 * -Shopping list object
 * -Liked recipes
 */
const state = {};
window.state = state;
// SEARCH CONTROLLER
const controlSearch = async () => {
    //1. Get the query from the view
    const query = searchView.getInput();
    console.log(query);

    if(query){
        //2. New Search object and add to state
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try{
            //4. Search for recipes
            await state.search.getResults();
    
            //5. Render Results on UI
            // console.log(state.search.result);
            //-Removing the loader
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(error){
            alert('Something went wrong with the searc...');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

//function that goes to page when clicked on the button
elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        //reading HTML dataset value 
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});

// RECIPE CONTROLLER
const controlRecipe = async () => {
    //get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id){
        //1. Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if(state.search){
            searchView.highlightSelected(id);
        }

        //2. Create new recipe object
        state.recipe = new Recipe(id);

        try{
            //3. Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
            
            //4. Calculate servings and time
            state.recipe.calculateServings();
            state.recipe.calculateTime();
    
            //5. Render recipe
            // console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        }catch (error){
            alert('Error processing recipe.');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

//Array that loops over strings(event types) and calls eventListener
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// LIST CONTROLLER
const controlList = () => {
    //1.Create  a new list IF there is none 
    if(!state.list) state.list = new List();

    //2. Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

//Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    //handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //Delete from state
        state.list.deleteItem(id);
        //Delete from UI
        listView.deleteItem(id);

        //Handle count update
    }else if (e.target.matches('.shopping__count-value')){
        //read data
        const val = parseFloat(e.target.value, 10);
        console.log(val);
        //update list count
        state.list.updateCount(id, val);
    }
});

//Handling recipe button clicks
elements.recipe.addEventListener('click', e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease * ')){
        //Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase * ')){
        //Increase button is clickded
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn * ')){
        controlList();
    }

    // console.log(state.recipe);
});


window.l = new List();