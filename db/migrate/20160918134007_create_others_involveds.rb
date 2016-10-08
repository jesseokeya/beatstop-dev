class CreateOthersInvolveds < ActiveRecord::Migration[5.0]
  def change
    create_table :others_involveds do |t|
      t.references :music, foreign_key: true
      t.string :first_name
      t.string :last_name
      t.integer :artist_id
      t.boolean :feature

      t.timestamps
    end
  end
end
