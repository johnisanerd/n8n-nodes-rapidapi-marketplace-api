# n8n-nodes-rapidapi-marketplace-api

An [n8n](https://n8n.io/) community node that searches the RapidAPI marketplace and returns structured API listings: name, pricing, category, popularity, success rate, publisher, and a link to each API. It is backed by the [RapidAPI Marketplace API](https://apify.com/johnvc/rapidapi-marketplace-api?fpr=9n7kx3) on [Apify](https://apify.com?fpr=9n7kx3) and bills per result, so there are no subscriptions and no minimums.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Output](#output) · [Example workflows](#example-workflows) · [Pricing](#pricing) · [Resources](#resources)

## What it does

Give the node a search term, and it returns one item per API with the name, pricing model, category, popularity score, success rate, publisher, and page URL. Turn on **Fetch Detailed Info** to enrich each result with billing plans, ratings, subscriber counts, readme text, and more. It also works as an **AI Agent tool**, so an agent can discover APIs on demand.

- Search the RapidAPI marketplace for any keyword
- Filter by category, and sort by relevance, trending, last updated, or alphabetical
- Extract a specific RapidAPI page or collection by URL
- Choose how much data to return per API: Simplified, Raw, or Selected Fields

## Installation

Follow the n8n [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. In n8n, open **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-rapidapi-marketplace-api` as the npm package name.
4. Agree to the risks of using community nodes, then select **Install**.

After it installs, the **RapidAPI Marketplace** node appears in the nodes panel.

> n8n Cloud only allows verified community nodes. Until this node is verified, install it on a self-hosted n8n instance.

## Credentials

You need a free [Apify account](https://apify.com?fpr=9n7kx3) and an API token.

1. Sign in to the [Apify Console](https://console.apify.com?fpr=9n7kx3).
2. Open **Settings > Integrations** and copy your **Personal API token**.
3. In n8n, create a new **Apify API** credential and paste the token.
4. Use the credential's **Test** button to confirm it works.

The node also supports **Apify OAuth2** if you prefer to connect that way.

## Operations

**API > Search** returns marketplace APIs that match a search term.

| Parameter | Description |
| --- | --- |
| Search Term | Keyword to search the marketplace for. Leave this and Listing URL empty to return all APIs. |
| Category | Optional. Restrict results to a single category, for example `Finance` or `Weather`. |
| Sort By | Relevance, Trending, Last Updated, or Alphabetical. |
| Sort Order | Ascending or Descending. |
| Maximum Results | How many API listings to return for the search term. |
| Fetch Detailed Info | Enrich each result with billing plans, ratings, readme, subscriber count, website, and long description. |
| Listing URL | Optional. A RapidAPI page or collection URL to extract directly. |
| Output | How much data to return: Simplified, Raw, or Selected Fields. |

## Output

Each API is returned as its own n8n item. The API returns more than ten fields per result, so the **Output** parameter lets you choose how much to return:

- **Simplified** (default): a compact object with `name`, `title`, `description`, `pricing`, `category`, `popularityScore`, `avgSuccessRate`, `publisher`, and `url`. This mode is also used automatically when the node runs as an AI Agent tool, to keep responses small.
- **Raw**: every field the API returns for each result, using the original field names below.
- **Selected Fields**: pick exactly which fields to include.

### Fields (Raw and Selected Fields)

| Field | Type | Description |
| --- | --- | --- |
| `result_type` | string | Row kind: `api_listing`, `api_detail`, or `error` |
| `id` | string | Unique RapidAPI identifier for the API |
| `name` | string | API name |
| `title` | string | Display title of the API |
| `description` | string | Short API description |
| `longDescription` | string | Extended API description (detail rows only) |
| `slugifiedName` | string | URL-friendly API slug |
| `pricing` | string | Pricing model (`FREE`, `FREEMIUM`, `PAID`, `PAYPERUSE`) |
| `category` | string | Primary marketplace category |
| `createdAt` | string | When the API was first published (detail rows only) |
| `updatedAt` | string | When the API was last updated |
| `status` | string | API lifecycle status (detail rows only) |
| `visibility` | string | API visibility on the marketplace |
| `apiType` | string | Transport type of the API (detail rows only) |
| `popularityScore` | number | RapidAPI popularity score (0 to 10) |
| `avgLatency` | number | Average response latency in milliseconds |
| `avgServiceLevel` | number | Average service level percentage |
| `avgSuccessRate` | number | Average request success rate percentage |
| `ratingScore` | number | Average user rating out of 5 (detail rows only) |
| `ratingVotes` | integer | Number of user ratings (detail rows only) |
| `subscriptionsCount` | integer | Number of marketplace subscribers (detail rows only) |
| `websiteUrl` | string | Publisher website (detail rows only) |
| `publisher` | string | API publisher name |
| `publisherUsername` | string | API publisher slug or username |
| `tags` | array | Version tags attached to the API |
| `billingPlans` | array | Full subscription plans with prices and quotas (detail rows only) |
| `versions` | array | API version history (detail rows only) |
| `readme` | string | API documentation readme text (detail rows only) |
| `thumbnail` | string | API thumbnail image URL |
| `url` | string | Public RapidAPI page for the API |
| `searchTerm` | string | The search term this row was returned for |
| `error_message` | string | Human-readable detail for error rows |

## Example workflows

### 1. Build a spreadsheet of APIs in a category

1. **Manual Trigger**.
2. **RapidAPI Marketplace**: Search Term `translation`, Sort By `Trending`, Output `Simplified`.
3. **Google Sheets** / **Airtable**: append `name`, `pricing`, `popularityScore`, and `url`.

### 2. Compare pricing and reliability across APIs

1. **Manual Trigger**.
2. **RapidAPI Marketplace**: your search term, **Fetch Detailed Info** on.
3. **Set**: keep `name`, `pricing`, `billingPlans`, `avgSuccessRate`, and `ratingScore` for a comparison table.

### 3. Let an AI Agent discover APIs

1. **AI Agent** node.
2. Attach **RapidAPI Marketplace** as a tool.
3. Ask "Find weather APIs with a free tier." The agent calls the node (in Simplified mode) and returns matching APIs.

## Pricing

This node calls the [RapidAPI Marketplace API](https://apify.com/johnvc/rapidapi-marketplace-api?fpr=9n7kx3) on Apify, which is billed **pay-per-result**, with no subscription and no minimums. Apify also includes a free monthly usage tier that covers typical volumes. See the [Actor page](https://apify.com/johnvc/rapidapi-marketplace-api?fpr=9n7kx3) for current rates.

## Resources

- [RapidAPI Marketplace API on Apify](https://apify.com/johnvc/rapidapi-marketplace-api?fpr=9n7kx3)
- [Python and MCP examples repo](https://github.com/johnisanerd/Apify-RapidAPI-Marketplace-API)
- [npm package](https://www.npmjs.com/package/n8n-nodes-rapidapi-marketplace-api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify n8n integration guide](https://docs.apify.com/platform/integrations/n8n)

## License

[MIT](LICENSE.md)
