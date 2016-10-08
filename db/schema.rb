# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160918144936) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "artists", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "stage_name"
    t.string   "talent"
    t.text     "bio"
    t.integer  "page_views"
    t.decimal  "account_balance"
    t.string   "followers"
    t.string   "following"
    t.string   "paypal_email"
    t.string   "stripe_id"
    t.string   "fb_link"
    t.string   "twitter"
    t.string   "soundclound"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.string   "cover_photo_file_name"
    t.string   "cover_photo_content_type"
    t.integer  "cover_photo_file_size"
    t.datetime "cover_photo_updated_at"
    t.index ["user_id"], name: "index_artists_on_user_id", using: :btree
  end

  create_table "musics", force: :cascade do |t|
    t.integer  "artist_id"
    t.boolean  "for_sale"
    t.float    "price"
    t.integer  "listens"
    t.integer  "downloads"
    t.text     "description"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "beat_file_name"
    t.string   "beat_content_type"
    t.integer  "beat_file_size"
    t.datetime "beat_updated_at"
    t.string   "cover_art_file_name"
    t.string   "cover_art_content_type"
    t.integer  "cover_art_file_size"
    t.datetime "cover_art_updated_at"
    t.string   "name"
    t.index ["artist_id"], name: "index_musics_on_artist_id", using: :btree
  end

  create_table "others_involveds", force: :cascade do |t|
    t.integer  "music_id"
    t.string   "first_name"
    t.string   "last_name"
    t.integer  "artist_id"
    t.boolean  "feature"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["music_id"], name: "index_others_involveds_on_music_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

  add_foreign_key "artists", "users"
  add_foreign_key "musics", "artists"
  add_foreign_key "others_involveds", "musics"
end
