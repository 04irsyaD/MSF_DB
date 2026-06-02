# Security Cleanup Checklist

## Immediate Actions

- [ ] Merge the PR that removes exposed credentials if the diff is correct.
- [ ] Revoke exposed API keys.
- [ ] Rotate database passwords.
- [ ] Regenerate Telegram bot token if exposed.
- [ ] Rotate OpenAI/API provider keys if exposed.
- [ ] Rotate JWT/app secrets if exposed.
- [ ] Check GitHub secret scanning alerts.

## Repository Cleanup

- [ ] Replace hardcoded secrets with environment variables.
- [ ] Add .env.example files.
- [ ] Update .gitignore.
- [ ] Remove sensitive local files from Git tracking.
- [ ] Search the repository for remaining secrets.

## Git History Cleanup

- [ ] Identify files or commits containing secrets.
- [ ] Use git-filter-repo or BFG Repo-Cleaner if secrets are sensitive.
- [ ] Force-push rewritten history only after understanding the impact.
- [ ] Ask collaborators to re-clone the repository after history rewrite.

## Useful Commands

```bash
git rm --cached .env
git rm --cached -r .venv venv
```

```bash
git filter-repo --path path/to/secret-file --invert-paths
```

```bash
git push origin --force --all
git push origin --force --tags
```

Warning: history rewrite should be handled carefully because it changes commit
hashes and can disrupt collaborators.
