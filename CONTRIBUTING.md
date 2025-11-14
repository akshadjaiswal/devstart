# Contributing to DevStart CLI

First off, thank you for considering contributing to DevStart CLI! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (commands you ran, configuration you used)
- **Describe the behavior you observed** and what you expected to see
- **Include your environment details** (OS, Node version, npm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most users
- **List some examples** of how it would be used

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure your code follows the existing style
4. Write a clear commit message
5. Open a pull request with a clear title and description

## Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/devstart-cli.git
cd devstart-cli
```

2. **Install dependencies:**
```bash
npm install
```

3. **Link the CLI locally:**
```bash
npm link
```

4. **Test your changes:**
```bash
devstart init
```

## Project Structure

```
devstart/
├── bin/
│   └── index.js           # CLI entry point
├── src/
│   ├── index.js           # Main CLI logic
│   ├── prompts.js         # Interactive prompts
│   ├── generator.js       # Project generation
│   ├── installer.js       # Dependency installation
│   ├── constants.js       # Dependency mapping
│   ├── utils/             # Utility functions
│   └── templates/         # Project templates
├── package.json
└── README.md
```

## Adding New Integrations

To add a new integration (e.g., a new UI library):

1. **Update `src/constants.js`:**
   - Add the dependency mapping
   - Include version numbers

2. **Update `src/prompts.js`:**
   - Add the new option to the appropriate prompt

3. **Create template files:**
   - Add template files in `src/templates/[framework]/[integration]/`

4. **Update generator logic:**
   - Add logic in `src/generator.js` to handle the new integration

5. **Test thoroughly:**
   - Test with multiple framework combinations

## Coding Standards

- Use ES modules (`import/export`)
- Use async/await for asynchronous operations
- Add comments for complex logic
- Keep functions small and focused
- Use descriptive variable names
- Follow the existing code style

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally

Examples:
```
Add support for Bun package manager
Fix dependency installation on Windows
Update README with new integration
```

## Adding Templates

When adding new framework templates:

1. Create the base template structure
2. Use EJS for dynamic content
3. Include proper TypeScript configurations
4. Add appropriate .gitignore
5. Create a comprehensive README template
6. Test that generated projects build successfully

## Testing

Before submitting a PR:

1. **Test project generation:**
   - Test with different framework combinations
   - Test with minimal setup (all "None" options)
   - Test with full setup (all integrations)

2. **Test on multiple platforms:**
   - macOS
   - Linux
   - Windows (WSL)

3. **Verify generated projects:**
   - `npm install` succeeds
   - `npm run dev` works
   - TypeScript compiles without errors
   - No console errors

## Questions?

Feel free to open an issue with your question, or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to DevStart CLI! 🚀
