class MusicController < ApplicationController
	  skip_before_filter :verify_authenticity_token, only: [:create]
	layout "frontend"
  def index
  end
  def create
    @music = Music.new(music_params)

    respond_to do |format|
      if @music.save
        format.html { redirect_to '/music/index', notice: 'music was successfully created.' }
        format.json { render :show, status: :created, location: @music }
      else
        format.html { render '/music/upload_page' }
        format.json { render json: @music.errors, status: :unprocessable_entity }
      end
    end
  end
  def upload_page
  	@music=Music.new
  end

  def music_params
      params.require(:music).permit(:name,:for_sale,:artist_id,:price,:description, :cover_art, :beat)
  end
  def my_uploads
  	@music=current_user.artist.musics
  end
  def update_listens
    beat=Music.find(params[:id])
    beat.update(listens: (beat.listens||0)+1)
  	respond_to do |format|
  		format.js{render status: 200}
  	end
  end

end
