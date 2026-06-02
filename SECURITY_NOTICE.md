# Security Notice

Do not commit real credentials, API keys, database passwords, private keys,
access tokens, or production connection strings.

Use `.env.example` to document required environment variables and keep real
`.env` files local.

If a secret is accidentally committed:

1. Revoke or rotate the secret immediately.
2. Remove it from the latest code.
3. Consider cleaning Git history using git-filter-repo or BFG Repo-Cleaner.

4. Force-push only if you understand the impact on collaborators.
5. Review GitHub secret scanning alerts if available.
