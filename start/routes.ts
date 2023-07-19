/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/users/sign-up', 'UsersController.signup')
  Route.post('/users/login', 'UsersController.login')
  Route.post('/not-logged-dashboard', 'RecipesController.paginatedNotLoggedIndex')
  Route.group(() => {
    Route.post('/users/logout', 'UsersController.logout')
    Route.resource('/recipes', 'RecipesController').apiOnly()
    Route.post('/paginate', 'RecipesController.paginatedIndex')
    Route.post('/user-recipes', 'RecipesController.showUsersOnly')
    Route.post('/user-favorite-recipes', 'RecipesController.showUsersFavoriteRecipes')

    Route.post('/like/:id', 'InteractionsController.like')
    Route.post('/favorite/:id', 'InteractionsController.favorite')

    Route.resource('/comment/:recipeId', 'CommentsController').apiOnly()
  }).middleware('auth')
}).prefix('/api')
