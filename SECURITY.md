# Security Policy

## Scope

This repository contains database queries, documentation workflows, automation scripts, and application examples. Security issues may include exposed credentials, unsafe scripts, vulnerable dependencies, insecure workflow configuration, or documentation that reveals sensitive information.

## Supported Project State

This project is maintained as a collection of scripts and examples rather than a versioned product. Security fixes are applied to the current default branch.

## Reporting a Vulnerability

If you find a security issue, report it to the repository maintainers through the available private contact path for this project. If no private channel is configured, open a minimal public issue that does not include sensitive details and ask for a secure contact method.

Do not publish:

- Passwords, tokens, API keys, SSH keys, or private certificates
- Production hostnames, private IP addresses, or connection strings
- Customer, employee, financial, or regulated data
- Screenshots that reveal secrets or internal system details
- Exploit steps that could be used against a live environment

## What to Include

When reporting a vulnerability, include:

- A short description of the issue
- The affected file, script, workflow, or dependency
- The impact and likely risk
- Safe reproduction steps using placeholder data
- A suggested fix, if you have one

## Security Guidelines for Contributors

- Never commit `.env` files or real credentials.
- Use placeholder values such as `localhost`, `app_user`, `app_database`, and `example.com`.
- Add warning comments to destructive SQL statements.
- Prefer read-only examples when demonstrating diagnostics.
- Review AI-generated documentation before publishing it.
- Remove private data from exported SQL, JSON, logs, screenshots, and workflow files.

## Response Expectations

Maintainers will review security reports as soon as practical. If the report is valid, the fix may include removing exposed data, rotating affected secrets, updating scripts, patching dependencies, or improving documentation.
