# AGENTS.md — Global Workspace Rules for Antigravity

This file instructs the Antigravity coding assistant to follow the project standards defined in the `ai-rules/` directory at the root of the workspace.

## Critical Guidelines
*   **Rules & Coding Standards**: You must read and strictly adhere to all guidelines located in the `ai-rules/coding-standards/` and `ai-rules/security/` directories before modifying any source code.
*   **Git Rules**: All git commands must be run from the root directory `msf-app/`.
*   **Strict Git Push Restriction**: You are **FORBIDDEN** from running `git push` command. All pushes must be performed manually by the human developer.
*   **Commit Logs**: For every task completed, you must record details of your changes, the files modified, the time, git commit hash, and attribute the change to your model name in the daily commit log `dev-docs/commit-logs/YYYY-MM-DD.md`.
