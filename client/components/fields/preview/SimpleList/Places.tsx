import * as React from 'react';
import {get} from 'lodash';

import {superdeskApi} from '../../../../superdeskApi';
import {IListFieldProps} from '../../../../interfaces';

import {PreviewSimpleListItem} from './PreviewSimpleListItem';

export class PreviewFieldPlaces extends React.PureComponent<IListFieldProps> {
    render() {
        const {gettext} = superdeskApi.localization;
        const field = this.props.field ?? 'place';
        const placeNames = (get(this.props.item, field) || [])
            .map((place) => place.name)
            .join(', ');

        if (!placeNames.length) {
            return null;
        }

        return (
            <PreviewSimpleListItem
                label={gettext('Places:')}
                data={placeNames}
            />
        );
    }
}
