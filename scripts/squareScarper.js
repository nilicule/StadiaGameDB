// Run from https://stadia.google.com/store/list/3?hl=en

var list = document.getElementsByClassName( 'alEDLe' ),
	holding = {},
	storage = {},
	filters = {
		'game of the year': 2,
		'goty': 2,
		'ultimate edition': 5,
		'digital deluxe': 5,
		'deluxe edition': 5,
		'gold edition': 5,
		'legendary edition': 5,
		'special edition': 5,
		'premium edition': 5,
		"collector's edition": 5,
		'platinum edition': 4,
		'standard edition': 0,
		'edition': 3,
		'deluxe': 4,
		'premium': 5,
		'ultimate': 5,
		'legendary': 5,
		'super deluxe': 5,
		'platinum': 3,
		'special': 3,
		'standard': 0,
		'season': 2,
		'gold': 1,
		'-': 1
	};

for ( l in list )
{
	if ( list.hasOwnProperty( l ) )
	{
		let games = list[l].children;

		for ( g in games )
		{
			if ( games.hasOwnProperty( g ) )
			{
				try
				{
					let id = games[g].getAttribute( 'data-app-id' );

					if ( !holding.hasOwnProperty( id ) )
					{
						holding[id] = {
							games: [],
							bundles: []
						};
					}

					let entry = { title: '' },
						gameChildren = games[g].getElementsByTagName( 'div' ),
						type = 'game';

					entry.square = games[g].getElementsByTagName( 'source' )[0].srcset;
					entry.wide = games[g].getElementsByTagName( 'img' )[0].src;

					for ( c in gameChildren )
					{
						if ( gameChildren.hasOwnProperty( c ) )
						{
							let titleFound = false,
								typeFound = false;
							if ( gameChildren[c].classList.contains( 'T2oslb' ) )
							{
								entry.title = gameChildren[c].innerText;
								titleFound = true;
							} else if ( gameChildren[c].classList.contains( 'vaa0f' ) )
							{
								type = gameChildren[c].innerText.toLowerCase().split( ', ' );
							}
							if ( titleFound && typeFound )
							{
								break;
							}
						}
					}
					if ( ( type.length == 1 && type[0] == 'game' ) || type.length > 1 && type.includes('game') )
					{
						holding[id].games.push( entry );
					}
					else
					{
						holding[id].bundles.push( entry );
					}
				}
				catch ( e )
				{
					console.error( 'Game image scraping error: ', e );
				}
			}
		}
	}
}

for ( id in holding )
{
	if ( holding.hasOwnProperty( id ) && ( holding[id].games.length > 0 || holding[id].bundles.length > 0 ) )
	{
		if ( holding[id].length == 1 )
		{
			if ( !storage.hasOwnProperty( id ) )
			{
				storage[id] = holding[id][0];
			}
		}
		else
		{
			let filtered = FilterContents( holding[id] );
			if ( filtered && !storage.hasOwnProperty( id ) )
			{
				storage[id] = FilterContents( holding[id] );
			}
		}
	}
}

console.log( storage );
console.log( JSON.stringify( storage ) );

function FilterContents( contents )
{
	let result = false,
		tempStore = {
			0: [],
			1: [],
			2: [],
			3: [],
			4: [],
			5: []
		};

	if ( contents.games.length > 0 )
	{
		for ( g in contents.games )
		{
			let gameStored = false;
			for ( f in filters )
			{
				let regex = new RegExp( '(^|\\s|\\:)' + f + '(\\s|\\:|$)', 'i' );
				if ( regex.test( contents.games[g].title ) )
				{
					tempStore[filters[f]].push( contents.games[g] );
					gameStored = true;
					break;
				}
			}
			if ( !gameStored &&  /((?<!^):\s)|([0-9]$)/.test( contents.games[g].title ) )
			{
				tempStore[1].push( contents.games[g] );
				gameStored = true;
			}
			if ( !gameStored )
			{
				tempStore[0].push( contents.games[g] );
			}
		}
	}
	else if ( contents.bundles.length > 0 )
	{
		for ( b in contents.bundles )
		{
			let gameStored = false;
			for ( f in filters )
			{
				let regex = new RegExp( '(^|\\s|\\:)' + f + '(\\s|\\:|$)', 'i' );
				if ( regex.test( contents.bundles[b].title ) )
				{
					tempStore[filters[f]].push( contents.bundles[b] );
					gameStored = true;
					break;
				}
			}
			if ( !gameStored && /((?<!^):\s)|([0-9]$)/.test( contents.bundles[b].title ) )
			{
				tempStore[1].push( contents.bundles[b] );
				gameStored = true;
			}
			if ( !gameStored )
			{
				tempStore[0].push( contents.bundles[b] );
			}
		}
	}

	for ( ts in tempStore )
	{
		if ( tempStore.hasOwnProperty( ts ) && tempStore[ts].length > 0 )
		{
			result = tempStore[ts][0];
			break;
		}
	}

	return result;
}