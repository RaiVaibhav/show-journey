# Visualise journey

Main Branch
[![Netlify Status]()


## Setup and Build

Install `nvm`

  ```ubuntu
  $ cd show-journey
  $ nvm use
  $ npm install
  $ npm start
  ```
For production build kindly run - `npm run build` and that will creates a `build` directory with a production build of the app, kindly serve this file with

```
$ npm install -g serve
$ serve -s build
```

For Testing

  ```
  $ npm run start
  $ npm test
  ```
## Directort Structure

- file/directory NAME - `camelCase`, file extension - `tsx` for typescipt and react and `ts` for typescript files
- `src/`
  - `components` - for reusable components i.e., `<SearchInput />, <HomePageBackground />

## APP Dependency

- **CSS** - `tailwindcss` - why? - for readibility, easiness and to avoid css overwriding complexity
- **JS** - React, mapbox gl