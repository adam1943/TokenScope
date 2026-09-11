# Findings

- Homepage previously hardcoded `models+33` (38) while only 5 models existed.
- Segmented tabs in suites/reports/docs had no click handlers.
- Feishu wiki is an internal VOD handbook: billing, auth, task query, media upload, API, multimodal, super-resolution, subtitle erase, plus Beijing/HK/US/DE onboarding.
- Four live wire protocols to test: Chat Completions, Responses, Anthropic Messages, Gemini generateContent/streamGenerateContent.
- Seedance terminal state is `succeeded` (not `completed`); video URL lives at `content.video_url` and expires in 24h.
