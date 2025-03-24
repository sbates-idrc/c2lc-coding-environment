# Checklist for adding a new world

- Export world backgrounds, thumbnails, and characters from Figma as SVGs;
  there should be 9 SVG files for each world, use the following naming
  convention:
  - `src/svg/<WorldName>.svg`
  - `src/svg/<WorldName>Gray.svg`
  - `src/svg/<WorldName>Contrast.svg`
  - `src/svg/<WorldName>Thumbnail.svg`
  - `src/svg/<WorldName>ThumbnailGray.svg`
  - `src/svg/<WorldName>ThumbnailContrast.svg`
  - `src/svg/<WorldName><CharacterName>.svg`
  - `src/svg/<WorldName><CharacterName>Gray.svg`
  - `src/svg/<WorldName><CharacterName>Contrast.svg`
- Add an entry for the new world to `Worlds.js`
  - Each value in the `backgroundInfo` object is a key to look up in the
    `messages.json` file
- Add an entry for the new world to the `availableWorldOptions` list property
  of `WorldSelector.js`
  - Worlds are ordered alphabetically, except for `Sketchpad` which is
    always first
- Update the
  `'All worlds should be displayed as options and only one is checked'`
  test in `WorldSelector.test.js` for the new world
- Add entries to `messages.json`
  - `UI.<WorldName>.name`: the name of the world
  - `<WorldName>.character`: the name of the character
  - `<WorldName>.label`: the label used for the world in the
    Scene Background dialog
  - `<WorldName>.<CellInfo>`: add one entry for each type of
    cell in the world's `backgroundInfo`; these `messages.json` entries are
    used to localize the cell descriptions
- To facilitate styling of the thumbnail when hovered in the Scene Background
  dialog, add a `className` attribute to those elements of the thumbnail
  SVGs that should be styled differently on hover
- Add styles to `Worlds.scss`
  - Styles for Default, Grayscale, and High Contrast themes (at least,
    adding styles for any other themes as needed)
  - Character background in the Program Block Editor
  - Grid line colour
  - Drawing and character starting point colour
  - Thumbnail hover colours
