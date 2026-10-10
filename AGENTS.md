<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Pose analysis runs fully client-side (MediaPipe tasks-vision, dynamically imported in PoseAnalyzer) and session history lives in localStorage — no backend yet, so videos never leave the device.
- Lead forms hand off to WhatsApp via `whatsappLink` in src/lib/site.ts — no backend is connected, so this keeps forms functional instead of failing silently.
