
# Assignment: Multi-level Data Schema Editor

You will be working with a data schema structure (see `properties.json`) and your main goal is to create an interactive editor for this schema. The assignment emphasizes good UX for deeply nested structures and strict separation between UI state and the schema data storage.

**Main task:**
Your goal is to create an editor for a data **schema**, not for the data itself. You will be working exclusively with the schema structure defined in `properties.json` (not with `data.json`).

The application must allow users to visualize and edit the schema (structure, types, descriptions, etc.) as defined in `properties.json`. 

**The UI must never save the entire schema object at once. Instead, all changes (add property, edit description, delete property, etc.) must be performed by calling specific methods that operate on a global in-memory store.**

**Note:** Editing or entering data according to the schema (e.g., working with `data.json`) is a separate, bonus task described below. The main focus is on the schema editor for `properties.json`.

**Technology requirements:**
- Use **React** and **Typescript** for the implementation.
- The code should be properly tested.

## Architecture and functionality requirements

- **Global schema store:**
  - Store the schema in a global in-memory store and expose only granular methods for manipulation.
  - For each operation (e.g., add property, edit name, change type, delete property), create a separate method. It is not allowed to replace or mutate the entire schema object at once.
  - Every change in the UI must be performed by calling the corresponding method of the schema store.
  - The schema store should be easily extensible and testable.

- **Frontend:**
  - Display the schema in a clear form (e.g., tree structure) that is usable even for deep structures (5 or more levels).
  - Allow editing the name, description, and type of each property at all levels (including nested objects and array items).
  - Allow adding new properties at any level (root, objects, arrays).
  - Allow deleting properties at all levels (root, objects, arrays).
  - Support types `string`, `integer`, `boolean`, `object`, `array` and their arbitrary combinations (arrays and objects can contain other arrays/objects, etc.).
  - Allow setting other relevant property attributes, e.g., allowed string values (`enum`) or value types (`items` for arrays and `properties` for objects).
  - Every change in the UI must be performed by calling the corresponding method of the schema store.

- **UX requirements:**
  - The UI must be clear and easy to use, even for deep and complex structures.
  - Focus on usability and clarity (e.g., collapsible sections, breadcrumbs, highlighting the active level, etc.).

- **Other:**
  - The code should be clear, well-structured, and easily extensible.

## Bonus task: Data entry view (optional)

- Create a second view that, according to the defined schema, allows users to enter data (work with `data.json`).
- The data entry form will be used by less technically skilled users. The form must be fully interactive and user-friendly.
- At no point should the user be required to write or edit JSON (or other prescribed syntax for data structures).
- Store data in a global in-memory store.
- As with the schema, changes must be made using individual methods, not by sending or replacing the entire data object at once.

## Input files

- The schema to be edited is in `properties.json` (main task).
- Sample data according to the schema is in `data.json` (for the bonus task only).

