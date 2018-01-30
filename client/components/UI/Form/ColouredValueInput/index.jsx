import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {get} from 'lodash';

import {gettext} from '../../../../utils';


import {LineInput, Label} from '../';
import {ColouredValuePopup} from './ColouredValuePopup';

export class ColouredValueInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {openPopup: false};

        this.togglePopup = this.togglePopup.bind(this);
        this.getIconClasses = this.getIconClasses.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    togglePopup() {
        this.setState({openPopup: !this.state.openPopup});
    }

    getIconClasses(val) {
        return val ? classNames('line-input',
            this.props.iconName,
            this.props.iconName + '--' + get(val, this.props.valueKey, get(val, this.props.labelKey))) : 'line-input';
    }

    onChange(value) {
        this.props.onChange(this.props.field, get(value, this.props.valueKey) ? value : null);
        this.togglePopup();
    }

    render() {
        const {
            required,
            value,
            label,
            readOnly,
            labelLeft,
            clearable,
            options,
            labelKey,
            valueKey,
            noMargin,
            popupContainer,
            ...props
        } = this.props;

        return (
            <LineInput
                className="select-coloured-value"
                required={required}
                readOnly={readOnly}
                labelLeft={labelLeft}
                noMargin={noMargin}
                {...props}
            >
                <Label text={label} row={readOnly} light={readOnly} />

                <div className="sd-line-input__input">
                    {readOnly ? (
                        <span className="select-coloured-value__input">
                            <span className={this.getIconClasses(value)}>
                                {get(value, valueKey, get(value, labelKey, gettext('None')))}
                            </span>
                            &nbsp;&nbsp;{get(value, labelKey, '')}
                        </span>
                    ) : (
                        <button type="button"
                            className="dropdown__toggle select-coloured-value__input"
                            onClick={this.togglePopup}
                        >
                            <span className={this.getIconClasses(value)}>
                                {get(value, valueKey, get(value, labelKey, gettext('None')))}
                            </span>
                            &nbsp;&nbsp;{get(value, labelKey, '')}
                            <b className="dropdown__caret" />
                        </button>
                    )}

                    {this.state.openPopup && (
                        <ColouredValuePopup
                            title={label}
                            options={options}
                            getClassNamesForOption={this.getIconClasses}
                            onChange={this.onChange}
                            onCancel={this.togglePopup}
                            clearable={clearable}
                            target="dropdown__caret"
                            labelKey={labelKey}
                            valueKey={valueKey}
                            popupContainer={popupContainer}
                        />
                    )}
                </div>
            </LineInput>
        );
    }
}

ColouredValueInput.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.object,
    })).isRequired,
    readOnly: PropTypes.bool,
    iconName: PropTypes.string.isRequired,
    required: PropTypes.bool,
    labelLeft: PropTypes.bool,
    clearable: PropTypes.bool,

    field: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    labelKey: PropTypes.string,
    valueKey: PropTypes.string,
    noMargin: PropTypes.bool,
    popupContainer: PropTypes.func,
};

ColouredValueInput.defaultProps = {
    required: false,
    labelLeft: false,
    clearable: true,
    labelKey: 'name',
    valueKey: 'qcode',
    noMargin: false,
    readOnly: false,
};