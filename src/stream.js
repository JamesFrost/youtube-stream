const _youtube = require( 'googleapis' ).youtube( 'v3' );
var _currentStep;

exports._init = function( auth, liveChatId, callback )
{
	_step( auth, liveChatId, undefined, callback );
};

const _step = function( auth, liveChatId, pageToken, callback )
{
	_getMessages(auth, liveChatId, pageToken, function( err, response )
	{
		callback( err, response );

		if( err )
		{
			console.log( err );
		}
		
		const pollingInterval = response == undefined ? 10000 : response.pollingIntervalMillis;
		const pageToken = response == undefined ? undefined : response.nextPageToken;

		if( _currentStep === false )
			return;

		_currentStep = setTimeout(function()
		{
			_step( auth, liveChatId, pageToken, callback );

		}, pollingInterval);

		console.log( 'Polling in: ', pollingInterval );
	});
};

const _getMessages = function( accessToken, liveChatId, pageToken, callback )
{
	_youtube.liveChatMessages.list({ part: 'snippet', liveChatId: liveChatId, auth: accessToken, pageToken : pageToken, maxResults : 2000 }, callback );
};

exports.stop = function()
{
	clearTimeout( _currentStep );
	_currentStep = false;
};
