"use strict";

const currencies = new RatesBoard();
const money = new MoneyManager();
const favorites = new FavoritesWidget();

refreshCurrent();
refreshCurrencies();
setInterval(refreshCurrencies, 60000);
refreshFavorites();

function refreshCurrent() {
    ApiConnector.current((response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        };
    });
};

function refreshCurrencies() {
    currencies.clearTable();
    ApiConnector.getStocks((response) => {
        if (response.success) return currencies.fillTable(response.data);
    });
};

function refreshFavorites() {
    ApiConnector.getFavorites((response) => {
        if (response.success) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            money.updateUsersList(response.data);
        };
    });
};



money.addMoneyCallback = (obj) => {
    ApiConnector.addMoney(obj, (response) => {
        const responseResult = response.success;
        if (responseResult) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(responseResult, `Кошелек пополнен на ${obj.amount} ${obj.currency}`);
        } else if (!responseResult) {
            money.setMessage(responseResult, response.error);
        };
    });
};

money.conversionMoneyCallback = (obj) => {
    ApiConnector.convertMoney(obj, (response) => {
        const responseResult = response.success;
        if (responseResult) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(responseResult, `Успешная конвертация ${obj.fromAmount} ${obj.fromCurrency} в ${obj.targetCurrency} по текущему курсу`);
        } else if (!responseResult) {
            money.setMessage(responseResult, response.error);
        };
    });
};

money.sendMoneyCallback = (obj) => {
    ApiConnector.transferMoney(obj, (response) => {
        const responseResult = response.success;
        if (responseResult) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(responseResult, `Успешный перевод ${obj.amount} ${obj.currency} пользователю с id: ${obj.to}`);
        } else if (!responseResult) {
            money.setMessage(responseResult, response.error);
        };
    });
};

favorites.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        const responseResult = response.success;
        if (responseResult) {
            favorites.setMessage(responseResult, `Пользователь с id: ${data.id} и логином: "${data.name}" добавлен в список`);
            refreshFavorites();
        } else if (!responseResult) {
            favorites.setMessage(responseResult, response.error);
        };
    });
};

favorites.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, (response) => {
        const responseResult = response.success;
        if (responseResult) {
            favorites.setMessage(responseResult, `Пользователь с id: ${id} удален из списка`);
            refreshFavorites();
        } else if (!responseResult) {
            favorites.setMessage(responseResult, response.error);
        };
    });
};

const logoutAction = new LogoutButton();
logoutAction.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) location.reload();
    });
};