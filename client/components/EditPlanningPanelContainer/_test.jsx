import React from 'react'
import { shallow, mount } from 'enzyme'
import { EditPlanningPanelContainer, EditPlanningPanel } from './index'
import { createTestStore } from '../../utils'
import { Provider } from 'react-redux'
import * as actions from '../../actions'
import sinon from 'sinon'
import moment from 'moment'

describe('planning', () => {

    describe('containers', () => {

        describe('<EditPlanningPanelContainer />', () => {

            it('open the panel for read only preview', () => {
                let store = createTestStore({
                    initialState: {
                        privileges: {
                            planning: 1,
                            planning_planning_management: 1,
                        },
                    },
                })
                const wrapper = mount(
                    <Provider store={store}>
                        <EditPlanningPanelContainer />
                    </Provider>
                )
                store.dispatch(actions.previewPlanning())
                expect(store.getState().planning.editorOpened).toBe(true)
                expect(store.getState().planning.readOnly).toBe(true)
                wrapper.find('.EditPlanningPanel__actions__edit').last().simulate('click')
                expect(store.getState().planning.editorOpened).toBe(false)
            })

            it('open the panel in edit mode', () => {
                const store = createTestStore({
                    initialState: {
                        privileges: {
                            planning: 1,
                            planning_planning_management: 1,
                        },
                        planning: {
                            plannings: {
                                planning1: {
                                    _id: 'planning1',
                                    lock_user: 'user',
                                    lock_session: 123,
                                },
                            },
                            editorOpened: true,
                            currentPlanningId: 'planning1',
                            readOnly: false,
                        },
                        session: {
                            identity: { _id: 'user' },
                            sessionId: 123,
                        },
                        users: [{ _id: 'user' }],
                    },
                })
                const wrapper = mount(
                    <Provider store={store}>
                        <EditPlanningPanelContainer />
                    </Provider>
                )

                wrapper.find('button[type="reset"]').first().simulate('click')
                expect(store.getState().planning.editorOpened).toBe(false)
            })

            it('cancel', () => {
                const store = createTestStore({
                    initialState: {
                        privileges: {
                            planning: 1,
                            planning_planning_management: 1,
                        },
                        planning: {
                            plannings: {
                                planning1: {
                                    _id: 'planning1',
                                    slugline: 'slug',
                                    coverages: [{ _id: 'coverage1' }],
                                    lock_user: 'user',
                                    lock_session: 123,
                                },
                            },
                            editorOpened: true,
                            currentPlanningId: 'planning1',
                            readOnly: false,
                        },
                        session: {
                            identity: { _id: 'user' },
                            sessionId: 123,
                        },
                        users: [{ _id: 'user' }],
                    },
                })
                const wrapper = mount(
                    <Provider store={store}>
                        <EditPlanningPanelContainer />
                    </Provider>
                )

                const sluglineInput = wrapper.find('Field [name="slugline"]')

                // Modify the slugline and ensure the save/cancel buttons are active
                expect(sluglineInput.props().value).toBe('slug')
                sluglineInput.simulate('change', { target: { value: 'NewSlug' } })
                expect(sluglineInput.props().value).toBe('NewSlug')

                const saveButton = wrapper.find('button[type="submit"]').first()
                const cancelButton = wrapper.find('button[type="reset"]').first()
                expect(saveButton.props().disabled).toBe(false)
                expect(cancelButton.props().disabled).toBe(false)

                // Cancel the modifications and ensure the save & cancel button disappear once again
                cancelButton.simulate('click')
                expect(store.getState().planning.editorOpened).toBe(false)
                store.dispatch(actions.previewPlanning('planning1'))
                expect(sluglineInput.props().value).toBe('slug')
                expect(wrapper.find('button[type="submit"]').length).toBe(0)
                expect(wrapper.find('button[type="reset"]').length).toBe(0)
            })

            it('displays the `agenda spiked` badge', () => {
                const wrapper = shallow(
                    <EditPlanningPanel
                        closePlanningEditor={sinon.spy()}
                        agendaSpiked={true}
                        pristine={false}
                        submitting={false}/>
                )
                const badge = wrapper.find('.AgendaSpiked').first()
                const saveButton = wrapper.find('button[type="submit"]')

                // Make sure the `save` button is not shown
                expect(saveButton.length).toBe(0)

                // Make sure the `agenda spiked` badge is shown
                expect(badge.text()).toBe('agenda spiked')
            })

            it('displays the `planning spiked` badge', () => {
                const planning = {
                    slugline: 'Plan1',
                    state: 'spiked',
                }
                const wrapper = shallow(
                    <EditPlanningPanel
                        planning={planning}
                        closePlanningEditor={sinon.spy()}
                        pristine={false}
                        submitting={false} />
                )

                const badge = wrapper.find('.PlanningSpiked').first()
                const saveButton = wrapper.find('button[type="submit"]')

                // Make sure the `save` button is not shown
                expect(saveButton.length).toBe(0)

                // Make sure the `planning spiked` badge is shown
                expect(badge.text()).toBe('planning spiked')
            })

            it('displays the `event spiked` badge', () => {
                const event = {
                    name: 'Event 1',
                    state: 'spiked',
                    dates: {
                        start: moment('2016-10-15T13:01:00+0000'),
                        end: moment('2016-10-15T14:01:00+0000'),
                    },
                }
                const wrapper = shallow(
                    <EditPlanningPanel
                        event={event}
                        closePlanningEditor={sinon.spy()}
                        pristine={false}
                        submitting={false} />
                )

                const badge = wrapper.find('.EventSpiked').first()
                const saveButton = wrapper.find('button[type="submit"]')

                // Make sure the `save` button is not shown
                expect(saveButton.length).toBe(0)

                // Make sure the `event spiked` badge is shown
                expect(badge.text()).toBe('event spiked')
            })
        })
    })
})
