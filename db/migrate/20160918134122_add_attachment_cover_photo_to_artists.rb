class AddAttachmentCoverPhotoToArtists < ActiveRecord::Migration
  def self.up
    change_table :artists do |t|
      t.attachment :cover_photo
    end
  end

  def self.down
    remove_attachment :artists, :cover_photo
  end
end
