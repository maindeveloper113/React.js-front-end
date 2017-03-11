import * as React from 'react';
import { browserHistory } from 'react-router';

import PerfectScrollbar from 'react-perfect-scrollbar';

export const IndexSearch = React.createClass({
    getInitialState() {
        return {
            dropdown: false,
            query: "",
            placeholder: "City, Neighborhood, Development, etc",
            type: 'all',
            status: 'sale',
            types: {
                all: 'All',
                commercial: 'Commercial',
                residential: 'Residential'
            },
            load: false,
            autocomplete: [],
        };
    },
    componentDidMount() {
        this.setState({
            dropdown: false,
        });
        window.addEventListener('click', this.dropdownHide, false);
    },
    componentWillUnmount() {
        window.removeEventListener('click', this.dropdownHide, false);
    },
    dropdownHide(){
        this.setState({
            dropdown: false
        });
    },
    handleSelect(type){
        this.setState({
            type: type,
            dropdown:false
        });
    },
    dropdownToggle(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            dropdown: !this.state.dropdown
        });
    },
    handleSubmit(e){
        e.preventDefault();
        e.stopPropagation();
        browserHistory.push("/properties?query="+this.state.query+"&status="+this.state.status+"&type="+this.state.type);
    },
    setQuery(value){
        this.setState({query: value})
        this.getAutocomplete(value);
    },
    getAutocomplete(query){
        $.ajax({
            url: 'http://idsrealty-api.fgeekdemos.org/search/autocomplete/',
            type: 'POST',
            dataType: 'json',
            data: {
                query: query,
                status: this.state.status,
                type: this.state.type
            }
        })
        .done(function(result) {
            this.setState({autocomplete: result.items});
        }.bind(this));
    },
    render() {
        return (
            <form className="index-search" onSubmit={this.handleSubmit}>
                <div className="index-search__container">
                    <div className="index-search__select">
                        <div className="index-search__filter" onClick={this.dropdownToggle}>{this.state.types[this.state.type]}</div>
                        <div className="index-search__list" style={{display: (this.state.dropdown) ? "block" : "none"}}>
                            <div className="index-search__item" onClick={ (e) => this.handleSelect("all") }>All</div>
                            <div className="index-search__item" onClick={ (e) => this.handleSelect("residential") }>Residential</div>
                            <div className="index-search__item" onClick={ (e) => this.handleSelect("commercial") }>Commercial</div>
                        </div>
                    </div>
                    <div className="index-search__input">
                        <div className="index-search__tabs">
                            <div className={(this.state.status=='sale') ? "index-search__tab index-search__tab_active" : "index-search__tab"}
                                onClick={ (e) => this.setState({status: 'sale'})}>For Sale</div>
                            <div className={(this.state.status=='rent') ? "index-search__tab index-search__tab_active" : "index-search__tab"}
                                onClick={ (e) => this.setState({status: 'rent'})}>For Rent</div>
                            <div className={(this.state.status=='lease') ? "index-search__tab index-search__tab_active" : "index-search__tab"}
                                onClick={ (e) => this.setState({status: 'lease'})}>For Lease</div>
                        </div>
                        <input
                            placeholder={this.state.placeholder}
                            type="text"
                            onChange={ (e) => this.setQuery(e.target.value)}
                            value={this.state.query}/>
                        <div className="index-search__autocomplete" style={{height: (this.state.autocomplete.length>10) ? "153px" : "auto"}}>
                            <PerfectScrollbar>
                                {this.state.autocomplete.map(function(item){
                                    return(
                                        <div key={item}
                                            onClick={(e) => this.setState({query: item, autocomplete: []})}
                                            className="index-search__autocomplete-item">{item}</div>
                                    );
                                }.bind(this))}
                            </PerfectScrollbar>
                        </div>
                    </div>
                    <button type="submit" className="index-search__btn">
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            </form>
        );
    }
})
