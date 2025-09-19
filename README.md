# Schema Builder application

Functions of the application:
- loads given schema (/public/properties.json) into in-memory data store (schemaStore)
- schema preview - collapsible section that can be used for debugging and quick check whether the changes made are intended
- add property - can add object property on all levels (supports nested objects)
- edit property - can edit object property on all levels (supports nested objects)
- delete property - can delete object property on all levels

# Dynamic form
- based on the schema built in the Schema Builder
- enables user to fill in the form with expected values from the schema

How to start application:
```js
npm run dev
```

How to execute schema store tests:
```js
npm run test
```
