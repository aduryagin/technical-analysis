# Technical Analysis 

Terminal that gives you an ability to check your algorithm or a strategy.

[Technical Indicators library](https://github.com/aduryagin/technical-analysis/tree/main/packages/technical-indicators)

#### Supported API
* Tinkoff
* Binance

<img src="./images/screenshot.gif" />

### Algorithm Testing
With this functionality you can easily test your strategy. Just change the algoritm here backend/src/modules/algorithmTesting/algorithms/index.ts Also you can add notifications there if you need this.

### Custom Indicators
You can create custom indicators either in python (/backend/indicators) or javascript (/frontend/src/pages/chart/indicators)

### Hotkeys
Ctrl + Q - Fullscreen mode

### How to run
You have to install python, poetry, node.js

1) cd frontend && npm i && npm run start
2) cd backend && npm i && npm run start:dev
3) cd backend/indicators && poetry install && poetry run python main.py
