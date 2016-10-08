require 'test_helper'

class AboutUsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get about_us_index_url
    assert_response :success
  end

end
