<div align="center">
	<h1>More Features for Notion</h1>
	<p>
		<b>Get superpowers for the workflow in <a href="https://www.notion.so">Notion</a> for you and your whole team via browser extension.</b>
	</p>
	<br>
</div>

![GitHub](https://img.shields.io/github/license/Kulesko/more-features-for-notion)


## What this is

This is the source code for [more-features-for-notion](https://github.com/kulesko/more-features-for-notion), a
privacy-first browser extension for Chrome that adds power features so far absent in [notion](https://www.notion.so/),
inspired by other popular applications like [Trello](https://trello.com/). The extension achieves the advanced feature set by utilizing the official Notion API. It is 100% free and open-source.

If you are only interested in running the latest version, you don't need this repo. You can get the latest version
through the Chrome Extensions Marketplace, **as soon as available**.

## Features
#### Do more with your boards and tables
<details>
  <summary>Use hotkeys to tag like Superman</summary>
  <p>
  Hover above a card or table row and press the keys 1,2,..0 to change the tag. The targeted property needs to be configured for the database: simply add an empty  formula with the name <b>#hotkeys_<i>property_name</i></b> 
</p><p> You can even define an alternative hotkey property for when pressing the ALT/Options key. Simply define an empty formula on your database with the name <b>#opt_hotkeys_<i>property_name</i></b> 
	  <br> <i>Inspired by Trello</i>
  </p>
</details>
<details>
  <summary>Flexible Dividers in a Board</summary>
  <p>
  Prepend "==" to the name of a card in a board column and it will be rendered as a divider. Use this for instance to give more structure to your Kanban boards. <br> <i>Inspired by Trello</i>
  </p>
</details>

#### Coming:
- color code any visible property by using formula or text properties

## Getting Started

Configuration is handled from within Notion itself, so you can start right off. For a consistent experience every member
of your team needs to install the same version of the extension and simply connect it to your team's notion workspace.
For security reasons, to use advanced features on a notion database you need to share it with the integration. This is
the default procedure in notion.

For more information please
see [https://developers.notion.com/docs/getting-started](https://developers.notion.com/docs/getting-started#step-2-share-a-database-with-your-integration)

For installing the extension in your local Chrome instance,
please refer to [https://developer.chrome.com](https://developer.chrome.com/docs/extensions/mv3/getstarted/).

## Privacy-First

This browser extension does not use any other third-party service than notion itself, where all optional configuration
occurs.
The app stores Notion's access tokens in the synced storage of the Chrome browser, so you have the same experience on
all of your devices.

## Testing

Currently, only manual testing is possible. Please
use [https://brainy-hydrogen-393.notion.site/Testing](https://brainy-hydrogen-393.notion.site/Testing-d78e6e964cd74212895c37322b0c39ef)
.
