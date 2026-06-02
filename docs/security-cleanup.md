# Security Cleanup Checklist

## Immediate Actions

- [ ] Merge cleanup PR only after reviewing the diff.
- [ ] Revoke exposed API keys.
- [ ] Rotate database passwords.
- [ ] Regenerate Telegram bot token if exposed.
- [ ] Rotate OpenAI/API provider keys if exposed.
- [ ] Rotate JWT/app secrets if exposed.
- [ ] Check GitHub secret scanning alerts.

## Repository Cleanup

- [ ] Replace hardcoded secrets with environment variables.
- [ ] Add `.env.example` files.
- [ ] Update `.gitignore`.
- [ ] Remove sensitive local files from Git tracking.
- [ ] Search the repository for remaining secrets.

## Git History Cleanup

- [ ] Identify files or commits containing secrets.
- [ ] Use `git-filter-repo` or BFG Repo-Cleaner if secrets are sensitive.
- [ ] Force-push rewritten history only after understanding the impact.
- [ ] Ask collaborators to re-clone the repository after history rewrite.

## Useful Commands

Remove tracked local environment folders:

```bash
git rm --cached -r .venv venv
```

Search for common secret patterns:

```bash
rg -n "PASSWORD|TOKEN|SECRET|API_KEY|PRIVATE_KEY|DATABASE_URL" .
```

Check tracked virtual environment files:

```bash
git ls-files .venv venv
```

Review staged changes before committing:

```bash
git diff --cached
```

## Notes

- Removing secrets from the current branch does not remove them from Git history.
- If real secrets were committed, rotate them even after cleanup.
- If sensitive data exists in history, plan a history rewrite carefully and coordinate with collaborators.
