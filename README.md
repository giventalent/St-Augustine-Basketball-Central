# St. Augustine Basketball Platform

A complete, mobile-friendly basketball website and browser publisher for St. Augustine School in Ossining, NY.

## Included

- ESPN-style homepage with a featured story, score ribbon and season dashboard
- Game recaps, schedules, announcements and player/team spotlight
- Filterable photo gallery with full-screen viewer
- Face-safe photo presentation: complete images use `object-fit: contain` across cards, galleries, newsletters, publisher previews and mobile layouts, so people are not cropped
- Four-page newsletter at `newsletter.html`, including print/PDF styling
- Approved **“Let’s Go Eagles!”** varsity footer
- Staff publisher at `publisher.html`
- Smart offline recap drafting plus optional connection to an organization-approved OpenAI-compatible service
- Browser photo resizing and metadata removal through JPEG re-encoding
- Draft saving, JSON backups and responsive previews
- Atomic GitHub publishing: data and new photos are committed together

The original St. Augustine logo, 10 game-action photos, team photo, announcements and four-page newsletter content are preserved.

## Publish the website on GitHub Pages

1. Create or open the public website repository.
2. Upload **all files and folders in this package** to the repository root.
3. In the repository, open **Settings → Pages**.
4. Select **Deploy from a branch**, `main`, and `/ (root)`.
5. Save and open the Pages address after deployment finishes.

Do not upload only `index.html`; it depends on `styles.css`, JavaScript, `data/` and `assets/`.

## Use the publisher

1. Open `publisher.html` from the deployed site, or open it locally in Microsoft Edge/Chrome.
2. Update stories, scores, games, photos, announcements and the spotlight.
3. Use **Create instant draft** for a fast offline recap, or configure an approved AI endpoint under **Optional AI connection**.
4. Review Desktop, Phone and four-page newsletter previews.
5. Confirm school approval and photo/name permissions.
6. In **Publish**, enter `owner/repository`, branch and a repository-limited token.
7. Select **Publish to GitHub**.

The publisher uses the Git Data API to create one commit containing `data/site-data.json`, its local-file fallback and all new photos. If any step fails, the public branch is not moved.

## GitHub token safety

Use a fine-grained personal access token or GitHub App user token that:

- Is limited to only the basketball website repository
- Has **Contents: Read and write** permission
- Has a short expiration

The publisher never writes the token to local storage or the repository. It clears the field after a successful publication and the browser discards it when the tab closes. Anyone who can open `publisher.html` can view the editing interface, but cannot change the repository without an authorized token.

For stricter access control, host the publisher from a private staff-only location and set its repository target to the public website repository.

## AI recap configuration

The package does not include an API key or force a specific AI provider. Under **Optional AI connection**, enter:

- An organization-approved OpenAI-compatible chat-completions endpoint
- The approved model/deployment name
- A session-only API key

The key remains only in the current tab. Every generated recap is a draft and should be checked against the score, names and notes before publication. The system prompt instructs the model not to invent facts.

## Content files

- `data/site-data.json` — published source of truth
- `data/site-data.js` — synchronized fallback for opening files locally
- `assets/` — school logo and approved photos

If editing by hand, keep the JSON and JS fallback synchronized. The publisher does this automatically.

## Privacy checklist

Before every publication:

- Confirm school authorization
- Confirm photo and name permissions
- Avoid student surnames, private contact details and sensitive information
- Use meaningful alternative text without adding information not visible in the photo
- Keep original full-resolution media in approved school storage, not in the public repository
