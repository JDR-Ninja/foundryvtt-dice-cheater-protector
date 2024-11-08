# Dice RNG Protector
## [Foundry VTT](https://foundryvtt.com) Module
---
It's easy to cheat your roll in Foundry with a little bit of JavaScript knowledge. This module block the most common way to change the dice result.

## Changelog

### 0.2.4
* Version bump to support FoundryVTT V12.331
* Force crypto numbers generator
* Added a value table to improve performance
* Code refactoring
* Fudge : Better algorithm for high and low values
* Fudge Pool
* Many other changes.

### 0.2.1
* Version bump to support FoundryVTT V11.299

### 0.2
🚀Lots of Optimizations!

* Changed the way the settings are retrieved, now the method gets the key of the setting and use it to retrieve it.
* Replaced Settings.getEnableFudgeDice() and Settings.getUseCrypto() with a ternary operator, making the code more concise.
* Replaced the if statement that checks for the value of Settings.fudgeValue with a switch statement, which makes it more readable and efficient.
* Replaced the individual calls to game.settings.register for each setting with a single object that contains all the settings and a loop that iterates over the object's properties and registers them. This reduces the amount of duplicated code and makes it easier to add new settings.

### 0.1.4
Migration to v10
Thanks to NotoriusNeo for his work on the module

Additions:
* Spanish translation.
* GitHub workflow for releases.

Changes:
* Tweaked English and French translations.
* Changed RNG function for more "random" results.
* Changed folder structure to match the v10 template
* Many other minor changes.

### 0.1.3
* Add compatibility for version 9.
* Add Fudge feature.

### 0.1.2
* Convert french file ANSI to UTF8.

### 0.1.1
* Add setting to activate protection only for players.
* Add setting to choose the number generator you want.

### 0.1.0
* Initial release, freeze the number generator.
