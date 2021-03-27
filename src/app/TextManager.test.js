import TextManager, { deleteItemByIdFromArray } from "./TextManager";
import {cleanup, fireEvent, render} from '@testing-library/react';
import userEvent from "@testing-library/user-event";

describe('TextManager', () => {
    test('should expect deleteItemByIdFromArray return new array whitin item recive ', () => {
        const expected = [{id:1},{id:2},{id:3}];
        const arrayOption = [{id:1},{id:2},{id:3},{id:4}];
        const optionToDelete = {id:4};
        const result = deleteItemByIdFromArray( optionToDelete, arrayOption );

        expect(expected).toEqual(result);
    })

    afterEach(cleanup);

    test('create component within initialState, default option is shown', () => {
        const { getByTestId } = render(
            <TextManager />
        )

        const expected = getByTestId('option_disabled');

        expect(expected).toBeInTheDocument();
    });

    test('create component with initialState, default option not shown', () => {
        const initialState = [{id:"test1", text:"test1"}, {id:"test2", text:"test2"}];
        const { queryByTestId } = render(
            <TextManager initialState={initialState} />
        )

        const expected = queryByTestId('option_disabled');

        expect(expected).not.toBeInTheDocument();
    });

    test('create component with initialState, options are created correctly', () => {
        const initialState = [{id:"test1", text:"test1"}, {id:"test2", text:"test2"}];
        const { queryAllByTestId } = render(
            <TextManager initialState={initialState} />
        )

        const optionList = queryAllByTestId('option_selectable');

        expect( optionList.length ).toEqual( initialState.length );
        expect( optionList[0].text ).toEqual( initialState[0].text );
    });

    test('Test doubleclick in first option and delete', () => {
        const initialState = [{id:"test1", text:"test1"}, {id:"test2", text:"test2"}];
        const { queryAllByTestId } = render(
            <TextManager initialState={initialState} />
        )

        const optionList = queryAllByTestId('option_selectable');

        fireEvent.doubleClick( optionList[0] );

        const optionListAfterDoubleClick = queryAllByTestId('option_selectable')

        expect( optionListAfterDoubleClick.length ).toEqual( initialState.length-1 );
        expect( optionListAfterDoubleClick[0].text ).not.toEqual( initialState[0].text );
    });

    test('Test click in first option and press button remove for delete selected option', () => {
        const initialState = [{id:"test1", text:"test1"}, {id:"test2", text:"test2"}];
        const { queryByTestId , queryAllByTestId } = render(
            <TextManager initialState={initialState} />
        )

        const selectMultiple = queryByTestId('select');
        const optionList = queryAllByTestId('option_selectable');
        const buttonRemove = queryByTestId('button-remove');

        userEvent.selectOptions( selectMultiple, [initialState[0].text] );

        expect( optionList[0].selected ).toBeTruthy();
        fireEvent.click( buttonRemove );

        const optionListAfterClickButtonRemove = queryAllByTestId('option_selectable');

        expect( optionListAfterClickButtonRemove.length ).toEqual( initialState.length-1 );
        expect( optionListAfterClickButtonRemove[0].text ).not.toEqual( initialState[0].text );
    });


    test('Test press button add option and ', () => {
        const initialState = [{id:"test1", text:"test1"}, {id:"test2", text:"test2"}];
        const { queryAllByTestId, queryByTestId } = render(
            <TextManager initialState={initialState} />
        )

        // Mock window.prompt return 'test3'
        global.prompt = () => 'test3';

        const buttonAdd = queryByTestId('button-add');
        fireEvent.click( buttonAdd );

        const optionListAfterClickAddButton = queryAllByTestId('option_selectable');


        expect( optionListAfterClickAddButton.length ).not.toEqual( initialState.length );
        expect( optionListAfterClickAddButton[2].text ).toEqual( 'test3' );
    });

    test('Test press button add option and press undo last change button then initialState must be same at beginning', () => {
        const initialState = [{id:"test1", text:"test1"}, {id:"test2", text:"test2"}];
        const { queryAllByTestId, queryByTestId } = render(
            <TextManager initialState={initialState} />
        )
        /** Add new option */
        // Mock window.prompt return 'test3'
        global.prompt = () => 'test3';
        const buttonAdd = queryByTestId('button-add');
        fireEvent.click( buttonAdd );
        const optionListAfterClickAddButton = queryAllByTestId('option_selectable');
        const optionAdd = optionListAfterClickAddButton[2];
        expect( optionListAfterClickAddButton.length ).not.toEqual( initialState.length );
        expect( optionAdd.text ).toEqual( 'test3' );

        /** Test undo button */
        const buttonUndo = queryByTestId('button-undo');
        fireEvent.click( buttonUndo );

        const optionListAfterClickUndoButton = queryAllByTestId('option_selectable');
        expect( optionListAfterClickUndoButton.length ).toEqual( initialState.length );
        // Expect option add not be in the document
        expect( optionAdd ).not.toBeInTheDocument();
    });
});