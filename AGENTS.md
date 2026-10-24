# Project instructions

## Local-only CI

All CI runs locally. Future agents must not use GitHub-hosted CI or consume
GitHub Actions credits. Never dispatch, rerun, enable, or add hosted workflows.
Use `.ci/local.sh` and read `.ci/README.md`; original workflows are inactive
references in `.ci/archived-workflows/`. Do not register self-hosted runners,
create CI credentials, change security settings or alter branch protection.
