require 'test_helper'

class MusicControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get music_index_url
    assert_response :success
  end

end
