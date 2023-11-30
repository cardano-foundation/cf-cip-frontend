## Cardano CIP Frontend
We wanted to build a CIP Frontend as open and inclusive as Cardano. A repository that is in the hands of the Cardano community and can be constantly evolved by it.

For this to be successful, the repository relies on your contributions, and the fact that you are reading this text probably means that you have something to contribute.

## Clone the repo
```console
git clone https://github.com/cardano-foundation/cf-cip-frontend.git
```

## Navigate into the folder
```console
cd cf-cip-frontend
```

## Install all dependencies
```console
npm install
```

## Github Access Token
In order to run the project and fetch data from CIP repository, you will need to get Github personal access token.

To obtain it, go to your account settings, navigate to `Developer settings` select `Personal access tokens` click `Generate token` configure the required settings

Now create an `.env.local` file and copy the example from `.env.example`

Your `.env.local` should look like this:

```console
GITHUB_TOKEN=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```

## Production build

Create at least once a production build (as this pulls missing files)
```console
npm run build
```

## Local development

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.
```console
npm run dev
```
