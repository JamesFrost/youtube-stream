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
		if( err && _areErrorsBlocking( err.errors ) )
		{
			callback( err, undefined );
			return;
		}

		if( response !== undefined )
			callback( undefined, response );

		const pollingInterval = response == undefined ? 10000 : response.pollingIntervalMillis;
		const pageToken = response == undefined ? undefined : response.nextPageToken;

		if( _currentStep === false )
			return;

		_currentStep = setTimeout(function()
		{
			_step( auth, liveChatId, pageToken, callback );

		}, pollingInterval);
	});
};

const _areErrorsBlocking = function( errors )
{
	if( errors.length === 0 )
		return false;

	const thisError = errors[ 0 ];

	var blocking = true;

	switch( thisError.reason ) 
	{
	    case 'liveChatDisabled':
	   		blocking = true;
	   		break;
	   	case 'rateLimitExceeded': 
	   		blocking = false;
	   		break;
	   	case 'liveChatNotFound':
	   		blocking = true;
	   		break;
	   	case 'forbidden':
	   		blocking = true;
	   		break;
	   	case 'liveChatEnded':
	   		blocking = true;
	   		break;
	}

	return _areErrorsBlocking( errors.slice( 1 ) ) || blocking;
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
