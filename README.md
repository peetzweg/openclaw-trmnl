```
     ██████╗██╗      █████╗ ██╗    ██╗██████╗ ██████╗  ██████╗ ████████╗
    ██╔════╝██║     ██╔══██╗██║    ██║██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝
    ██║     ██║     ███████║██║ █╗ ██║██║  ██║██████╔╝██║   ██║   ██║
    ██║     ██║     ██╔══██║██║███╗██║██║  ██║██╔══██╗██║   ██║   ██║
    ╚██████╗███████╗██║  ██║╚███╔███╔╝██████╔╝██████╔╝╚██████╔╝   ██║
     ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═════╝ ╚═════╝  ╚═════╝    ╚═╝

                        ┌─────────────────┐
                        │  ┌───┐   ┌───┐  │
                        │  │ ◉ │   │ ◉ │  │  "beep boop, sending
                        │  └───┘   └───┘  │   to your e-ink display"
                        │                 │
                        │    ╔═══════╗    │
                        │    ║ █████ ║    │
                        │    ╚═══════╝    │
                        └────────┬────────┘
                             ┌───┴───┐
                        ┌────┤ TRMNL ├────┐
                        │    └───────┘    │
                       ╱│╲              ╱│╲
                      ╱ │ ╲            ╱ │ ╲
```

# 🖥️ CLAWD-TRMNL: When AI Meets E-Ink (and They Become Best Friends)

> *"What if your AI assistant could passive-aggressively remind you to drink water... on an e-ink display?"*
> — Someone at 3am during a hackathon

## 🎯 What Is This Glorious Creation?

This is a Claude Code skill that lets your AI buddy send messages directly to your [TRMNL](https://usetrmnl.com) e-ink display. Because why should your notifications be confined to your phone when they could be **aesthetically displayed in gorgeous monochrome**?

## 🚀 Features That Will Change Your Life*

- ✨ **Two-column layout** - Text on the left, images on the right. Revolutionary. Groundbreaking. Columnar.
- 📝 **Markdown support** - Bold your important words. *Italicize your feelings.*
- 🖼️ **Image support** - Display pictures! In black and white! Like a fancy newspaper from 1920!
- 🤖 **AI-powered** - Claude does all the heavy lifting while you sip coffee

*\*Life-changing effects may vary. Not responsible for excessive e-ink addiction.*

## 🛠️ How It Works

```
You: "Hey Claude, remind me to touch grass"
Claude: *sends webhook*
Your TRMNL: 🌱 TOUCH GRASS 🌱
You: *still doesn't touch grass*
```

## 📦 What's In The Box?

| File | Purpose |
|------|---------|
| `markup.html` | The beautiful template that makes your display look *chef's kiss* |
| `trmnl/SKILL.md` | The brain juice that teaches Claude how to talk to your display |
| `working.html` | A backup template, because we're professionals who plan ahead (we totally didn't need this for debugging) |

## 🎮 Usage

Just tell Claude what you want on your display:

```
/terminal display Hello World
```

Or be fancy with images:

```json
{
  "merge_variables": {
    "title": "Hackathon Status",
    "text": "**Sleep:** ❌\n**Coffee:** ✅✅✅\n**Bugs:** Yes",
    "image": "https://i.imgur.com/yourimage.png"
  }
}
```

## 🏆 Why This Exists

Because during a hackathon, someone asked:

> "Wouldn't it be cool if Claude could update my desk display?"

And instead of saying "that's a lot of work," we said **"hold my energy drink"** and here we are.

## ⚡ Requirements

- A TRMNL device (obviously)
- Claude Code (the bestest CLI)
- A webhook URL (we can't give you ours, get your own)
- A questionable sleep schedule (optional but recommended)

## 🐛 Known Issues

- Display doesn't update instantly (it's e-ink, not magic... okay it's a little magic)
- No color support (embrace the monochrome lifestyle)
- May cause you to send way too many messages to your display just because you can

## 🙏 Acknowledgments

- **TRMNL** - For making e-ink displays cool again
- **Claude** - For being a good sport about all these webhook requests
- **Coffee** - The real MVP
- **Sleep** - We'll catch up with you eventually

## 📜 License

MIT - Do whatever you want, we're too tired to enforce anything.

---

*Built with 💜 and ☕ at a hackathon where the real treasure was the webhooks we sent along the way.*
