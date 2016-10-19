const _oauth = require( 'googleapis' ).auth.OAuth2;

exports.connect = function( oauth, youtubeCreds, liveChatId, callback )
{
	const oauthClient = _getOAuthClient( oauth );

	oauthClient.setCredentials({
	  access_token: youtubeCreds.access_token,
	  refresh_token: youtubeCreds.refresh_token,
	  expiry_token: youtubeCreds.token_expiry
	});

	const responseHandler = _curryHandleResponse( callback );

	const stream = require( './src/stream.js' );

	stream._init( oauthClient, liveChatId, responseHandler );

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
	
	if(response !== null)
	{
		if( typeof response.access_token !== undefined)
			callback(undefined, response);
		else if( response.items.length > 0 )
		{
			callback( undefined, response.items );
		}
	}
};

const _getOAuthClient = function( oauth )
{
	return new _oauth( oauth.client_id, oauth.client_secret, oauth.redirect_uris[0] );
};
