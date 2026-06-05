# Security Notice

MSF_DB is an early-stage open-source database productivity toolkit. The repository is intended to contain reusable SQL snippets, documentation examples, workflow templates, and helper scripts only.

Do not commit real credentials, tokens, private keys, production hostnames, internal connection strings, customer data, or exported files that contain sensitive information.

Use `.env.example` to document required environment variables and leave values blank. Keep real `.env` files local, ignored, and outside version control.

Safe examples should use neutral placeholders such as:

- `app_user`
- `app_database`
- `localhost`
- `example.com`
- empty environment variable values

Before opening a pull request, review SQL files, Docker Compose files, workflow JSON, generated documentation, logs, screenshots, and exported data for sensitive content.

If a real secret was committed, rotate or revoke it first. Removing a value from the current branch does not remove it from Git history. See [docs/security-cleanup.md](docs/security-cleanup.md) for cleanup guidance.
