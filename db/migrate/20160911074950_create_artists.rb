class CreateArtists < ActiveRecord::Migration[5.0]
  def change
    create_table :artists do |t|
      t.references :user, foreign_key: true
      t.string :first_name
      t.string :last_name
      t.string :stage_name
      t.string :talent
      t.text :bio
      t.integer :page_views
      t.decimal :account_balance
      t.string :followers
      t.string :following
      t.string :paypal_email
      t.string :stripe_id
      t.string :fb_link
      t.string :twitter
      t.string :soundclound

      t.timestamps
    end
  end
end
