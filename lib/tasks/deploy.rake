desc "This task is called by the Heroku scheduler add-on"
task :deploy  do
  puts "Getting ready to deploy to heroku"
  puts "Generate Site map? \nNote this will pull live database and delete current local database"
  message=STDIN.gets.strip
  if message[0].to_s.upcase=="Y"
     Bundler.with_clean_env{system 'rake sitemap_generate'}
  end
 puts "Do you want to test the sitemap generated for broken links? \nNote: This may take several minutes"
  message=STDIN.gets.strip
  if message[0].to_s.upcase=="Y"
      Bundler.with_clean_env{system 'rake test_sitemap'}
  end
  puts "Enter Deploy Message Below:"
  message=STDIN.gets.strip
  puts "Adding new files"
  system "git add ."
  if message == ""
      system 'git commit -am "Auto Deploy"'
  else
    system "git commit -am '#{message}'"
  end
  puts "Pulling from Heroku to merge changes"
  system "git pull heroku master"
  puts "Continue Deploy? or Cancel to resolve pull conflict?"
  message = STDIN.gets.strip
  if message[0] != "y" && message[0]!="c"
      abort("Cancelled by User, don't forget to double check merged files for conflicts")
  else
    system "git commit -am '#{message}'"
  end
  # puts "Turning Mainenance on"
  #  Bundler.with_clean_env { system 'heroku maintenance:on'}
  puts "Begin push"
  system 'git push heroku master'
   Bundler.with_clean_env { system 'heroku run rake db:migrate'}
  #  Bundler.with_clean_env { system'heroku maintenance:off'}
  # puts "Turn maintenance off done ....Yay!!"
  puts "Restarting heroku just to make sure nothing is fucking up"
 #  puts "pushing to GitLab"
 # Bundler.with_clean_env{system 'git push gitlab master'}
end
