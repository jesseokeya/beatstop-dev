require 'test_helper'

class WebPlayerControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get web_player_index_url
    assert_response :success
  end

end
