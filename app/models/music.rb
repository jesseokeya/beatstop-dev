class Music < ApplicationRecord
  belongs_to :artist
  has_attached_file :beat
  validates_attachment_content_type :beat, content_type: [ 'audio/mp3','audio/mpeg']
  has_attached_file :cover_art, styles: { medium: "128x128>", thumb: "40x40!" }, default_url: "#{ActionController::Base.helpers.asset_path('a11.png')}"
  validates_attachment_content_type :cover_art, content_type: /\Aimage\/.*\z/
  validates_attachment :cover_art,
  content_type: { content_type: ["image/jpeg", "image/gif", "image/png"] }

end
