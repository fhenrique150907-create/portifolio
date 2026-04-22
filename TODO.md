# Deployment Plan Progress

## Approved Plan: Deploy Full-Stack Portfolio (Vercel Frontend + Render Backend)

**✅ Step 1: Fix server/src/index.ts bug (Catch → catch)**  
- Fixed via edit_file.

**✅ Step 2: Commit and push changes**  
- Run: `git add . && git commit -m "Fix catch typo" && git push origin main`


**⏳ Step 3: Deploy Frontend to Vercel**  
- User imports repo to vercel.com → auto-deploy client/

**⏳ Step 4: Deploy Backend to Render**  
- User creates Web Service on render.com → auto-provisions via render.yaml

**⏳ Step 5: Update client/src/App.tsx API URL**  
- Replace localhost:4000 → production backend URL

**⏳ Step 6: Final push + test**  
- Verify live site loads profile/projects

