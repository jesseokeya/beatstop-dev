Rails.application.routes.draw do
  match "/music/update_listens/:id"=>'music#update_listens',via: [:get, :post]
  get 'music/my_uploads'
  post 'music/create'
  get 'music/upload_page'

  get 'music/index'

  get 'library/index'

  get 'messages/index'

  get 'purchases/index'

  get 'beatstore/index'

  resources :artists
  get 'listen/index'
  get 'listen'=>'listen#index'
  get 'artist'=>'artists#show'

  match '/sign_up'=> redirect('users/sign_up'), via: :get
  match '/sign_in'=> redirect('users/sign_in'), via: :get
  match '/forgot_password'=> redirect('users/password/new'), via: :get
  devise_for :users
  get '/'=>'landing_page#index'
  get 'support'=> 'support#index'
  get 'player'=> 'web_player#index'
  get 'about'=>'about_us#index'
  get 'support/index'

  get 'web_player/index'

  get 'about_us/index'

  get 'landing_page/index'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
