import React from 'react';
import PropTypes from 'prop-types';


export const Input = ({
    field,
    type,
    value,
    onChange,
    placeholder,
    onBlur,
    onClick,
    readOnly,
    refNode,
    className,
}) => {
    const onInputChanged = (e) => {
        let data = e.target.value;

        if (type === 'file') {
            data = e.target.files;
        }

        onChange(field, data);
    };

    return (
        <input
            className={className ? `sd-line-input__input ${className}` : 'sd-line-input__input'}
            type={type}
            name={field}
            value={value}
            placeholder={placeholder}
            onChange={onInputChanged}
            onBlur={onBlur}
            onClick={onClick}
            disabled={readOnly}
            ref={refNode}
        />
    );
};

Input.propTypes = {
    field: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    refNode: PropTypes.func,
    className: PropTypes.string,
};

Input.defaultProps = {
    type: 'text',
    readOnly: false,
};
