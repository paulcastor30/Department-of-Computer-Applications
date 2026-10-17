# Branches and releases

Use one branch per change and submit a pull request to `main`. Keep branch names short and related to the work, such as `fix/mobile-menu` or `docs/setup`. `main` is the shared integration branch; pushing or merging there may trigger the configured hosting services.

## After a pull request is merged

Delete its remote feature branch when no follow-up work or open pull request needs it. The merged commits remain in `main`; removing the branch removes the extra name pointing to them.

Before deleting a local branch, make sure its work is committed and preserved in `main` or another retained reference. From a clean checkout:

```bash
git switch main
git pull --ff-only origin main
git branch --merged main
git branch -d fix/mobile-menu
```

Use the actual branch name. `git branch -d` refuses deletion when Git cannot establish that the branch is merged. A squash merge may need a separate comparison and pull request review; do not use force deletion merely to silence that refusal.

After remote branches are removed, refresh your local list:

```bash
git fetch origin --prune
```

This removes stale remote-tracking references on your computer. It does not delete branches on GitHub or your local feature branches.

## Branches to keep or review separately

- Keep `main`, branches with active work, and branches used by open pull requests.
- Confirm with the contributor before removing a personal development branch, even when its current commits are merged.
- Preserve a recovery branch until the rollback reason is understood. If it is no longer needed as a branch, retain an agreed tag before deleting it.
- Check hosting settings before removing any branch used for deployment. A merged branch can still have an operational purpose.

Branch cleanup is maintenance, not a way to discard unfinished work. Do not remove branches based only on their age or name.

## Repository settings

Require pull request review and the `frontend-quality` and `backend-quality` checks before merging to `main`. Review the browser workflow results for visible changes. Workflow files do not themselves enable branch protection; verify the repository settings separately.

License, asset permissions, and private reporting-channel decisions remain in [release notes](open-source-launch.md). Deployment instructions are in [DEPLOYMENT.md](../DEPLOYMENT.md).
