"use strict";

const user = new UserForm();

user.loginFormCallback = (data) => {
    ApiConnector.login(data, (response) => {
        if (response.success) {
            location.reload();
        } else if (!response.success) {
            user.setLoginErrorMessage(response.error);
        };
    })       
};

user.registerFormCallback = (data) => {
    ApiConnector.register(data, (response) => {
        if (response.success) {
            location.reload();
        } else if (!response.success) {
            user.setRegisterErrorMessage(response.error);
        };
    })
};


