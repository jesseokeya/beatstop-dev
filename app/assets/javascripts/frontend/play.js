function play_music(name,artist,url,poster) {
	// body...
	myPlaylist.add({
		title: name,
		artist: artist,
		mp3: url,
		poster: poster
	});
	myPlaylist.play(-1);
}