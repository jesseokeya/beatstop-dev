/*!
 * mep.js - 1.0.0
 * Playlist and other functionality for MediaElement.js
 * @ flatfull.com All Rights Reserved.
 * Author url: http://themeforest.net/user/flatfull
 */
window.mep = window.mep || {};

(function( window, $, undefined )  {
	'use strict';

	var $window = $( window ),
		mep = window.mep;

	mep.l10n = $.extend({
		nextTrack: 'Next Track',
		previousTrack: 'Previous Track',
		togglePlaylist: 'Toggle Playlist',
		repeat: 'Repeat',
		shuffle: 'Shuffle',
		error: 'Oh snap, there was a playback error!'
	}, mep.l10n || {});

	mep.settings = mep.settings || {};

	// Add mime-type aliases to MediaElement plugin support.
	mejs.plugins.silverlight[ 0 ].types.push( 'audio/x-ms-wma' );

	// Detection for browser SVG capability.
	$( 'html' ).addClass(function() {
		return document.implementation.hasFeature( 'http://www.w3.org/TR/SVG11/feature#Image', '1.1' ) ? 'svg' : 'no-svg';
	});

	$.extend( mejs.MepDefaults, {
		mepResponsiveProgress: false, // Set the progress bar to 100% on window resize.
		mepSelectors: {
			container: '.mep-playlist-container'
		},
		mepSkin: ''
	});

	/**
	 * jQuery plugin to initialize playlists.
	 *
	 * @class mepPlaylist
	 * @memberOf jQuery.fn
	 *
	 * @param {Object} options Custom settings overrides.
	 *
	 * @return {jQuery} Chainable jQuery collection.
	 */
	$.fn.mepPlaylist = function( options ) {
		var settings = $.extend({}, $.fn.mepPlaylist.defaults, options );

		// Add selector settings.
		settings.mepSelectors = $.extend({}, mejs.MepDefaults.mepSelectors, {
			playlist: this.selector,
			track: '.mep-track'
		});

		// Merge custom selector options into the defaults.
		if ( 'object' === typeof options && 'mepSelectors' in options ) {
			$.extend( settings.mepSelectors, options.mepSelectors );
		}

		return this.each(function() {
			var $playlist = $( this ),
				$media = $playlist.find( '.mep-audio, audio, .mep-video, video' ),
				$data = $playlist.find( '.mep-playlist-data, script' ),
				data, i, trackCount;
			
			if ( ! $data.length ) {
				$data = $playlist.closest( settings.mepSelectors.container ).find( '.mep-playlist-data, script' );
			}

			if ( $data.length ) {
				data = $.parseJSON( $data.first().html() );

				// Add the signature.
				if ( 'signature' in data ) {
					settings.mepSignature = data.signature;
				}

				// Add the signature.
				if ( 'mepSignature' in data ) {
					settings.mepSignature = data.mepSignature;
				}

				// Add the tracks.
				if ( ( 'undefined' === typeof options || 'undefined' === typeof options.mepPlaylistTracks ) && 'tracks' in data ) {
					settings.mepPlaylistTracks = data.tracks;
				}
			}

			if ( settings.mepPlaylistTracks.length ) {
				trackCount = settings.mepPlaylistTracks.length;
				$playlist.addClass( 'mep-tracks-count-' + trackCount );

				// Create an <audio> element if one couldn't be found.
				if ( ! $media.length ) {
					for ( i = 0; i < trackCount; i++ ) {
						if ( '' === settings.mepPlaylistTracks[ i ].src ) {
							continue;
						}

						$media = $( '<audio />', {
							src: 'mp3.mp3'
							//src: settings.mepPlaylistTracks[ i ].src
						});

						if(settings.mepPlaylistTracks[ i ].src.indexOf('youtube') != -1){
							$media = $( '<video />', {
								src: settings.mepPlaylistTracks[ i ].src,
								type: 'video/youtube'
							});
							settings.mepSkin = 'mejs-video';
						}

						$media.prependTo( $playlist );
						break;
					}
				}

				// Initialize MediaElement.js.
				$media.mediaelementplayer( settings );
			}

		});
	};

	$.fn.mepPlaylist.defaults = {
		autosizeProgress: false,
		mepPlaylistLoop: true,
		mepPlaylistRepeat: false,
		mepPlaylistShuffle: false,
		mepPlaylistTracks: [],
		mepSkin: 'mep-skin-default',
		defaultAudioHeight: 0,
		enableAutosize: false,
		features: [
			'mepartwork',
			'mepcurrentdetails',
			'mepprevioustrack',
			'playpause',
			'mepnexttrack',
			'progress',
			'current',
			'duration',
			'mepplaylist'
		],
		success: function( media, domObject, player ) {
			var $media = $( media ),
				$container = player.container.closest( player.options.mepSelectors.playlist );

			if ( '' !== player.options.mepSkin ) {
				player.changeSkin( player.options.mepSkin );
			}

			// Make the time rail responsive.
			if ( player.options.mepResponsiveProgress ) {
				$window.on( 'resize.mep', function() {
					player.controls.find( '.mejs-time-rail' ).width( '100%' );
					//t.setControlsSize();
				}).trigger( 'resize.mep' );
			}

			$media.on( 'play.mep', function() {
				$container.addClass( 'is-playing' );
			}).on( 'pause.mep', function() {
				$container.removeClass( 'is-playing' );
			});

			// Youtube ended
			if(player.media.pluginType == 'youtube'){
				$media.on( 'ended', function() {
					player.$media.trigger('ended.mep');
				});
			}

			$( player.options.mepSelectors.playlist ).removeClass( 'is-loading' );

			$container.trigger( 'success.mep', [ media, domObject, player ]);
		},
		timeAndDurationSeparator: '<span class="mejs-time-separator"> / </span>'
	};

})( this, jQuery );

//artwork
(function( window, $, undefined ) {
	'use strict';

	$.extend( MediaElementPlayer.prototype, {
		buildmepartwork: function( player, controls, layers ) {
			var $artwork = layers.append( '<a class="mejs-track-artwork"></a>' ).find( '.mejs-track-artwork' );

			player.$node.on( 'setTrack.mep', function( e, track, player ) {
				var hasArtwork;

				track.thumb = track.thumb || {};
				hasArtwork = 'undefined' !== typeof track.thumb.src && '' !== track.thumb.src;
				$artwork.attr('href', track.link);
				// Set the artwork src and toggle depending on if the URL is empty.
				$artwork.css( 'background-image', 'url(' + track.thumb.src + ')' ).toggle( hasArtwork );
				$artwork.closest( player.options.mepSelectors.playlist ).toggleClass( 'has-artwork', hasArtwork );
			});
		}
	});

})( this, jQuery );

//current detail
(function( window, $, undefined ) {
	'use strict';

	$.extend( MediaElementPlayer.prototype, {
		buildmepcurrentdetails: function( player, controls, layers ) {
			var $author, $title;

			layers.append( '<div class="mejs-track-details"><span class="mejs-track-title"></span><span class="mejs-track-author"></span></div>' );
			$author = layers.find( '.mejs-track-author' );
			$title = layers.find( '.mejs-track-title' );

			player.$node.on( 'setTrack.mep', function( e, track, player ) {
				track.meta = track.meta || {};
				track.title = track.title || {};
				track.link = track.link || {};
				$author.html(  '<a href="'+track.meta.authorlink+'">'+track.meta.author+ '</a>' );
				$title.html( '<a href="'+track.link+'">'+track.title+ '</a>');
			});
		}
	});

})( this, jQuery );

// history
(function( window, $, undefined ) {
	'use strict';

	var historySuccess, originalSuccess,
		mePlayerInit = mejs.MediaElementPlayer.prototype.init;

	/**
	 * Proxy the MediaElementPlayer init method to proxy the success callback.
	 */
	mejs.MediaElementPlayer.prototype.init = function() {
		// Set up if the mephistory feature is declared.
		if ( -1 !== $.inArray( 'mephistory', this.options.features ) ) {
			originalSuccess = this.options.success;
			this.options.success = historySuccess;
		}
		mePlayerInit.call( this );
	};

	/**
	 * Proxied MediaElementPlayer success callback.
	 */
	historySuccess = function( media, domObject, player ) {
		var isPlaying, status,
			history = new History( player.options.mepId || '', player.options.mepSignature || '' ),
			autoplay = ( 'autoplay' === media.getAttribute( 'autoplay' ) ),
			mf = mejs.MediaFeatures;

		if ( history && undefined !== history.get( 'volume' ) ) {
			media.setVolume( history.get( 'volume' ) );
		}

		if ( history && undefined !== history.get( 'trackIndex' ) ) {
			// Don't start playing if on a mobile device or if autoplay is active.
			status = history ? history.get( 'status' ) : '';
			isPlaying = ( 'playing' === status && ! mf.isiOS && ! mf.isAndroid && ! autoplay );

			// Set a global flag to let other methods know if the track has been
			// auto-resumed.
			player.mepAutoResume = isPlaying;

			if ( 'mepPlaylistTracks' in player.options && player.options.mepPlaylistTracks.length ) {
				player.mepSetCurrentTrack( history.get( 'trackIndex' ), isPlaying );
			} else if ( isPlaying ) {
				player.mepPlay();
			}
		}

		if ( history && undefined !== history.get( 'repeat' ) ) {
			player.options.mepPlaylistRepeat = history.get( 'repeat' ) == "true" ? true : false;
			player.updateRepeat();
		}

		if ( history && undefined !== history.get( 'shuffle' ) ) {
			player.options.mepPlaylistShuffle = history.get( 'shuffle' ) == "true" ? true : false;
			player.updateShuffle();
		}

		originalSuccess.call( this, media, domObject, player );
	};

	$.extend( mejs.MepDefaults, {
		mepId: 'mep',
		mepSignature: ''
	});

	$.extend( MediaElementPlayer.prototype, {
		mepHistory: null,
		mepAutoResume: false,

		buildmephistory: function( player, controls, layers, media ) {
			var currentTime, history,
				isLoaded = false,
				mf = mejs.MediaFeatures,
				isSafari = /Safari/.test( navigator.userAgent ) && /Apple Computer/.test( navigator.vendor );

			history = player.mepHistory = new History( player.options.mepId, player.options.mepSignature );
			currentTime = history.get( 'currentTime' );

			media.addEventListener( 'play', function() {
				history.set( 'trackIndex', player.mepCurrentTrack );
				history.set( 'status', 'playing' );
			});

			media.addEventListener( 'pause', function() {
				history.set( 'status', 'paused' );
			});

			media.addEventListener( 'timeupdate', function() {
				history.set( 'currentTime', media.currentTime );
			});

			media.addEventListener( 'volumechange', function() {
				history.set( 'volume', media.volume );
			});

			// Only set the current time on initial load.
			media.addEventListener( 'playing', function() {
				if ( isLoaded || currentTime < 1 ) {
					return;
				}

				if ( mf.isiOS || isSafari ) {
					// Tested on the following devices (may need to update for other devices):
					// - iOS 7 on iPad
					// - Safari 9 on OSX

					// The currentTime can't be set in iOS until the desired time
					// has been buffered. Poll the buffered end time until it's
					// possible to set currentTime. This fix should work in any
					// browser, but is not ideal because the audio may begin
					// playing from the beginning before skipping ahead.
					var intervalId = setInterval(function() {
						if ( currentTime < media.buffered.end( 0 ) ) {
							clearInterval( intervalId );
							player.setCurrentTime( currentTime );
							player.setCurrentRail();
						}
					}, 50 );
				} else {
					try {
						player.setCurrentTime( currentTime );
						player.setCurrentRail();
					} catch ( exp ) { }
				}

				isLoaded = true;
			});

			player.$node.on( 'repeat.mep', function() {
				history.set( 'repeat', player.options.mepPlaylistRepeat );
			});
			player.$node.on( 'shuffle.mep', function() {
				history.set( 'shuffle', player.options.mepPlaylistShuffle );
			});
		}

	});

	function History( id, signature ) {
		var data = sessionStorage || {},
			signatureProp = id + '-signature';

		this.set = function( key, value ) {
			var prop = id + '-' + key;
			data[ prop ] = value;
		};

		this.get = function( key ) {
			var value,
				prop = id + '-' + key;

			if ( 'undefined' !== typeof data[ prop ] ) {
				value = data[ prop ];

				if ( 'currentTime' === key ) {
					value = parseFloat( value );
				} else if ( 'status' === key ) {
					value = ( 'playing' === value ) ? 'playing' : 'paused';
				} else if ( 'trackIndex' === key ) {
					value = parseInt( value, 10 );
				} else if ( 'volume' === key ) {
					value = parseFloat( value );
				}
			}

			return value;
		};

		this.clear = function() {
			var prop;

			for ( prop in data ) {
				if ( data.hasOwnProperty( prop ) && 0 === prop.indexOf( id + '-' ) ) {
					delete data[ prop ];
				}
			}
		};

		// Clear the history if the signature changed.
		if ( 'undefined' === typeof data[ signatureProp ] || data[ signatureProp ] !== signature ) {
			this.clear();
		}

		data[ signatureProp ] = signature;
	}

})( this, jQuery );

// icons
(function( window, $, undefined ) {
	'use strict';

	// Add this feature after all controls have been built.
	$.extend( MediaElementPlayer.prototype, {
		buildmepicons: function( player, controls ) {
			var $icons = $( player.options.mepSelectors.container ).find( '[data-mep-control]' );

			$icons.each(function() {
				var $icon = $( this );
				$icon.appendTo( controls.find( $icon.data( 'mepControl' ) ) );
			});
		}
	});

})( this, jQuery );

// next
(function( window, $, mep, undefined ) {
	'use strict';

	$.extend( MediaElementPlayer.prototype, {
		buildmepnexttrack: function( player, controls, layers, media ) {
			$( '<div class="mejs-button mejs-next-button mejs-next">' +
					'<button type="button" aria-controls="' + player.id + '" title="' + mep.l10n.nextTrack + '"></button>' +
					'</div>' )
				.appendTo( controls )
				.on( 'click.mep', function() {
					var state,
						track = player.mepGetCurrentTrack() || {};

					state = $.extend({}, {
						currentTime: media.currentTime,
						duration: media.duration,
						src: media.src
					});

					player.$node.trigger( 'skipNext.mep', [ state, track ] );
					player.mepPlayNextTrack();
				});
		},

		// @todo Go to next playable track.
		mepPlayNextTrack: function() {
			var player = this,
				index = player.mepCurrentTrack + 1 >= player.options.mepPlaylistTracks.length ? 0 : player.mepCurrentTrack + 1;
			if(player.options.mepPlaylistShuffle){
				index = Math.floor(Math.random() * (player.options.mepPlaylistTracks.length - 1));
	    		if (index >= player.mepCurrentTrack) index += 1;
    		}
			player.$node.trigger( 'nextTrack.mep', player );
			player.mepSetCurrentTrack( index );
		}
	});

})( this, jQuery, window.mep );

// playlist
(function( window, $, undefined ) {
	'use strict';

	var current, playTimeoutId;

	$.extend( mejs.MepDefaults, {
		mepPlaylistLoop: true,
		mepPlaylistTracks: []
	});

	$.extend( mejs.MepDefaults.mepSelectors, {
		playlist: '.mep-playlist',
		track: '.mep-track',
		trackCurrentTime: '.mep-track-current-time',
		trackDuration: '.mep-track-duration',
		trackPlayBar: '.mep-track-play-bar',
		trackProgressBar: '.mep-track-progress-bar',
		trackSeekBar: '.mep-track-seek-bar',
		tracklist: '.mep-tracklist'
	});

	$.extend( MediaElementPlayer.prototype, {
		$mepTracks: $(),
		mepCurrentTrack: 0,

		/**
		 * Set up a playlist and attach events for interacting with tracks.
		 * @todo This will be refactored at some point.
		 */
		buildmepplaylist: function( player, controls, layers, media ) {
			var selectors = player.options.mepSelectors,
				$media = player.$media,
				$playlist = player.container.closest( selectors.playlist );

			player.mepSetupTracklist();

			// Set the current track when initialized.
			player.mepSetCurrentTrack( player.options.mepPlaylistTracks[ 0 ], false );

			// Seek when though is sought...
			$playlist.on( 'click.mep', selectors.trackSeekBar, function( e ) {
				var $bar = $( this ),
					duration = player.options.duration > 0 ? player.options.duration : player.media.duration,
					pos = e.pageX - $bar.offset().left,
					width = $bar.outerWidth(),
					percentage = pos / width;

				percentage = percentage < 0.2 ? 0 : percentage;
				media.setCurrentTime( percentage * duration );
			});

			// Play a track when it's clicked in the track list.
			$playlist.on( 'click.mep', selectors.track, function( e ) {
				var $track = $( this ),
					index = player.$mepTracks.index( $track ),
					$target = $( e.target ),
					$forbidden = $track.find( 'a, .js-disable-playpause, ' + selectors.trackProgressBar );

				// Don't toggle play status when links or elements with a 'js-disable-play' class are clicked.
				if ( ! $target.is( $forbidden ) && ! $forbidden.find( $target ).length ) {
					// Update the reference to the current track and player.
					current.setPlayer( player ).setTrack( $track );

					if ( player.mepCurrentTrack === index && '' !== player.options.mepPlaylistTracks[ index ].src ) {
						// Toggle play/pause state.
						if ( media.paused) {
							media.play();
						} else {
							media.pause();
						}
					} else {
						player.mepSetCurrentTrack( index );
					}
				}
			});

			// Toggle the 'is-playing' class and set the current track elements.
			$media.on( 'play.mep', function() {
				var $track = player.$mepTracks.removeClass( 'is-playing' ).eq( player.mepCurrentTrack ).addClass( 'is-playing' );

				// Update the reference to the current track and player.
				current.setPlayer( player ).setTrack( $track );
			});

			$media.on( 'pause.mep', function() {
				player.$mepTracks.removeClass( 'is-playing' );
			});

			// Update the current track's duration and current time.
			$media.on( 'timeupdate.mep', function() {
				current.updateTimeCodes();
			});

			// Play the next track when one ends.
			$media.on( 'ended.mep', function() {
				var index = player.mepCurrentTrack + 1 >= player.options.mepPlaylistTracks.length ? 0 : player.mepCurrentTrack + 1;
				
				if(player.options.mepPlaylistRepeat){
					index = player.mepCurrentTrack;
					player.mepSetCurrentTrack(index);
					return;
	    		}

				// Determine if the playlist shouldn't loop.
				if ( ! player.options.mepPlaylistLoop && 0 === index ) {
					return;
				}

				// Give other 'end' events a chance to grab the current track.
				setTimeout(function() {
					player.$node.trigger( 'nextTrack.mep', player );
					player.mepPlayNextTrack();
				}, 250 );
			});
		},

		/**
		 * Play the current track.
		 *
		 * Some browsers and plugins don't like it when play() is called
		 * immediately after a file has been loaded (history autoplay back,
		 * ended event, etc).
		 *
		 * Cycling through tracks quickly can also cause multiple sources to
		 * begin playing without a way to control them, so clearing the timeout
		 * helps prevent that.
		 */
		mepPlay: function() {
			var player = this;

			if ( ! player.media.paused && 'flash' !== player.media.pluginType ) {
				return;
			}

			clearTimeout( playTimeoutId );

			playTimeoutId = setTimeout(function() {
				player.play();
			}, 50 );
		},

		mepGetCurrentTrack: function() {
			return this.options.mepPlaylistTracks[ this.mepCurrentTrack ];
		},

		mepSetCurrentTrack: function( track, play ) {
			var player = this,
				selectors = player.options.mepSelectors;

			if ( 'number' === typeof track ) {
				player.mepCurrentTrack = track;
				track = player.mepGetCurrentTrack();
			}

			if(track == undefined) return;

			player.container.closest( selectors.playlist )
				.find( selectors.track ).removeClass( 'is-current' )
				.eq( player.mepCurrentTrack ).addClass( 'is-current' );

			if ( track.length ) {
				player.controls.find( '.mejs-duration' ).text( track.length );
			}

			if ( track.src && track.src !== player.media.src ) {
				player.pause();
				player.setSrc( track.src );
				player.load();
			}

			player.$node.trigger( 'setTrack.mep', [ track, player ]);

			if ( track.src && ( 'undefined' === typeof play || play ) ) {
				player.mepPlay();
			}
		},

		mepSetupTracklist: function() {
			var player = this,
				selectors = player.options.mepSelectors,
				$playlist = player.container.closest( selectors.playlist );

			player.$mepTracks = $playlist.find( selectors.track );

			// Add an 'is-playable' class to tracks with an audio src file.
			player.$mepTracks.filter( function( i ) {
				var track = player.options.mepPlaylistTracks[ i ] || {};
				return 'src' in track && '' !== track.src;
			}).addClass( 'is-playable' );
		}
	});

	/**
	 * Cached reference to the current player and track.
	 */
	current = {
		player: null,
		$track: $(),
		$duration: $(),
		$playBar: $(),
		$time: $(),

		setPlayer: function( player ) {
			this.player = player;
			return this;
		},

		setTrack: function( $track ) {
			var selectors = this.player.options.mepSelectors;

			this.$track = ( $track instanceof jQuery ) ? $track : $( $track );
			this.$duration = this.$track.find( selectors.trackDuration );
			this.$playBar = this.$track.find( selectors.trackPlayBar );
			this.$time = this.$track.find( selectors.trackCurrentTime );

			return this;
		},

		updateTimeCodes: function() {
			var player = this.player,
				duration, durationTimeCode, currentTimeCode;

			if ( null === player ) {
				return;
			}

			duration = player.options.duration > 0 ? player.options.duration : player.media.duration;
			if ( ! isNaN( duration ) ) {
				durationTimeCode = mejs.Utility.secondsToTimeCode( duration, player.options.alwaysShowHours, player.options.showTimecodeFrameCount, player.options.framesPerSecond || 25 );
				currentTimeCode = mejs.Utility.secondsToTimeCode( player.media.currentTime, player.options.alwaysShowHours || player.media.duration > 3600, player.options.showTimecodeFrameCount, player.options.framesPerSecond || 25 );

				this.$duration.text( durationTimeCode );
				this.$playBar.width( player.media.currentTime / duration * 100 + '%' );
				this.$time.text( currentTimeCode );
			}

			return this;
		}
	};

})( this, jQuery );

// toggle playlist
(function( window, $, mep, undefined ) {
	'use strict';

	$.extend( mejs.MepDefaults, {
		mepPlaylistToggle: function( $tracklist, player ) {
			$tracklist.slideToggle( 200 );
		}
	});

	$.extend( MediaElementPlayer.prototype, {
		buildmepplaylisttoggle: function( player, controls, layers, media ) {
			var selectors = player.options.mepSelectors,
				$playlist = player.container.closest( selectors.playlist ),
				$tracklist = $playlist.find( selectors.tracklist ),
				isTracklistVisible = $tracklist.is( ':visible' );

			$playlist.addClass(function() {
				return isTracklistVisible ? 'is-tracklist-open' : 'is-tracklist-closed';
			});

			$( '<div class="mejs-button mejs-toggle-playlist-button mejs-toggle-playlist">' +
				'<button type="button" aria-controls="' + player.id + '" title="' + mep.l10n.togglePlaylist + '"></button>' +
				'</div>' )
			.appendTo( player.controls )
			.on( 'click', function() {
				var $button = $( this ),
					isTracklistVisible = $tracklist.is( ':visible' );

				$button.toggleClass( 'is-open', ! isTracklistVisible ).toggleClass( 'is-closed', isTracklistVisible );
				$playlist.toggleClass( 'is-tracklist-open', ! isTracklistVisible ).toggleClass( 'is-tracklist-closed', isTracklistVisible );

				if ( $.isFunction( player.options.mepPlaylistToggle ) ) {
					player.options.mepPlaylistToggle( $tracklist, player );
				}
			})
			.addClass(function() {
				return isTracklistVisible ? 'is-open' : 'is-closed';
			});
		}
	});

})( this, jQuery, window.mep );

// prev
(function( window, $, mep, undefined ) {
	'use strict';

	$.extend( MediaElementPlayer.prototype, {
		buildmepprevioustrack: function( player, controls, layers, media ) {
			$( '<div class="mejs-button mejs-previous-button mejs-previous">' +
					'<button type="button" aria-controls="' + player.id + '" title="' + mep.l10n.previousTrack + '"></button>' +
					'</div>' )
				.appendTo( controls )
				.on( 'click.mep', function() {
					var state,
						track = player.mepGetCurrentTrack() || {};

					state = $.extend({}, {
						currentTime: media.currentTime,
						duration: media.duration,
						src: media.src
					});

					player.$node.trigger( 'skipBack.mep', [ state, track ] );
					player.mepPlayPreviousTrack();
				});
		},

		// @todo Go to previous playable track.
		mepPlayPreviousTrack: function() {
			var player = this,
				index = player.mepCurrentTrack - 1 < 0 ? player.options.mepPlaylistTracks.length - 1 : player.mepCurrentTrack - 1;
			if(player.options.mepPlaylistShuffle){
				index = Math.floor(Math.random() * (player.options.mepPlaylistTracks.length - 1));
	    		if (index >= player.mepCurrentTrack) index += 1;
    		}
			player.$node.trigger( 'previousTrack.mep', player );
			player.mepSetCurrentTrack( index );
		}
	});

})( this, jQuery, window.mep );


// custom functions

// repeat
(function( window, $, mep, undefined ) {
	'use strict';

	$.extend( MediaElementPlayer.prototype, {
		buildmeprepeat: function( player, controls, layers, media ) {
			$( '<div class="mejs-button mejs-repeat-button mejs-repeat">' +
					'<button type="button" aria-controls="' + player.id + '" title="' + mep.l10n.repeat + '"></button>' +
					'</div>' )
				.appendTo( controls )
				.on( 'click.mep', function() {
					player.options.mepPlaylistRepeat = !player.options.mepPlaylistRepeat;
					player.$node.trigger( 'repeat.mep', player );
					player.updateRepeat();
				});
		},
		updateRepeat: function(){
			var player = this;
			if( player.options.mepPlaylistRepeat == true ){
				player.container.find('.mejs-repeat-button').addClass('is-repeat');
			}else{
				player.container.find('.mejs-repeat-button').removeClass('is-repeat');
			}
		}
	});

})( this, jQuery, window.mep );

// shuffle
(function( window, $, mep, undefined ) {
	'use strict';

	$.extend( MediaElementPlayer.prototype, {
		buildmepshuffle: function( player, controls, layers, media ) {
			$( '<div class="mejs-button mejs-shuffle-button mejs-repeat">' +
					'<button type="button" aria-controls="' + player.id + '" title="' + mep.l10n.shuffle + '"></button>' +
					'</div>' )
				.appendTo( controls )
				.on( 'click.mep', function() {
					player.options.mepPlaylistShuffle = !player.options.mepPlaylistShuffle;
					player.$node.trigger( 'shuffle.mep', player );
					player.updateShuffle();
				});
		},
		updateShuffle: function(){
			var player = this;
			if( player.options.mepPlaylistShuffle == true ){
				player.container.find('.mejs-shuffle-button').addClass('is-shuffle');
			}else{
				player.container.find('.mejs-shuffle-button').removeClass('is-shuffle');
			}
		}
	});

})( this, jQuery, window.mep );

// like
(function( window, $, undefined ) {
  'use strict';

  $.extend( MediaElementPlayer.prototype, {
    buildmeplike: function( player, controls, layers ) {
      var $like = layers.append( '<div class="mejs-track-actions"><button class="mejs-like-button btn btn-sm no-bg btn-icon"></button></div>' ).find( '.mejs-like-button' );
      
      $like.click(function() {
          player.$node.trigger('like.mep', [$like.attr( 'track-id')] );
      });

      player.$node.on( 'setTrack.mep', function( e, track, player ) {
         $like.attr( 'track-id', track.id);
         track.like ? $like.addClass('is-like') : $like.removeClass('is-like');
      });

    }
  });

})( this, jQuery );

// source
(function( window, $, undefined ) {
  'use strict';

  $.extend( MediaElementPlayer.prototype, {
    buildmepsource: function( player, controls, layers ) {
      var $source = layers.append( '<div class="mejs-track-source"><i></i></div>' ).find( '.mejs-track-source' );

      player.$node.on( 'setTrack.mep', function( e, track, player ) {
         if(track.source){
          $source.show().find('i').attr('class', '').addClass(track.source.from);
         }else{
          $source.hide();
         }
      });

    }
  });

})( this, jQuery );

// buffering
(function( window, $, undefined ) {
  'use strict';

  $.extend( MediaElementPlayer.prototype, {
    buildmepbuffering: function(player, controls, layers, media) {
      var t = this,
      $container = player.container,
      error =
        $('<div class="mejs-overlay-error mejs-layer">'+
          '<div class="mejs-error"></div>'+
        '</div>')
        .hide() // start out hidden
        .appendTo(layers)
        .on( 'click.mep', function() {
        	$(this).hide();
        })
      ;

      // show/hide big play button
      media.addEventListener('play',function() {
        $container.removeClass('is-buffering');
        $('body').removeClass('is-buffering');
        error.hide();
      }, false);

      media.addEventListener('playing', function() {
        $container.removeClass('is-buffering');
        $('body').removeClass('is-buffering');
        error.hide();
      }, false);

      media.addEventListener('seeking', function() {
        $container.addClass('is-buffering');
        $('body').addClass('is-buffering');
      }, false);

      media.addEventListener('seeked', function() {
        $container.removeClass('is-buffering');
        $('body').removeClass('is-buffering');
      }, false);

      media.addEventListener('waiting', function() {
        $container.addClass('is-buffering');
        $('body').addClass('is-buffering');
      }, false);

      // show/hide loading
      media.addEventListener('loadeddata',function() {
		// Hide the duration and time separator if the duration isn't available.
		if ( isNaN( media.duration ) || media.duration == "Infinity") {
			$container.find( '.mejs-duration' ).addClass('mejs-time-infinity');
		}else{
			$container.find( '.mejs-duration' ).removeClass('mejs-time-infinity');
		}
        $container.addClass('is-buffering');
        $('body').addClass('is-buffering');
      }, false);

      media.addEventListener('canplay',function() {
        $container.removeClass('is-buffering');
        $('body').removeClass('is-buffering');
      }, false);

      // error handling
      media.addEventListener('error',function(e) {
        $container.removeClass('is-buffering');
        $('body').removeClass('is-buffering');
        error.show();
        error.find('.mejs-error').html(mep.l10n.error);
      }, false);

    }
  });

})( this, jQuery );

// youtube
(function( window, $, undefined ) {
  	'use strict';
	$.extend(MediaElementPlayer.prototype, {
	    buildyoutube: function(player, controls, layers, media) {
	        if (media.pluginType !== 'youtube') {
	            return;
	        }
	        $.extend(media, {
	            setSrc: function (url) {
	            	media.src = url;
	                var videoId;
					// youtu.be url from share button
					if (url.lastIndexOf("youtu.be") != -1) {
						videoId = url.substr(url.lastIndexOf('/')+1);
						if (videoId.indexOf('?') != -1) {
							videoId = videoId.substr(0, videoId.indexOf('?'));
						}
					}
					else {
						videoId = url.substr(url.lastIndexOf('=')+1);
					}
	                this.pluginApi.loadVideoById(videoId);
	            }
	        });

	        $( '<div class="mejs-button mejs-youtube-button mejs-repeat">' +
					'<button type="button" aria-controls="' + player.id + '"></button>' +
					'</div>' )
			.appendTo( controls )
			.on( 'click.mep', function() {
				player.container.toggleClass('video-open');
			});
	    }
	});

})( this, jQuery );

// build list
(function( window, $, undefined ) {
  'use strict';

  $.extend( MediaElementPlayer.prototype, {
    buildmeptracklist: function( player, controls, layers ) {
      var $playlist = player.container.closest( player.options.mepSelectors.playlist ),
	      $list = $( '<ol></ol>' ).addClass(player.options.mepSelectors.tracklist.substring(1));
	  if($playlist.find(player.options.mepSelectors.tracklist).length){
	  	return;
	  }
      $playlist.append($list);

      player.updatemepList();

      $playlist.on('click.track.mep', '.track-remove', function(e){
      	e.preventDefault();
      	var index = $(this).parent().parent().index();
      	player.mepRemove( player.options.mepPlaylistTracks[index] );
      });

    },
    updatemepList: function(){
    	var player = this,
    		$playlist = player.container.closest( player.options.mepSelectors.playlist ),
			$tracklist = $playlist.find( player.options.mepSelectors.tracklist );
		$tracklist.html('');
    	$.each(player.options.mepPlaylistTracks, function(i) {
			$tracklist.append(player.createItem(player.options.mepPlaylistTracks[i]));
		});
		player.$mepTracks = $playlist.find( player.options.mepSelectors.track );
    },
    createItem: function(item){
    	var tpl = '<li class="track"><div class="track-action"><a class="track-remove">&times;</a></div><div class="track-info"><span class="track-title">'+item.title+'</span><span class="track-author">'+item.meta.author+'</span></div></li>';
    	return tpl;
    },
    mepAdd: function(item, play){
    	var player = this,
    		$playlist = player.container.closest( player.options.mepSelectors.playlist ),
			$tracklist = $playlist.find( player.options.mepSelectors.tracklist ),
    	    index = player.find(item.id);
    	if(index > -1){
    		if(play){
    			player.mepSelect(index, play);
    		}
    		return;
    	}
    	player.options.mepPlaylistTracks.push(item);
    	$tracklist.append(player.createItem(item));
    	player.$mepTracks = $playlist.find( player.options.mepSelectors.track );
    	if(play){
			player.mepSelect(player.options.mepPlaylistTracks.length - 1, play);
		}
    },
    mepRemove: function(item){
    	var player = this,
    		$playlist = player.container.closest( player.options.mepSelectors.playlist ),
			$tracks = $playlist.find( player.options.mepSelectors.track );
    	if(item.id == null){
      		return;
      	}
      	var index = player.find(item.id);
      	if(index > -1){
      		player.options.mepPlaylistTracks.splice(index, 1);
      		$tracks.eq(index).remove();
      		player.$mepTracks = $playlist.find( player.options.mepSelectors.track );
      		if(player.mepCurrentTrack == index){
      			var i = player.options.mepPlaylistTracks.length > index ? index : index -1;
      			player.mepSelect(i);
      		}
      	}
    },
    mepSelect: function(index, play){
    	var player = this;
    	player.mepSetCurrentTrack( index, play );
    },
    find: function(id){
    	var player = this,
    	    j = -1;
		for(var i=0; i<player.options.mepPlaylistTracks.length; i++){
		  if(player.options.mepPlaylistTracks[i].id===id){
		  	  j = i;
		      return j;
		  }
	    }
	    return j;
	}
  });

})( this, jQuery );

