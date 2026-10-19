# Google Maps Contacts for n8n

Build local-business lists by category and area, then optionally add public contact details and website-quality signals. Every returned business becomes a separate n8n item.

## Install

In n8n, open **Settings → Community Nodes → Install** and enter `n8n-nodes-apivault-google-maps-contacts`. Add an **Apify API** credential, then select it in the node.

## Quickstart

Import [`examples/quickstart-workflow.json`](examples/quickstart-workflow.json), choose a country, city and business category, select your credential, and run it. The final node prepares clean CRM rows with the best available public contact fields.

## Useful workflows

- local lead generation;
- businesses without websites or booking tools;
- territory research;
- recurring new-business monitoring.

Runs use the hosted [Google Maps Contacts Actor](https://apify.com/apivault_labs/google-maps-scraper-emails-contact-details-leads). Actor usage is billed separately on Apify.

## License

[MIT](LICENSE)

<!-- apivault-integrations:start -->
## Hosted Actor and integrations

- [Run Google Maps Scraper — Business Emails & Phones API on Apify](https://apify.com/apivault_labs/google-maps-scraper-emails-contact-details-leads).
- [Current pricing and usage terms](https://apify.com/apivault_labs/google-maps-scraper-emails-contact-details-leads/pricing).
- [n8n community package: n8n-nodes-apivault-google-maps-contacts](https://www.npmjs.com/package/n8n-nodes-apivault-google-maps-contacts).
- [Python client](https://github.com/apivault-labs/apivault-labs/tree/main/python-clients/apivault-google-maps-scraper-emails-contact-details-leads).
- [n8n source and usage](https://github.com/apivault-labs/apivault-labs/tree/main/community-nodes/n8n-nodes-apivault-google-maps-contacts).

An Apify account and API token are required. Hosted Actor/platform charges apply. npm publication is not n8n verification or confirmation of n8n Cloud availability.
<!-- apivault-integrations:end -->
