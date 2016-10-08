class Artist < ApplicationRecord
  belongs_to :user
  has_many :musics
   has_attached_file :avatar, styles: { medium: "128x128>", thumb: "40x40!" }, default_url: "#{ActionController::Base.helpers.asset_path('a11.png')}"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/
  validates_attachment :avatar,
  content_type: { content_type: ["image/jpeg", "image/gif", "image/png"] }
  has_attached_file :cover_photo, styles: { medium: "828x315>", smaller: "495x248>" }, default_url: "#{ActionController::Base.helpers.asset_path('a11.png')}"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/
  validates_attachment :cover_photo,
  content_type: { content_type: ["image/jpeg", "image/gif", "image/png"] }
  serialize :followers, Array
  serialize :following, Array
end
