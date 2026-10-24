# Local CI

Run `bash .ci/local.sh`; `--check` runs only guard/syntax checks. Logs stay in `.ci/logs/`; nonzero status reports failures or incomplete coverage.

The original workflow only uploaded/deployed static files. The existing local validator now runs through npm test. Future automated Pages deployments are disabled; current published content is unchanged.

Original workflow files are recoverable under `archived-workflows/`. Existing remote logs/artifacts and retention settings are unchanged. Do not restore archived YAML into `.github/workflows`.
