import React from 'react';
import PropTypes from 'prop-types';
import {SearchField} from '../../UI';
import {differenceBy} from 'lodash';
import {uiUtils} from '../../../utils';
import './style.scss';


import {Popup} from '../../UI/Popup';
import {KEYCODES} from '../../../constants';

export class SelectListPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentParent: null,
            selectedAncestry: [],
            search: false,
            activeOptionIndex: -1,
            openFilterList: false,
        };
        this.onKeyDown = this.onKeyDown.bind(this);
        this.closeSearchList = this.closeSearchList.bind(this);
    }

    onKeyDown(event) {
        if (event) {
            switch (event.keyCode) {
            case KEYCODES.ENTER:
                event.preventDefault();
                this.handleEnterKey(event);
                break;
            case KEYCODES.DOWN:
                event.preventDefault();
                this.handleDownArrowKey(event);
                break;
            case KEYCODES.UP:
                event.preventDefault();
                this.handleUpArrowKey(event);
                break;
            case KEYCODES.LEFT:
                event.preventDefault();
                if (this.state.selectedAncestry.length > 0) {
                    this.popParent(true);
                }
                break;
            case KEYCODES.RIGHT:
                event.preventDefault();
                if (this.state.activeOptionIndex !== -1) {
                    this.onMutiLevelSelect(
                        this.state.filteredList[this.state.activeOptionIndex],
                        true
                    );
                }
                break;
            }
        }
    }

    handleEnterKey() {
        if (this.props.multiLevel) {
            if (this.state.activeOptionIndex !== -1) {
                this.onSelect(this.state.filteredList[this.state.activeOptionIndex]);
            } else {
                this.onSelect(this.state.currentParent);
            }
        } else if (this.state.activeOptionIndex !== -1) {
            this.onSelect(this.state.filteredList[this.state.activeOptionIndex]);
        }
    }

    handleDownArrowKey(event) {
        if (event.target.id && event.target.id.indexOf('SearchField') >= 0) {
            // Lose focus on Search Field
            event.target.blur();

            this.setState({activeOptionIndex: 0});
        } else if (this.state.activeOptionIndex < this.state.filteredList.length - 1) {
            this.setState({activeOptionIndex: this.state.activeOptionIndex + 1});
            uiUtils.scrollListItemIfNeeded(this.state.activeOptionIndex, this.refs.listItems);
        }
    }

    handleUpArrowKey(event) {
        if (this.state.activeOptionIndex === 0) {
            if (this.state.selectedAncestry.length !== 0) {
                this.setState({activeOptionIndex: -1});
            }
        } else {
            this.setState({activeOptionIndex: this.state.activeOptionIndex - 1});
            uiUtils.scrollListItemIfNeeded(this.state.activeOptionIndex, this.refs.listItems);
        }
    }

    componentWillMount() {
        this.setState({filteredList: this.getFilteredOptionList()});
    }

    onSelect(opt) {
        if (this.state.openFilterList) {
            this.props.onChange(opt);
            this.setState({openFilterList: false});
        }
    }

    getFilteredOptionList(currentParent, searchList) {
        if (this.props.multiLevel) {
            let filteredList;

            if (searchList) {
                filteredList = searchList;
            } else {
                filteredList = currentParent ?
                    this.props.options.filter((option) => (
                        option.value.parent === currentParent.value.qcode
                    ), this) :
                    this.props.options.filter((option) => (!option.value.parent));
            }
            return filteredList;
        } else {
            return searchList ? searchList : this.props.options;
        }
    }

    onMutiLevelSelect(opt, keyDown = false) {
        if (opt && !this.state.searchList && this.isOptionAParent(opt)) {
            if (!this.state.selectedAncestry.find((o) => (opt[this.props.valueKey] === o[this.props.valueKey]))) {
                this.setState({
                    currentParent: opt,
                    selectedAncestry: [...this.state.selectedAncestry, opt],
                    filteredList: this.getFilteredOptionList(opt, null),
                    activeOptionIndex: 0,
                });
            }
        } else if (!keyDown) {
            this.onSelect(opt);
        }
    }

    isOptionAParent(opt) {
        return this.props.options.filter((option) => (
            option.value.parent === opt.value.qcode
        )).length > 0;
    }

    chooseEntireCategory() {
        this.onSelect(this.state.currentParent);
    }

    popParent(keydown) {
        const len = this.state.selectedAncestry.length;
        const opt = len > 1 ? this.state.selectedAncestry[len - 2] : null;
        const activeOption = keydown === true ? 0 : -1;

        this.setState({
            currentParent: opt,
            selectedAncestry: this.state.selectedAncestry.splice(0, len - 1),
            filteredList: this.getFilteredOptionList(opt, null),
            activeOptionIndex: activeOption,
        });
    }

    filterSearchResults(val) {
        if (!val) {
            this.setState({
                search: false,
                filteredList: this.getFilteredOptionList(null),
            });
            return;
        }

        const valueNoCase = val.toLowerCase();
        let searchResults = this.props.options.filter((opt) => (
            opt[this.props.valueKey].toLowerCase().substr(0, val.length) === valueNoCase ||
                opt[this.props.valueKey].toLowerCase().indexOf(valueNoCase) >= 0
        ));

        if (this.props.multiLevel && this.props.value) {
            searchResults = differenceBy(searchResults, this.props.value, 'value.qcode');
        }

        this.setState({
            search: true,
            filteredList: this.getFilteredOptionList(null, searchResults),
        });
    }

    openSearchList() {
        if (!this.state.openFilterList) {
            this.setState({filteredList: this.getFilteredOptionList()});
            this.setState({openFilterList: true});
        }
    }

    closeSearchList() {
        if (this.state.openFilterList) {
            this.setState({openFilterList: false});
        }
    }

    renderSingleLevelSelect() {
        return (<div>
            <SearchField onSearch={(val) => {
                this.filterSearchResults(val);
            }} minLength={1}
            onSearchClick={this.openSearchList.bind(this)} ref="searchField" />
            {this.state.openFilterList &&
                (
                    <Popup
                        close={this.closeSearchList}
                        target={this.props.target}
                        onKeyDown={this.onKeyDown}
                        inheritWidth={true}
                        noPadding={true}
                    >
                        <div className="Select__popup__wrapper">
                            <ul className="Select__popup__list" ref="listItems">
                                {this.state.filteredList.map((opt, index) => (
                                    <li key={index} className={ (index === this.state.activeOptionIndex ?
                                        'Select__popup__item--active ' : '') + 'Select__popup__item'}>
                                        <button type="button" onClick={this.onSelect.bind(this,
                                            this.state.filteredList[index])} >
                                            <span>{ opt.label }</span>
                                        </button>
                                    </li>
                                ))}
                                {this.state.filteredList.length === 0 && <li>
                                    <button className="btn btn--small btn--expanded">Add contact</button></li>}
                            </ul>
                        </div>
                    </Popup>
                )
            }
        </div>);
    }

    renderMultiLevelSelect() {
        return (
            <Popup
                close={this.closeSearchList}
                target={this.props.target}
                onKeyDown={this.onKeyDown}
                inheritWidth={true}
                noPadding={true}
            >
                <div className="form__row">
                    { (this.state.currentParent &&
                                (<div>
                                    <i className="backlink" onClick={this.popParent.bind(this)}/>
                                    <button type="button" className={(this.state.activeOptionIndex === -1 ?
                                        'Select__popup__item--active ' : '') + 'Select__popup__category'}
                                    onClick={this.chooseEntireCategory.bind(this)}>
                                        <div id="parent" className="Select__popup__parent">
                                            {this.state.currentParent.label}
                                        </div>
                                        <div id="choose" className="Select__popup__parent--choose">
                                            Choose entire category</div>
                                    </button>
                                </div>))
                            || <SearchField onSearch={(val) => {
                                this.filterSearchResults(val);
                            }} minLength={1}
                            onSearchClick={this.openSearchList.bind(this)} ref="searchField"/>
                    }
                </div>
                {this.state.openFilterList && (<div className="Select__popup__wrapper">
                    <ul className="dropdown-menu Select__popup__list" ref="listItems">
                        {this.state.filteredList.map((opt, index) => (
                            <li key={index} className={ (index === this.state.activeOptionIndex ?
                                'Select__popup__item--active ' : '') + 'Select__popup__item'} >
                                <button type="button" onClick={this.onMutiLevelSelect.bind(this,
                                    this.state.filteredList[index], false)}>
                                    <span>{ opt.label }</span>
                                    { !this.state.search && this.isOptionAParent(opt) &&
                                        <i className="icon-chevron-right-thin" />
                                    }
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>)}
            </Popup>
        );
    }

    render() {
        return this.props.multiLevel ? this.renderMultiLevelSelect() : this.renderSingleLevelSelect();
    }
}

SelectListPopup.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ]),
        value: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ]),
    })).isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    valueKey: PropTypes.string,
    multiLevel: PropTypes.bool,
    value: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ]),
        value: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ]),
    })),
    target: PropTypes.string,
};

SelectListPopup.defaultProps = {valueKey: 'label'};
