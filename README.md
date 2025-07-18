# RandomMon

RandomMon is a web game where you choose a random starter Pokémon from a list of 3 options, and after that, you must battle with randomly generated Pokémon. This project uses the **PokéAPI** to generate the Pokémon, and the battle moves.

Check out the API here: [PokéAPI](https://pokeapi.co/)

# Features

## Random Pokémon

Pokémon are randomly generated, so you need to win with the limited options.

## Random Moves

Moves and Attacks are randomly generated from the list of moves learned by the Pokémon, so you need to adapt with the resources you have.

## Random Enemies

Wild Pokémon are also randomly generated, so you'll need strategy to win battles.

# Mechanics

## Battles

In the game, you can battle wild Pokémon in a turn-based format and use damaging moves to lower the enemy Pokémon's HP. Moves that cause status or conditions other than damage will also be implemented.

## Rewards

After winning each battle, you can choose between three options:

- Heal your current Pokémon.

- Attempt to capture the defeated Pokémon.

- Receive a bonus to a random attribute.

## Switching Pokémon

During battle, you can switch your active Pokémon for another one on your team, providing a greater strategic range during fights.

# FOR FUTURE UPDATES

- ( ) Status moves.
- ( ) Game Balance.
- ( ) Better progression.
- ( ) More roguelike mechanics for the rewards.

# Disclaimer

Pokémon and Pokémon character names are trademarks of Nintendo.

# Technologies Used
- React
- TypeScript
- API Consumption
- TailwindCSS


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
