class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  def after_sign_in_path_for(resource)
    if resource.artist.nil? 
    	'/artists/new'
    else
    	"/artists/#{resource.artist.id}"
    end
  end
  def after_sign_up_path_for(resource)
    	'/artists/new'
  end
end
