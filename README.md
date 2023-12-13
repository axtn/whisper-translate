# Whisper Translate

Plug 'n play private translation website using [`Google Translate API Basic`](https://cloud.google.com/translate). Everything you translate on https://translate.google.com operates under Google's Global Privacy Policy, which means they can store and view your translations. This project allows you to use Google Translate API easily for your own private translations. As a business offering, Google Translate API operates under [`its own specific privacy policy`](https://cloud.google.com/translate/data-usage).

![Whisper Demo](https://github.com/axtn/whisper-translate/assets/6938887/853e0310-0f1c-494b-8b4f-b2aca351f32e)

## Features
* Language -> Language text translation
* Supports all Google Translate languages
* Auto detect source language
* Auto translates while typing
* Swapping languages
* Copying translated text
* Built with SvelteKit. Serverless platform support.
* Mobile friendly
* Typescript typed

### Prerequisites
* Enable Translation API Basic in your Google Cloud account.
* Create an API key in Google Cloud linked to Translation API Basic (this can be done from the credentials page).
* Info: Google translate API provides a certain amount of free translation a month, so your usage may be free. See the pricing [`here`](https://cloud.google.com/translate/pricing).

### Running Locally
* Fork this repo and clone it to your machine.
* Create a .env file in the root.
* Add the following keys.
```
API_KEY="xxxxxxxx"
PROJECT_ID="xxxxxxxx"
```
* `npm i`
* `npm run dev`

### Running on Vercel
* Fork this repo.
* Create a project in Vercel linked to your forked repo. Vercel should auto-detect this as a SvelteKit project.
* Create two env variables.
```
API_KEY="xxxxxxxx"
PROJECT_ID="xxxxxxxx"
```
* Beware of sharing the URL as you can incur costs from abuse of the API (there is a meta tag in the code to protect from SEO crawlers).
