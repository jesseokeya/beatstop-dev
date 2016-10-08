class CreateMusics < ActiveRecord::Migration[5.0]
  def change
    create_table :musics do |t|
      t.references :artist, foreign_key: true
      t.boolean :for_sale
      t.float :price
      t.integer :listens
      t.integer :downloads
      t.text :description

      t.timestamps
    end
  end
end
