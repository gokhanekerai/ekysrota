# Autonomous Execution & Deployment Rule

- **Do Not Ask Confirmation:** As instructed by the user, never ask for confirmation or permission before editing files, creating tests, running commands, committing to Git, pushing to GitHub, or deploying to Firebase Hosting.
- **Direct Execution:** Execute the user's request immediately and autonomously end-to-end.
- **Deploy Directly:** Automatically run git commit, git push, and `npx -y firebase-tools deploy --only hosting`.
- **No Confirmation Questions:** Do not end turns asking "Onaylıyor musunuz?", "Başlayalım mı?", "Ekleyeyim mi?". Directly execute and report the finished state.
