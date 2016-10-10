const _oauth = require( 'googleapis' ).auth.OAuth2;

exports.connect = function( oauth, accessToken, liveChatId, callback )
{
	const oauthClient = _getOAuthClient( oauth );

	oauthClient.setCredentials({
	  access_token: accessToken
	});

	const _responseHandler = _curryHandleResponse( callback );

	const stream = require( './src/stream.js' );

	stream._init( oauthClient, liveChatId, _responseHandler );

	return stream;
};

const _curryHandleResponse = function( callback )
{
	return function( err, response )
	{
		_handleResponse( err, response, callback );
	};
};

const _handleResponse = function( err, response, callback )
{
	if( err )
	{
		callback( err );
		return;
	}

	response.items.map(function( thisMessage )
	{
		callback( err, thisMessage );
	});
};

const _getOAuthClient = function( oauth )
{
	return new _oauth(oauth.client_id, oauth.client_secret, oauth.redirect_uris[0]);
};
