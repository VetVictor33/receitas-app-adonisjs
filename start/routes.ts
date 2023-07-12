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

Route.group(()=> {
  Route.post('/users/sign-up', 'UsersController.signup')
  Route.post('/users/login', 'UsersController.login')
  Route.group(() => {
    Route.resource('/recipes', 'RecipesController').apiOnly()
    Route.get('/user-recipes', 'RecipesController.showUsersOnly')
  }).middleware('auth')
}).prefix('/api')
