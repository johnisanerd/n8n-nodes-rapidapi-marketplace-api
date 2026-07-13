import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

/**
 * Build the Apify Actor input from node parameters.
 * Only the real Actor inputs are sent; the Output / Fields parameters shape the
 * data we return, they are not part of the Actor input.
 */
export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	const searchTerm = (context.getNodeParameter('searchTerm', itemIndex, '') as string).trim();
	const category = (context.getNodeParameter('category', itemIndex, '') as string).trim();
	const listingUrl = (context.getNodeParameter('listingUrl', itemIndex, '') as string).trim();

	const input: Record<string, any> = {
		...defaultInput,
		sortBy: context.getNodeParameter('sortBy', itemIndex),
		order: context.getNodeParameter('order', itemIndex),
		maxResults: context.getNodeParameter('maxResults', itemIndex),
		detailedInfo: context.getNodeParameter('detailedInfo', itemIndex),
	};

	if (searchTerm) {
		input.searchTerms = [searchTerm];
	} else {
		delete input.searchTerms;
	}

	if (category) {
		input.category = category;
	} else {
		delete input.category;
	}

	if (listingUrl) {
		input.listingUrls = [listingUrl];
	} else {
		delete input.listingUrls;
	}

	return input;
}

const resourceProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'API',
				value: 'api',
			},
		],
		default: 'api',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['api'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search the marketplace',
				description: 'Search the marketplace and return one item per API',
			},
		],
		default: 'search',
	},
];

const actorProperties: INodeProperties[] = [
	{
		displayName: 'Search Term',
		name: 'searchTerm',
		type: 'string',
		default: '',
		placeholder: 'e.g. weather',
		description:
			'Keyword to search the marketplace for. Leave this and Listing URL empty to return all APIs.',
		displayOptions: { show: { resource: ['api'], operation: ['search'] } },
	},
	{
		displayName: 'Category',
		name: 'category',
		type: 'string',
		default: '',
		placeholder: 'e.g. Finance',
		description:
			'Optional. Restrict results to a single category, using the exact name shown on RapidAPI (for example Data, Business, Finance, Weather). Leave empty for all categories.',
		displayOptions: { show: { resource: ['api'], operation: ['search'] } },
	},
	{
		displayName: 'Sort By',
		name: 'sortBy',
		type: 'options',
		options: [
			{ name: 'Alphabetical', value: 'ByAlphabetical' },
			{ name: 'Last Updated', value: 'ByUpdatedAt' },
			{ name: 'Relevance', value: 'ByRelevance' },
			{ name: 'Trending', value: 'ByTrending' },
		],
		default: 'ByRelevance',
		description: 'How to sort search results',
		displayOptions: { show: { resource: ['api'], operation: ['search'] } },
	},
	{
		displayName: 'Sort Order',
		name: 'order',
		type: 'options',
		options: [
			{ name: 'Ascending', value: 'ASC' },
			{ name: 'Descending', value: 'DESC' },
		],
		default: 'ASC',
		description: 'Sort direction for the chosen sort field',
		displayOptions: { show: { resource: ['api'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Results',
		name: 'maxResults',
		type: 'number',
		default: 100,
		typeOptions: { minValue: 1, maxValue: 1000 },
		description:
			'How many API listings to return for the search term (the marketplace caps a single search at 1000)',
		displayOptions: { show: { resource: ['api'], operation: ['search'] } },
	},
	{
		displayName: 'Fetch Detailed Info',
		name: 'detailedInfo',
		type: 'boolean',
		default: false,
		description:
			'Whether to enrich each result with full detail (billing plans, rating, readme, subscriber count, website and long description). This is slower and billed at the higher per-detail rate.',
		displayOptions: { show: { resource: ['api'], operation: ['search'] } },
	},
	{
		displayName: 'Listing URL',
		name: 'listingUrl',
		type: 'string',
		default: '',
		placeholder: 'e.g. https://rapidapi.com/meteostat/api/meteostat',
		description:
			'Optional. A RapidAPI page or collection URL to extract directly. Listing URLs always return detailed info.',
		displayOptions: { show: { resource: ['api'], operation: ['search'] } },
	},
];

const outputProperties: INodeProperties[] = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['api'], operation: ['search'] } },
		options: [
			{
				name: 'Raw',
				value: 'raw',
				description: 'Return every field the API produces for each result',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose exactly which fields to return',
			},
			{
				name: 'Simplified',
				value: 'simplified',
				description: 'Return a compact set of the most useful API fields',
			},
		],
		default: 'simplified',
		description: 'How much data to return for each result',
	},
	{
		displayName: 'Fields to Include',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: { resource: ['api'], operation: ['search'], output: ['selected'] },
		},
		options: [
			{ name: 'API ID', value: 'id' },
			{ name: 'API Type', value: 'apiType' },
			{ name: 'Avg Latency (Ms)', value: 'avgLatency' },
			{ name: 'Avg Service Level', value: 'avgServiceLevel' },
			{ name: 'Avg Success Rate', value: 'avgSuccessRate' },
			{ name: 'Billing Plans', value: 'billingPlans' },
			{ name: 'Category', value: 'category' },
			{ name: 'Created At', value: 'createdAt' },
			{ name: 'Description', value: 'description' },
			{ name: 'Error Message', value: 'error_message' },
			{ name: 'Long Description', value: 'longDescription' },
			{ name: 'Name', value: 'name' },
			{ name: 'Popularity Score', value: 'popularityScore' },
			{ name: 'Pricing', value: 'pricing' },
			{ name: 'Publisher', value: 'publisher' },
			{ name: 'Publisher Username', value: 'publisherUsername' },
			{ name: 'Rating Score', value: 'ratingScore' },
			{ name: 'Rating Votes', value: 'ratingVotes' },
			{ name: 'Readme', value: 'readme' },
			{ name: 'Result Type', value: 'result_type' },
			{ name: 'Search Term', value: 'searchTerm' },
			{ name: 'Slug', value: 'slugifiedName' },
			{ name: 'Status', value: 'status' },
			{ name: 'Subscribers', value: 'subscriptionsCount' },
			{ name: 'Tags', value: 'tags' },
			{ name: 'Thumbnail', value: 'thumbnail' },
			{ name: 'Title', value: 'title' },
			{ name: 'Updated At', value: 'updatedAt' },
			{ name: 'URL', value: 'url' },
			{ name: 'Versions', value: 'versions' },
			{ name: 'Visibility', value: 'visibility' },
			{ name: 'Website URL', value: 'websiteUrl' },
		],
		default: ['name', 'pricing', 'category', 'popularityScore', 'url'],
		description: 'Which fields to return when Output is set to Selected Fields',
	},
];

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const properties: INodeProperties[] = [
	...resourceProperties,
	...actorProperties,
	...outputProperties,
	...authenticationProperties,
];
