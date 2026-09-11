# TokenScope H5 implementation plan

## Goal
Interactive local workbench for LLM API compatibility, protocol support, passthrough, and customer-issue analysis.

## Phases
- [x] Review the current prototype and reference requirements
- [x] Build shared application shell, navigation, glass layout, and TokenScope logo
- [x] Implement dashboard, provider configuration, and capability matrix with vendor marks
- [x] Implement Token Probe, test suites, protocol tests, and video task flow
- [x] Implement A/B comparison, report center, customer inquiry, docs, and local persistence
- [x] Fill user manuals from the Feishu wiki overview and public protocol references

## Product decisions
- Static H5 prototype, opens from `file://`.
- localStorage key `tokenscope-v3` so stale fake homepage numbers are not reused.
- Simulated runs only; API keys stay on the machine.
- Dashboard stats are derived from the current provider/model/case lists.
