require 'test_helper'

class SupportControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get support_index_url
    assert_response :success
  end

end
