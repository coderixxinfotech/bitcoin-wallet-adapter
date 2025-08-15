# 🔄 Conventional Commits Guide

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

## 📝 Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### **Commit Types**

| Type | Description | Version Bump |
|------|-------------|--------------|
| `fix:` | Bug fixes | **PATCH** (1.0.1) |
| `feat:` | New features | **MINOR** (1.1.0) |
| `BREAKING CHANGE:` | Breaking changes | **MAJOR** (2.0.0) |
| `docs:` | Documentation only | No release |
| `style:` | Code style changes | No release |
| `refactor:` | Code refactoring | No release |
| `perf:` | Performance improvements | **PATCH** |
| `test:` | Adding tests | No release |
| `chore:` | Build process or tools | No release |

### **Examples**

#### ✅ **Good Examples**

```bash
# Bug fix (patch release)
git commit -m "fix: resolve wallet connection timeout issue"

# New feature (minor release)
git commit -m "feat: add support for Phantom wallet"

# Breaking change (major release)
git commit -m "feat: migrate to new wallet standard

BREAKING CHANGE: wallet connection API has changed"

# Feature with scope
git commit -m "feat(hooks): add useWalletBalance hook"

# Bug fix with scope
git commit -m "fix(components): prevent duplicate wallet connections"
```

#### ❌ **Bad Examples**

```bash
# Too vague
git commit -m "update code"

# Not conventional format
git commit -m "Added new wallet support"

# Missing type
git commit -m "wallet connection fixes"
```

### **Scopes (Optional)**

- `hooks` - Hook-related changes
- `components` - Component changes
- `utils` - Utility function changes
- `types` - TypeScript type changes
- `docs` - Documentation changes

### **Breaking Changes**

For breaking changes, include `BREAKING CHANGE:` in the commit body:

```bash
git commit -m "feat: update wallet connection API

BREAKING CHANGE: useWalletConnect hook now returns a promise"
```

## 🚀 **Automated Release Process**

When you push commits to `main` branch:

1. **Analysis**: Semantic-release analyzes commit messages
2. **Version**: Determines next version based on commit types
3. **Changelog**: Generates CHANGELOG.md automatically
4. **Release**: Creates GitHub release and publishes to NPM
5. **Tag**: Creates git tag with version number

## 📊 **Release Examples**

| Commits Since Last Release | Next Version | Example |
|----------------------------|--------------|---------|
| `fix: bug fix` | 1.8.3 | Patch release |
| `feat: new feature` | 1.9.0 | Minor release |
| `feat: BREAKING CHANGE` | 2.0.0 | Major release |
| `docs: update readme` | No release | Documentation only |

---

**🎯 Quick Tip**: Use `git log --oneline` to see recent commit messages and ensure they follow the conventional format!
