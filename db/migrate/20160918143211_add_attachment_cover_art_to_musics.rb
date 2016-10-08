class AddAttachmentCoverArtToMusics < ActiveRecord::Migration
  def self.up
    change_table :musics do |t|
      t.attachment :cover_art
    end
  end

  def self.down
    remove_attachment :musics, :cover_art
  end
end
