# Root Cause Detection Backend

> Meraki root cause detection backend built with [Moleculer](https://moleculer.services).

[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

## NPM scripts

```bash
# Start development mode (load all services locally with hot-reload & REPL)
$ yarn dev

# Uses typescript to transpile service to javascript
yarn build

# Start production mode (set `SERVICES` env variable to load certain services) (previous build needed)
yarn start

# Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
yarn cli

# Run TSLint
yarn lint

# Run continuous test mode with watching
yarn ci

# Run tests & generate coverage report
yarn test
```

## Requirements

- [Node.js v12](https://nodejs.org/en/)
- Application works best if its running as a single-node local-services instance. Otherwise one needs to adapt the meraki mixin and the bottleneck logic to guarantee the 5req/sec restriction to the meraki api.

## Development Setup

1. Copy `.env.example` to `.env` and change values accordingly
1. Run `yarn dev`

## Production

1. `yarn build`
1. `yarn start`

## Environment Variables

- `MERAKI_API_KEY` Secret meraki key to access meraki rest api
- `PORT` on which port to start backend
- `MERAKI_WEBHOOK_SECRET` secret the meraki webhook alert has to match (leave empty to skip secret validation)
