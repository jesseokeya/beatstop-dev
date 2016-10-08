class AddNameToMusic < ActiveRecord::Migration[5.0]
  def change
    add_column :musics, :name, :string
  end
end
