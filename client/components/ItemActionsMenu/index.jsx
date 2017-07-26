import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { get } from 'lodash'
import './style.scss'

export class ItemActionsMenu extends React.Component {

    constructor(props) {
        super(props)
        this.state = { isOpen: false }
        this.handleClickOutside = this.handleClickOutside.bind(this)
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true)
    }

    handleClickOutside(event) {
        const domNode = ReactDOM.findDOMNode(this)

        if ((!domNode || !domNode.contains(event.target))) {
            this.setState({ isOpen: false })
        }
    }

    toggleMenu(event) {
        event.preventDefault()
        event.stopPropagation()
        this.setState({ isOpen: !this.state.isOpen })
    }

    closeMenu(event) {
        event.preventDefault()
        event.stopPropagation()
        this.setState({ isOpen: false })
    }

    triggerAction(action, event) {
        this.closeMenu(event)
        action.callback()
    }

    render() {
        const toggleMenu = this.toggleMenu.bind(this)
        const menu = this.state.isOpen ? this.renderMenu(this.props.actions) : null
        const classes = classNames('dropdown', 'ItemActionsMenu', 'pull-right', { open: this.state.isOpen })

        return (
            <div className={classes}>
                <button className="dropdown__toggle" onClick={toggleMenu}>
                    <i className="icon-dots-vertical" />
                </button>
                {menu}
            </div>
        )
    }

    renderMenu(actions) {
        let items = actions.map(this.renderItem.bind(this))

        if (!items.length) {
            items = <li><button onClick={this.closeMenu.bind(this)}>There are no actions available.</button></li>
        }

        return (
            <ul className="dropdown__menu">
                {items}
            </ul>
        )
    }

    renderItem(action) {
        if (Array.isArray(action.callback)) {
            let items = action.callback.map(this.renderItem.bind(this))

            if (!items.length) {
                items = <li><button onClick={this.closeMenu.bind(this)}>There are no actions available.</button></li>
            }

            const submenuDirection = get(action, 'direction', 'left')

            return (
                <li key={'submenu-' + action.label}>
                    <div className="dropdown">
                        <button className="dropdown__toggle" onClick={this.closeMenu.bind(this)}>
                            {action.icon && (<i className={action.icon}/>)}
                            {action.label}
                        </button>
                        <ul className={'dropdown__menu dropdown__menu--submenu-' + submenuDirection}>
                            {items}
                        </ul>
                    </div>
                </li>
            )
        }

        const trigger = this.triggerAction.bind(this, action)
        return (
            <li key={action.label}>
                <button onClick={trigger}>
                    {action.icon && (<i className={action.icon}/>)}
                    {action.label}
                </button>
            </li>
        )
    }
}

ItemActionsMenu.propTypes = { actions: PropTypes.array.isRequired }
