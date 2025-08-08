# 📦 Publishing Guide for n8n-nodes-service-desk-plus

This guide will help you publish the ServiceDesk Plus node to npm.

## 🔧 Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm CLI**: Ensure npm is installed and updated
3. **Authentication**: Login to npm via CLI

## 📋 Pre-Publishing Checklist

### ✅ Package Configuration
- [x] Updated `package.json` with proper metadata
- [x] Added n8n-specific configuration
- [x] Set up build scripts
- [x] Created `.npmignore` file
- [x] Added proper dependencies and peerDependencies

### ✅ Code Quality
- [x] TypeScript compilation passes
- [x] All files build successfully
- [x] Assets are copied to dist folder

### ✅ Documentation
- [x] Updated README.md with new features
- [x] Added installation instructions
- [x] Documented all operations

## 🚀 Publishing Steps

### 1. Login to npm
```bash
npm login
```
Enter your npm credentials when prompted.

### 2. Update Package Information
Before publishing, update these fields in `package.json`:

```json
{
  "author": {
    "name": "Your Actual Name",
    "email": "your.actual.email@example.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/youractualusername/n8n-nodes-service-desk-plus.git"
  },
  "homepage": "https://github.com/youractualusername/n8n-nodes-service-desk-plus"
}
```

### 3. Version Management
Update the version in `package.json` based on your changes:

```bash
# For patch releases (bug fixes)
npm version patch

# For minor releases (new features)
npm version minor

# For major releases (breaking changes)
npm version major
```

### 4. Final Build
```bash
npm run build
```

### 5. Test Package Contents
Verify what will be published:
```bash
npm pack --dry-run
```

### 6. Publish to npm
```bash
# For first-time publishing
npm publish

# For scoped packages (if using @yourorg/package-name)
npm publish --access public
```

## 🔄 Update Workflow

For future updates:

1. Make your changes
2. Update version: `npm version patch|minor|major`
3. Build: `npm run build`
4. Publish: `npm publish`

## 📊 Post-Publishing

### Verify Publication
1. Check your package on [npmjs.com](https://www.npmjs.com/package/n8n-nodes-service-desk-plus)
2. Test installation: `npm install n8n-nodes-service-desk-plus`

### Update Documentation
1. Update README.md with installation instructions
2. Create GitHub releases
3. Update any external documentation

## 🛠 Installation for Users

Once published, users can install your node:

### Community Nodes (Recommended)
1. Go to n8n Settings → Community Nodes
2. Install: `n8n-nodes-service-desk-plus`

### Manual Installation
```bash
# In n8n installation directory
npm install n8n-nodes-service-desk-plus

# Restart n8n
npm start
```

## 🔍 Troubleshooting

### Common Issues

**Build Errors:**
```bash
npm run lint  # Check TypeScript errors
npm run build # Rebuild
```

**Publishing Errors:**
- Ensure you're logged in: `npm whoami`
- Check package name availability
- Verify version number is higher than current

**Installation Issues:**
- Ensure n8n compatibility
- Check peer dependencies
- Verify file paths in package.json

## 📈 Version History

- **v1.0.0** - Initial release with attachment management
  - Core ticket operations
  - Advanced reply features
  - Complete attachment management
  - AI integration tools

## 🤝 Contributing

For contributions:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

**Ready to publish?** Follow the steps above and your ServiceDesk Plus node will be available to the n8n community!