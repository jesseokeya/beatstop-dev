class AddAttachmentBeatToMusics < ActiveRecord::Migration
  def self.up
    change_table :musics do |t|
      t.attachment :beat
    end
  end

  def self.down
    remove_attachment :musics, :beat
  end
end
