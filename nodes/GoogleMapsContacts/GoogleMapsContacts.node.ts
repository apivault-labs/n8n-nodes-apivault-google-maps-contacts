import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const ACTOR_ID = 'apivault_labs~google-maps-scraper-emails-contact-details-leads';

export class GoogleMapsContacts implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Google Maps Contacts",
		name: "googleMapsContacts",
		icon: 'file:googlemapscontacts.svg',
		group: ['transform'],
		version: 1,
		description: "Fast Google Maps scraper & extractor for local business leads in bulk. Pull places with emails, phone numbers, contact details, websites and ratings — incl. no-website leads for agencies. Search any city, category or area. Export CSV/JSON. From $1.25/1K. No Google API key.",
		defaults: { name: "Google Maps Contacts" },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'apifyApi', required: true }],
		properties: [
   {
      "displayName": "Country",
      "name": "country",
      "description": "Country code (ISO 3166-1 alpha-2, e.g. 'us', 'gb', 'de'). Scopes the city lookup and localizes Google results.",
      "type": "string",
      "default": "us"
   },
   {
      "displayName": "City",
      "name": "city",
      "description": "City to collect, for example `Chicago`, `Toronto`, or `Berlin`. Leave empty when using coordinates or a bounding box.",
      "type": "string",
      "default": "Boise"
   },
   {
      "displayName": "State / region (optional)",
      "name": "state",
      "description": "Narrows the city lookup, e.g. 'Illinois' for Springfield.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Postal / ZIP code (optional)",
      "name": "postalCode",
      "description": "Target a single postal code instead of a whole city.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Search terms / business categories",
      "name": "categories",
      "description": "Select one or more common business categories. Each selected category expands city coverage and can increase the number of results. Enter one value per line or separate values with commas.",
      "type": "string",
      "typeOptions": {
         "rows": 3
      },
      "default": "restaurant\ncafe\nbar\nbakery\nfast food restaurant\npizza restaurant\nhotel\nmotel\ndentist\ndoctor\nmedical clinic\npharmacy\nchiropractor\nphysiotherapist\npsychologist\nveterinarian\nhair salon\nbarber shop\nbeauty salon\nnail salon\nspa\nmassage therapist\nfitness center\ngym\nplumber\nelectrician\nHVAC contractor\nroofing contractor\ngeneral contractor\npainter\nlandscaper\ncleaning service\npest control service\nlocksmith\nauto repair shop\ncar dealer\nused car dealer\ntire shop\nauto body shop\ncar wash\ntowing service\ncar rental agency\nreal estate agency\nproperty management company\nmortgage broker\ninsurance agency\nlawyer\naccountant\ntax preparation service\nfinancial advisor\nmarketing agency\nadvertising agency\nweb design company\nsoftware company\nIT support service\nbusiness consultant\nemployment agency\ncoworking space\nretail store\nclothing store\nfurniture store\nelectronics store\nhardware store\nflorist\njewelry store\npet store\nschool\nday care center\ndriving school\nphotographer\nevent planner\nwedding venue\ntravel agency\nmoving company"
   },
   {
      "displayName": "Custom search terms (optional)",
      "name": "customSearchTerms",
      "description": "Add categories or niche search phrases that are not available in the list above. Enter one value per line or separate values with commas.",
      "type": "string",
      "typeOptions": {
         "rows": 3
      },
      "default": ""
   },
   {
      "displayName": "Website",
      "name": "websiteFilter",
      "description": "Keep all businesses, only those WITHOUT a website, or only those WITH one.",
      "type": "options",
      "options": [
         {
            "name": "All businesses",
            "value": "any"
         },
         {
            "name": "Only without a website",
            "value": "without"
         },
         {
            "name": "Only with a website",
            "value": "with"
         }
      ],
      "default": "any"
   },
   {
      "displayName": "Only businesses with a phone",
      "name": "requirePhone",
      "description": "Keep only leads that expose a public phone number.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Only businesses without online booking",
      "name": "onlyNoBooking",
      "description": "Keep only businesses with no booking system (no Reserve with Google, no third-party platform).",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Only businesses open now",
      "name": "openNowOnly",
      "description": "Keep only places Google currently marks as open. Places with unknown opening status are excluded.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Skip closed businesses",
      "name": "skipClosedPlaces",
      "description": "Exclude businesses Google marks with a closed status.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Minimum rating",
      "name": "minRating",
      "description": "Keep only businesses rated at or above this (1-5). Unrated businesses are excluded when set.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 5
      }
   },
   {
      "displayName": "Maximum rating",
      "name": "maxRating",
      "description": "Keep only businesses rated at or below this (1-5) вЂ” find reputation problems to fix.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 5
      }
   },
   {
      "displayName": "Minimum review count",
      "name": "minReviews",
      "description": "Keep only businesses with at least this many Google reviews. Unreviewed businesses are excluded when set.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Maximum review count",
      "name": "maxReviews",
      "description": "Keep only businesses with no more than this many Google reviews. Leave empty or zero for no upper limit.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0
      }
   },
   {
      "displayName": "Business name filter",
      "name": "nameFilter",
      "description": "Optional text to match against the business name, for example 'Hilton' or 'McDonald’s'.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Business name matching",
      "name": "nameMatching",
      "description": "Match the name exactly or keep names containing the filter text.",
      "type": "options",
      "options": [
         {
            "name": "Contains text",
            "value": "includes"
         },
         {
            "name": "Exact name",
            "value": "exact"
         }
      ],
      "default": "includes"
   },
   {
      "displayName": "Filter by Google's own category (optional)",
      "name": "googleCategoryFilter",
      "description": "Keep only businesses whose Google category contains any of these words, e.g. 'pizza'. Enter one value per line or separate values with commas.",
      "type": "string",
      "typeOptions": {
         "rows": 3
      },
      "default": ""
   },
   {
      "displayName": "Enrich leads (email, socials, buy-intent signals)",
      "name": "enrich",
      "description": "Visit each business website to pull the best email, socials, CMS, and website problems (no HTTPS, expired SSL, no mobile, outdated CMS, no booking, hiring). Adds a priority score and a suggested offer, and sorts highest-intent first. Slower.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Enrichment depth",
      "name": "enrichmentMode",
      "description": "Fast contacts finds email and social profiles with high parallelism. Full website audit also checks CMS, SSL, mobile readiness, speed, booking, and hiring signals.",
      "type": "options",
      "options": [
         {
            "name": "Fast contacts",
            "value": "contacts"
         },
         {
            "name": "Full website audit",
            "value": "full"
         }
      ],
      "default": "contacts"
   },
   {
      "displayName": "Verify emails",
      "name": "verifyEmails",
      "description": "Drop malformed, disposable, and no-DNS addresses so what you get is mailable. Requires enrichment.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Only leads with an email",
      "name": "requireEmail",
      "description": "Keep only leads where an email was found. Requires enrichment.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Minimum priority score",
      "name": "minPriorityScore",
      "description": "Keep only leads scoring at or above this (0-100). Requires enrichment.",
      "type": "number",
      "default": 0,
      "typeOptions": {
         "minValue": 0,
         "maxValue": 100
      }
   },
   {
      "displayName": "Track changes across runs (monitor mode)",
      "name": "trackChanges",
      "description": "Remember businesses between runs and tag each lead new / changed / unchanged (with first-seen / last-seen). Ideal on a schedule.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Only fresh leads (new or changed)",
      "name": "onlyFresh",
      "description": "With monitor mode on, return only leads new or changed since the last run. Ignored if monitor mode is off.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Maximum places to extract",
      "name": "maxResults",
      "description": "Safety cap applied before website/email enrichment. Filters such as Only leads with an email, verified email, minimum score, website, phone, rating, or fresh-only monitoring can reduce the final number of Dataset rows below this value.",
      "type": "number",
      "default": 5000,
      "typeOptions": {
         "minValue": 1,
         "maxValue": 200000
      }
   },
   {
      "displayName": "Fast mode",
      "name": "fastMode",
      "description": "Return a quick sample for validation and lightweight workflows. Use standard mode for broader coverage.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Search contact and about pages",
      "name": "deepContactPages",
      "description": "When the homepage has no email, inspect likely contact and about pages. Improves email coverage but makes enrichment slower.",
      "type": "boolean",
      "default": false
   },
   {
      "displayName": "Results language (optional)",
      "name": "language",
      "description": "Language code for result labels (e.g. 'en', 'de'). Empty = the country's own language.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Custom center latitude (advanced)",
      "name": "lat",
      "description": "Center latitude. Example: `41.8781`. To search by coordinates, also provide Longitude and Area span. Coordinates override City.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Custom center longitude (advanced)",
      "name": "lng",
      "description": "Center longitude. Example: `-87.6298`. Used together with Latitude and Area span.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Area span in degrees (advanced)",
      "name": "span",
      "description": "Area width in degrees around the center. Example: `0.20` is roughly a medium-sized city area. Used only with custom coordinates.",
      "type": "string",
      "default": ""
   },
   {
      "displayName": "Bounding box north (advanced)",
      "name": "north",
      "description": "Northern edge. Set north, south, east and west together to define an exact rectangle. The bounding box overrides both city and center coordinates.",
      "type": "number",
      "default": 0
   },
   {
      "displayName": "Bounding box south (advanced)",
      "name": "south",
      "description": "Southern latitude.",
      "type": "number",
      "default": 0
   },
   {
      "displayName": "Bounding box east (advanced)",
      "name": "east",
      "description": "Eastern longitude. Dateline-crossing boxes are not supported.",
      "type": "number",
      "default": 0
   },
   {
      "displayName": "Bounding box west (advanced)",
      "name": "west",
      "description": "Western longitude.",
      "type": "number",
      "default": 0
   }
],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			try {
				const body: Record<string, unknown> = {};
				body["country"] = this.getNodeParameter("country", i);
				{ const value = this.getNodeParameter("city", i, '') as string; if (value.trim()) body["city"] = value.trim(); }
				{ const value = this.getNodeParameter("state", i, '') as string; if (value.trim()) body["state"] = value.trim(); }
				{ const value = this.getNodeParameter("postalCode", i, '') as string; if (value.trim()) body["postalCode"] = value.trim(); }
				{ const value = this.getNodeParameter("categories", i, '') as string; const values = value.split(/[,\n]/).map((entry) => entry.trim()).filter(Boolean); if (values.length) body["categories"] = values; }
				{ const value = this.getNodeParameter("customSearchTerms", i, '') as string; const values = value.split(/[,\n]/).map((entry) => entry.trim()).filter(Boolean); if (values.length) body["customSearchTerms"] = values; }
				body["websiteFilter"] = this.getNodeParameter("websiteFilter", i);
				body["requirePhone"] = this.getNodeParameter("requirePhone", i);
				body["onlyNoBooking"] = this.getNodeParameter("onlyNoBooking", i);
				body["openNowOnly"] = this.getNodeParameter("openNowOnly", i);
				body["skipClosedPlaces"] = this.getNodeParameter("skipClosedPlaces", i);
				{ const value = this.getNodeParameter("minRating", i, 0) as number; if (value !== 0) body["minRating"] = value; }
				{ const value = this.getNodeParameter("maxRating", i, 0) as number; if (value !== 0) body["maxRating"] = value; }
				{ const value = this.getNodeParameter("minReviews", i, 0) as number; if (value !== 0) body["minReviews"] = value; }
				{ const value = this.getNodeParameter("maxReviews", i, 0) as number; if (value !== 0) body["maxReviews"] = value; }
				{ const value = this.getNodeParameter("nameFilter", i, '') as string; if (value.trim()) body["nameFilter"] = value.trim(); }
				body["nameMatching"] = this.getNodeParameter("nameMatching", i);
				{ const value = this.getNodeParameter("googleCategoryFilter", i, '') as string; const values = value.split(/[,\n]/).map((entry) => entry.trim()).filter(Boolean); if (values.length) body["googleCategoryFilter"] = values; }
				body["enrich"] = this.getNodeParameter("enrich", i);
				body["enrichmentMode"] = this.getNodeParameter("enrichmentMode", i);
				body["verifyEmails"] = this.getNodeParameter("verifyEmails", i);
				body["requireEmail"] = this.getNodeParameter("requireEmail", i);
				{ const value = this.getNodeParameter("minPriorityScore", i, 0) as number; if (value !== 0) body["minPriorityScore"] = value; }
				body["trackChanges"] = this.getNodeParameter("trackChanges", i);
				body["onlyFresh"] = this.getNodeParameter("onlyFresh", i);
				body["maxResults"] = this.getNodeParameter("maxResults", i);
				body["fastMode"] = this.getNodeParameter("fastMode", i);
				body["deepContactPages"] = this.getNodeParameter("deepContactPages", i);
				{ const value = this.getNodeParameter("language", i, '') as string; if (value.trim()) body["language"] = value.trim(); }
				{ const value = this.getNodeParameter("lat", i, '') as string; if (value.trim()) body["lat"] = value.trim(); }
				{ const value = this.getNodeParameter("lng", i, '') as string; if (value.trim()) body["lng"] = value.trim(); }
				{ const value = this.getNodeParameter("span", i, '') as string; if (value.trim()) body["span"] = value.trim(); }
				{ const value = this.getNodeParameter("north", i, 0) as number; if (value !== 0) body["north"] = value; }
				{ const value = this.getNodeParameter("south", i, 0) as number; if (value !== 0) body["south"] = value; }
				{ const value = this.getNodeParameter("east", i, 0) as number; if (value !== 0) body["east"] = value; }
				{ const value = this.getNodeParameter("west", i, 0) as number; if (value !== 0) body["west"] = value; }
				const options: IRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items`,
					body,
					json: true,
				};
				const response = await this.helpers.requestWithAuthentication.call(this, 'apifyApi', options);
				const results = Array.isArray(response) ? response : [response];
				for (const result of results) returnData.push({ json: result, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}
		return [returnData];
	}
}
