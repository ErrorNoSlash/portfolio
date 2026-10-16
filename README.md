<p align="center">
  <img src="assets/banner.svg" alt="Dias Stas — portfolio. Front-end developer" width="100%">
</p>

<p align="center">
  <b>My portfolio — who I am, what I build and how to reach me.</b><br>
  Live at <a href="https://hello.errornoslash.be">hello.errornoslash.be</a> · same style as my <a href="https://contact.errornoslash.be">contact page</a>
</p>

|            |                                                         |
| ---------- | ------------------------------------------------------- |
| **Stack**  | vanilla HTML, CSS and JavaScript                        |
| **Build**  | none — open `index.html` and it runs                    |
| **Look**   | one big grid of lines, two fonts, black and white       |
| **Hosted** | GitHub Pages, on a subdomain                            |

---

## The site

The home page is one page of four full screens. You land on the intro and scroll on from there.

| #  | screen        | what is on it                                                                 |
| -- | ------------- | ----------------------------------------------------------------------------- |
| 01 | **landing**   | big title, typed intro, the spinning ASCII donut and three "doors"            |
| 02 | **projecten** | the projects as folders with a picture of each                               |
| 03 | **over**      | the portrait on a pass, the story, skills, a `now.txt` note and the socials   |
| 04 | **contact**   | `ZEG HALLO`, a mail window, the address, a status window and the socials      |

Plus a page per project, a 404 page and a page for visitors without JavaScript.

## Projects

| project          | page                                                                       | on the page                                       |
| ---------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| personal-website | [personal-website.html](pages/projects/personal-website.html)             | a live, scaled-down preview that tours the site  |
| SlashyOS         | [slashyos.html](pages/projects/slashyos.html)                             | the desktop screenshot, possessed by symbols      |
| blog             | [blog.html](pages/projects/blog.html)                                     | a markdown file turning into a page              |

Every project page fits one screen: the story and numbered features on the left, a window with the project on the right, and the links as cards at the bottom.

## Features

### 🎨 Look

- **Brutalist sheet** — every part of the page is a bordered row, with a sticky nav on top
- **Neo-brutalist touches** — cards with hard shadows, tilted stickers, graph paper and tape
- **Huge titles** — letters spread across the row with two sliced echoes, any word length fits
- **Light and dark** — follows the system theme

### 🖱️ Moving around

- **Nav that follows you** — the prompt types the command of the screen you are on, its pill lights up and a line fills while you scroll
- **Soft snapping** — stop scrolling near the start of a screen and the page glides the rest of the way (never pulls you back, phones scroll freely)
- **Everything animates in** — rows, tiles and links rise in one after the other, on every load
- **Link rows** fill with a soft circle on hover
- **Custom cursor** — a dot with a gliding ring that inverts on light and dark parts; over a link it becomes a filled disc
- **Possessed pictures** — moving over the portrait or the SlashyOS screenshot turns them into flickering terminal symbols
- **Curtain** wipes up between the pages, after a short terminal-style preloader
- **Tab title** types and deletes small commands, like a shell prompt

### ✨ Small details

| where        | detail                                                                         |
| ------------ | ------------------------------------------------------------------------------ |
| landing      | the ASCII donut is drawn live in JavaScript and tilts towards your mouse       |
| projecten    | a folder lifts, pulls its paper out and fills in its big number on hover      |
| over         | the pass swings, a spotlight follows the pointer and the asterisk spins        |
| contact      | the mail window builds the `$ mail -s "…"` command as you type                 |
| contact      | a `$ dias --status` window shows my local time in Belgium                      |
| contact      | a button copies the mail address                                               |

### 📱 Every screen

- **Desktop** — tested on 4K, 1440p and 1080p at every Windows scale from 25% to 200%
- **Phones** — tested from 320px (iPhone SE) to 430px (Pro Max), Android sizes and iPads
- **Menu pill** on phones opens a terminal-style panel with every page and the socials
- **Rotate notice** — a phone turned sideways gets a "draai je telefoon rechtop" screen
- **Light on slow laptops** — the donut and marquees rest when you cannot see them

### 🧩 Extras

- **No JavaScript?** Visitors are sent to `noscript.html`, a single terminal window that keeps every link working
- **404 page** in the same window style, showing the path you tried
- **Link preview** — Open Graph and Twitter tags with a 1200×630 image
- **Footer year** updates itself

## Run locally

No build step. Serve the folder (needed for the 404 page and the live preview):

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy

Served with GitHub Pages on a subdomain:

1. Push to the published branch
2. Add a `CNAME` record at the DNS provider: `hello` → `errornoslash.github.io`
3. Keep the `CNAME` file in this repo — it holds the custom domain

## Customize

| to change           | edit                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------- |
| a project           | its `<a class="project-card">` in the `#projecten` screen, and its page in `pages/projects/` |
| the landing intro   | the `.intro` block in the `#home` screen (the typed line is `data-text` on `#typed-line`) |
| the story / skills  | the `.about` block in the `#over` screen                                                  |
| the tab title       | the `tabCommands` list at the top of `scripts/tabTitle.js`                                |
| the donut           | the constants at the top of `scripts/asciiDonut.js`                                       |
| the hover speed     | `--fill-time` at the top of `styles/style.css`                                            |
| the profile picture | replace `images/pfp.jpg`                                                                  |
| the link preview    | the Open Graph tags in every page, and `assets/og-image.svg` → `images/og-image.png`     |
| the colours         | the CSS variables at the top of `styles/style.css`                                        |

The main colours, the same as the contact page:

```css
:root {
    --black: #040507;
    --grey: #AEB5B8;
    --border: #525252;
}
```

## Structure

<details>
<summary>Show the file tree</summary>

```
.
├── index.html          # the one page: landing, projecten, over and contact
├── 404.html            # page not found (paths start at / so it works on any url)
├── noscript.html       # shown when JavaScript is turned off
├── pages/projects/     # one page per project
├── CNAME               # custom domain for GitHub Pages
├── robots.txt
├── sitemap.xml
├── favicon.ico         # tab icon (16, 32, 48)
├── assets/
│   ├── banner.svg      # banner at the top of this README
│   ├── og-image.svg    # source of the link preview image
│   └── homelab-logo.*  # artwork, not used on the site yet
├── images/
│   ├── pfp.jpg              # profile picture
│   ├── slashyos.jpg         # screenshot on the SlashyOS page and its folder
│   ├── slashyos-blur.jpg    # tiny blurred copy, behind the screenshot on its folder
│   ├── blog.jpg             # screenshot of the blog home page, on its folder
│   ├── favicon.svg          # tab icon (dot-matrix DS)
│   ├── apple-touch-icon.png
│   └── og-image.png         # link preview image (1200×630)
├── styles/
│   ├── normalize.css
│   ├── window.css      # the single window of noscript.html and 404.html
│   └── style.css       # colours, layout, transitions
└── scripts/
    ├── preloader.js      # preloader with progress bar
    ├── pageTransition.js # curtain wipe between the pages
    ├── cursor.js         # custom cursor
    ├── getYear.js        # dynamic footer year
    ├── tabTitle.js       # typing and deleting text in the browser tab
    ├── title.js          # spreads the big title letters and times their rise
    ├── reveal.js         # rows, tiles and links rise in when they come into view
    ├── marquee.js        # endless scrolling text
    ├── typedIntro.js     # typed line on the landing
    ├── asciiDonut.js     # spinning ascii donut that follows the mouse
    ├── scrollSnap.js     # soft snapping to the start of a screen
    ├── navOnScroll.js    # nav prompt, active pill and progress line
    ├── copyMail.js       # copy button next to the mail address
    ├── mailComposer.js   # mail window on the contact screen
    ├── localTime.js      # my local time in the status window
    ├── menu.js           # menu panel on phones
    ├── cardSpotlight.js  # spotlight on the pass
    ├── pictureSymbols.js # possessed pictures (portrait, SlashyOS screenshot)
    ├── sitePreview.js    # live preview on the personal-website page
    └── notFound.js       # shows the missing path on the 404 page
```

</details>

## License

MIT. Icons are from [Phosphor Icons](https://phosphoricons.com) (MIT).

---

<p align="center">
  <code>©Dias Stas</code> · <a href="https://contact.errornoslash.be">Contact</a> · <a href="https://blog.errornoslash.be">Blog</a> · <a href="https://github.com/ErrorNoSlash">GitHub</a> · <a href="https://mastodon.social/@slashy">Mastodon</a>
</p>
