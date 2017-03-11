import * as React from 'react';

import { UserStore } from '../../../stores/UserStore.jsx';

import { Input } from '../../../components/Input.jsx';

export const Login = React.createClass({
    getInitialState() {
        return {
            checkbox: false,
            alert: UserStore.login.alert
        };
    },
    componentDidMount() {
        this.dataUpdated();
        UserStore.bind(UserStore.events.data.update, this.dataUpdated);
    },
    componentWillUnmount() {
        UserStore.unbind(UserStore.events.data.update, this.dataUpdated);
    },
    dataUpdated(){
        this.setState({
            alert: UserStore.login.alert
        });
    },
    wrong(obj){
        obj.addClass('popup-auth__input-wrap_wrong');
        setTimeout( function() {
            obj.removeClass('popup-auth__input-wrap_wrong');
        } , 1000);
    },
    handleSubmit(e){
        e.preventDefault();
        var errors = 0;
        if(UserStore.login.login.trim()==""){
            this.wrong($('.popup-auth__input-wrap_login'));
            errors++;
        }

        if(UserStore.login.password.trim()==""){
            this.wrong($('.popup-auth__input-wrap_pass'));
            errors++;
        }

        if(errors==0){
            UserStore.actionLogin();
        }
    },
    render() {
        return (
            <form className="popup-auth__form popup-auth__form_active" onSubmit={this.handleSubmit}>
                <div className="popup-auth__inputs">
                    <div className="popup-auth__input-wrap">
                        <i className="fa fa-user"></i>
                        <Input  className="popup-auth__input"
                                type="text"
                                placeholder="Username"
                                onChange={ (value) => {
                                    UserStore.login.login = value;
                                }}/>
                    </div>
                    <div className="popup-auth__input-wrap">
                        <i className="fa fa-lock"></i>
                        <Input  className="popup-auth__input"
                                type="password"
                                placeholder="Password"
                                onChange={ (value) => {
                                    UserStore.login.password = value;
                                }}/>
                    </div>
                </div>
                <div className="popup-auth__alert">{this.state.alert}</div>
                <div className="popup-auth__row">
                    <div
                        onClick={(e) => this.setState({checkbox: !this.state.checkbox})}
                        className={(this.state.checkbox) ? "popup-auth__checkbox popup-auth__checkbox_checked" : "popup-auth__checkbox"}>
                        <i className="fa fa-square-o"></i>
                        <i className="fa fa-check-square-o"></i>
                        Remember me
                    </div>
                    {/* <a href="#" className="popup-auth__link">Lost your password?</a> */}
                </div>
                <input className="popup-auth__input popup-auth__input_submit" type="submit" value="Login"/>
            </form>
        );
    }
});
